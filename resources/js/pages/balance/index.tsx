import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ColumnDef, 
    flexRender, 
    getCoreRowModel, 
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    type SortingState,
    type ColumnFiltersState,
    type VisibilityState
} from '@tanstack/react-table';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ArrowUpDown, CirclePlus, EditIcon, TrashIcon, ChevronDown, CheckCircle2Icon } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Wallet',
        href: '/balances',
    },
];

export interface Balance {
    id: number;
    name: string;
    current_balance: number;
    created_at?: string;
    updated_at?: string;
}

interface PageProps {
    flash: { message?: string; error?: string };
    balances: Balance[];
}

// Balance columns definition
export const balanceColumns: ColumnDef<Balance>[] = [
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
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
    accessorKey: 'id',
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="text-left w-full">
            Wallet ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => {
        const balance = row.original;
        return (
            <Link href={route('balances.show', balance.id)} className="block text-center px-2">
                {row.getValue('id')}
            </Link>
        );
    },
},
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className='text-left w-full'>
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const balance = row.original;
            const name = row.getValue('name') as string;
            return (
                <Link href={route('balances.show', balance.id)} className="block text-center px-2">
                    {name}
                </Link>
            );
        },
    },
    {
    accessorKey: 'current_balance',
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="text-right w-full">
            Current Balance
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => {
        const value = row.getValue<number>('current_balance');
        const isNegative = value < 0;
        return (
            <div className="text-center px-2">
                <Badge className={isNegative ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} >
                    Rp {Math.abs(value).toLocaleString('id-ID')}
                    {isNegative && ' (-)'}
                </Badge>
            </div>
        );
    },
},
    {
        id: 'actions',
        header: ({ column }) => (
        <Button variant="ghost" className="text-right w-full">
            Action
        </Button>
    ),

        cell: ({ row }) => {
            const balance = row.original;

            return (
                <div className="flex justify-center space-x-2">
                    <Link href={route('balances.edit', balance.id)}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300"
                        >
                            <EditIcon className="w-4 h-4" />
                        </Button>
                    </Link>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-red-50 dark:hover:bg-red-900/20 border-gray-300 text-red-600 hover:text-red-700"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you sure you want to delete this wallet?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the wallet <strong>{balance.name}</strong> and all its transaction history.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => router.delete(route('balances.destroy', balance.id))}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
];

export default function Wallet({ balances, flash }: PageProps) {
    // Ensure balances is always an array
    const safeBalances = Array.isArray(balances) ? balances : [];
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data: safeBalances,
        columns: balanceColumns,
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

    // Calculate totals
    const totalBalance = safeBalances.reduce((sum, balance) => sum + Number(balance.current_balance), 0);
const positiveBalances = safeBalances.filter(balance => Number(balance.current_balance) > 0);
    
    // Prepare data for pie chart
    const pieData = safeBalances.map((balance, index) => ({
        name: balance.name,
        value: Math.abs(balance.current_balance),
        percentage: totalBalance > 0 ? (balance.current_balance / totalBalance * 100) : 0,
        color: `hsl(${(index * 137.5) % 360}, 70%, 60%)`
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Wallet" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div>
                    
                    {flash?.message && (
                        <Alert className="border-green-200 bg-green-50 dark:border-green-300 dark:bg-green-500">
                            <CheckCircle2Icon className="h-4 w-4 text-green-600" />
                            <AlertTitle className="text-white-800">Success!</AlertTitle>
                            <AlertDescription className="text-white-700">{flash.message}</AlertDescription>
                        </Alert>
                    )}
                    {flash?.error && (
                        <Alert variant="destructive">
                            <AlertTitle>Error!</AlertTitle>
                            <AlertDescription>{flash.error}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <div className="flex items-center justify-between mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 flex-1">
                        {/* Card 1 - Total Balance */}
                        <Card className="p-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-muted-foreground">Total Balance</h3>
                                    <CirclePlus className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="text-xl font-bold">
                                    <span className={totalBalance < 0 ? 'text-red-600' : 'text-green-600'}>
                                        Rp {Math.abs(totalBalance).toLocaleString('id-ID', { minimumFractionDigits: 0 })}
                                        {totalBalance < 0 && ' (-)'}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Across {safeBalances.length} wallet(s)
                                </p>
                            </div>
                        </Card>

                        {/* Card 2 - Positive Balances */}
                        <Card className="p-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-muted-foreground">Positive Balances</h3>
                                    <CheckCircle2Icon className="h-4 w-4 text-green-600" />
                                </div>
                                <div className="text-xl font-bold text-green-600">
                                    {positiveBalances.length}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Total: Rp {positiveBalances.reduce((sum, b) => sum + Number(b.current_balance), 0).toLocaleString('id-ID')}
                                </p>
                            </div>
                        </Card>

                        {/* Card 3 - Wallet Distribution */}
                        <Card className="p-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-muted-foreground">Distribution</h3>
                                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="h-32">
                                    {safeBalances.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={20}
                                                    outerRadius={50}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip 
                                                    formatter={(value: number) => [
                                                        `Rp ${value.toLocaleString('id-ID')}`,
                                                        'Balance'
                                                    ]}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                                            No data
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Wallets Table Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Wallets</h1>
                        <Link href={route('balances.create')}>
                            <Button>
                                <CirclePlus className="mr-2 h-4 w-4" />
                                Add Wallet
                            </Button>
                        </Link>
                    </div>

                    {/* Table Controls */}
                    <div className="flex items-center space-x-2">
                        <Input
                            placeholder="Filter wallets..."
                            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("name")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
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
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(!!value)
                                                }
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id} className="text-left px-4 py-2">

                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="px-4 py-2 align-middle">
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={balanceColumns.length}
                                            className="h-24 text-center"
                                        >
                                            No wallets found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex-1 text-sm text-muted-foreground">
                            {table.getFilteredSelectedRowModel().rows.length} of{" "}
                            {table.getFilteredRowModel().rows.length} row(s) selected.
                        </div>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}