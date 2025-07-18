import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, CheckCircle2Icon, ChevronDown, CirclePlus, EditIcon, Search, TrashIcon, Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Wallet',
        href: '/balances',
    },
];

export interface Transaction {
    id: number;
    description: string;
    type: string;
    amount: number;
    category: string;
    date: string;
}

export interface Balance {
    id: number;
    name: string;
    current_balance: number;
    created_at?: string;
    updated_at?: string;
}

interface PageProps {
    flash: { message?: string; error?: string };
    transactions: Transaction[];
    balances: Balance[]; // Add balances to props
}

export const transactionColumns: ColumnDef<Transaction>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'description',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Description
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue('description')}</div>,
    },
    {
        accessorKey: 'type',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const type = row.getValue('type') as string;
            return <Badge className={type === 'income' ? 'bg-green-500 text-white' : 'text-white-foreground bg-destructive'}>{type}</Badge>;
        },
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('amount'));
            const type = row.original.type;
            const formatted = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(amount);

            return (
                <div className={`font-medium ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {type === 'income' ? '+' : '-'}
                    {formatted}
                </div>
            );
        },
    },
    {
        accessorKey: 'category',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <Badge variant="outline">{row.getValue('category')}</Badge>,
    },
    {
        accessorKey: 'date',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue('date'));
            return <div>{date.toLocaleDateString()}</div>;
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const transaction = row.original;

            return (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => router.visit(`/transactions/${transaction.id}/edit`)}>
                        <EditIcon className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <TrashIcon className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the transaction.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => router.delete(`/transactions/${transaction.id}`)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            );
        },
    },
];

export default function Transaction({ transactions, balances = [], flash }: PageProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data: transactions,
        columns: transactionColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    // Calculate transaction statistics
    const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // Calculate total balance from all wallets
    const totalBalance = balances.reduce((sum, balance) => sum + Number(balance.current_balance), 0);

    // Category breakdown for pie chart
    const categoryData = useMemo(() => {
        return transactions
            .filter((t) => t.type === 'expense')
            .reduce(
                (acc, transaction) => {
                    const existing = acc.find((item) => item.name === transaction.category);
                    const amount = parseFloat(transaction.amount);
                    if (existing) {
                        existing.value += amount;
                    } else {
                        acc.push({ name: transaction.category, value: amount });
                    }
                    return acc;
                },
                [] as { name: string; value: number }[],
            );
    }, [transactions]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    const handleBulkDelete = () => {
        const selectedIds = table.getFilteredSelectedRowModel().rows.map((row) => row.original.id);
        router.post('/transactions/bulk-delete', { ids: selectedIds });
    };
    const hasWallet = () => {
        return balances && balances.length > 0;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Flash Messages */}
                {flash?.message && (
                    <Alert className="border-green-200 bg-green-50 dark:border-green-300 dark:bg-green-500">
                        <CheckCircle2Icon className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-white-800">Success</AlertTitle>
                        <AlertDescription className="text-white-700">{flash.message}</AlertDescription>
                    </Alert>
                )}

                {flash?.error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                Rp {Math.abs(totalBalance).toLocaleString('id-ID')}
                                {totalBalance < 0 && ' (-)'}
                            </div>
                            <p className="text-xs text-muted-foreground">Across {balances.length} wallet(s)</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">Rp {totalIncome.toLocaleString('id-ID')}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">Rp {totalExpenses.toLocaleString('id-ID')}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                Rp {(totalIncome - totalExpenses).toLocaleString('id-ID')}
                            </div>
                            <p className="text-xs text-muted-foreground">Income - Expenses</p>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                            <AccordionItem value='value="item-1"'>
                                <AccordionTrigger>Spending by Category</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-balance">
                                    {categoryData.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Spending by Category</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <PieChart>
                                                        <Pie
                                                            data={categoryData}
                                                            cx="50%"
                                                            cy="50%"
                                                            labelLine={false}
                                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                            outerRadius={80}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                        >
                                                            {categoryData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Amount']} />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </CardContent>
                                        </Card>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>

                {/* Chart */}

                {/* Transactions Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transactions</CardTitle>
                        <CardDescription>Manage your income and expense transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Filter transactions..."
                                        value={(table.getColumn('description')?.getFilterValue() as string) ?? ''}
                                        onChange={(event) => table.getColumn('description')?.setFilterValue(event.target.value)}
                                        className="max-w-sm pl-8"
                                    />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="ml-auto">
                                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {table
                                            .getAllColumns()
                                            .filter((column) => column.getCanHide())
                                            .map((column) => {
                                                return (
                                                    <DropdownMenuCheckboxItem
                                                        key={column.id}
                                                        className="capitalize"
                                                        checked={column.getIsVisible()}
                                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                                    >
                                                        {column.id}
                                                    </DropdownMenuCheckboxItem>
                                                );
                                            })}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="flex items-center gap-2">
                                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                                Delete Selected ({table.getFilteredSelectedRowModel().rows.length})
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Selected Transactions</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete {table.getFilteredSelectedRowModel().rows.length} selected
                                                    transactions? This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleBulkDelete}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                                {hasWallet() ? (
                                    <Button onClick={() => router.visit('/transactions/create')} className="flex items-center">
                                        <CirclePlus className="mr-2 h-4 w-4" />
                                        Add Transaction
                                    </Button>
                                ) : (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="inline-flex">
                                                <Button disabled className="flex cursor-not-allowed items-center opacity-50">
                                                    <CirclePlus className="mr-2 h-4 w-4" />
                                                    Add Transaction
                                                </Button>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>Harus Memiliki 1 wallet dahulu</TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => {
                                                return (
                                                    <TableHead key={header.id}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                                    </TableHead>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={transactionColumns.length} className="h-24 text-center">
                                                No transactions found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-between space-x-2 py-4">
                            <div className="flex-1 text-sm text-muted-foreground">
                                {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                            </div>
                            <div className="space-x-2">
                                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                                    Previous
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
