import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2Icon, TrashIcon, PlusIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, type SortingState, type ColumnFiltersState, type VisibilityState, type RowSelectionState } from '@tanstack/react-table';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { columns as transactionColumns, type Transaction } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Transaksi', href: '/transactions' },
];

interface PageProps {
  flash: { message?: string; error?: string };
  transactions: Transaction[];
}

interface CategoryData {
  category: string;
  amount: number;
  type: string;
}

export default function Transactions() {
  const { transactions, flash } = usePage().props as PageProps;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const pieChartData = [
    { name: 'Income', value: totalIncome, color: '#000000' },
    { name: 'Expense', value: totalExpense, color: '#666666' },
  ];

  const categoryData: CategoryData[] = transactions.reduce((acc: CategoryData[], transaction) => {
    const existing = acc.find(item => item.category === transaction.category);
    if (existing) {
      existing.amount += transaction.amount;
    } else {
      acc.push({ category: transaction.category, amount: transaction.amount, type: transaction.type });
    }
    return acc;
  }, []);

  const table = useReactTable({
    data: transactions,
    columns: transactionColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  const handleBulkDelete = () => {
    const selectedIds = table.getFilteredSelectedRowModel().rows.map(row => row.original.id);
    if (selectedIds.length > 0) {
      router.delete(route('transactions.bulk-delete'), {
        data: { ids: selectedIds },
        onSuccess: () => setRowSelection({}),
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Transaksi" />
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
        {flash?.message && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2Icon className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success!</AlertTitle>
            <AlertDescription className="text-green-700">{flash.message}</AlertDescription>
          </Alert>
        )}
        {flash?.error && (
          <Alert variant="destructive">
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{flash.error}</AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard title="Total Balance" value={balance} isPositive={balance >= 0} />
          <SummaryCard title="Total Income" value={totalIncome} isPositive={true} />
          <SummaryCard title="Total Expense" value={totalExpense} isPositive={false} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Income vs Expense" description="Distribution of your financial transactions">
            {totalIncome > 0 || totalExpense > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No transaction data available
              </div>
            )}
          </ChartCard>
          <ChartCard title="Category Breakdown" description="Amount by category">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value as number)} />
                  <Bar dataKey="amount" fill="#000000" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No category data available
              </div>
            )}
          </ChartCard>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href={route('transactions.create')}>
              <Button><PlusIcon className="w-4 h-4 mr-2" />Tambah Transaksi</Button>
            </Link>
            {Object.keys(rowSelection).length > 0 && (
              <Button variant="destructive" onClick={handleBulkDelete}>
                <TrashIcon className="w-4 h-4 mr-2" />Hapus Terpilih ({Object.keys(rowSelection).length})
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black dark:bg-white border-b border-gray-300">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-6 py-3 text-left text-xs font-semibold text-white dark:text-black uppercase tracking-wider">
                        {header.isPlaceholder ? null : (
                          <div
                            className={header.column.getCanSort() ? 'cursor-pointer select-none hover:text-gray-200 dark:hover:text-gray-700' : ''}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {typeof header.column.columnDef.header === 'function'
                              ? header.column.columnDef.header(header.getContext())
                              : header.column.columnDef.header
                            }
                            {{ asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white dark:bg-black divide-y divide-gray-300 dark:divide-gray-700">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                        {typeof cell.column.columnDef.cell === 'function'
                          ? cell.column.columnDef.cell(cell.getContext())
                          : cell.getValue()
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function SummaryCard({ title, value, isPositive }: { title: string; value: number; isPositive: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${isPositive ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)}
        </div>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
