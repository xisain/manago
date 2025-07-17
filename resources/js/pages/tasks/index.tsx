import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head,Link, router } from "@inertiajs/react";
import { Alert,AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CirclePlus, CheckCircle2Icon } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    type ColumnDef,
    type SortingState,
    type ColumnFiltersState,
    type VisibilityState,
    flexRender
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { EditIcon, TrashIcon, ArrowUpDown, ChevronDown, Eye } from 'lucide-react';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Task",
        href: "/tasks",
    }
];

// Task interface
export interface Task {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    due_date: string;
    priority: 'low' | 'medium' | 'high';
    created_at: string;
    updated_at: string;
}

// Status and Priority options
const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
];

const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
];

// Update task function
const updateTask = (taskId: number, field: string, value: string) => {
    router.patch(route('tasks.update', taskId), {
        [field]: value
    }, {
        preserveScroll: true,
        preserveState: true,
        only: ['tasks', 'flash']
    });
};

// Task columns definition
export const taskColumns: ColumnDef<Task>[] = [
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
        accessorKey: 'title',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const task = row.original;
            const title = row.getValue('title') as string;
            return <Link href={route('tasks.show', task.id)} className="font-medium">{title}</Link>;
        },
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
            const description = row.getValue('description') as string;
            return (
                <span className="max-w-xs truncate text-muted-foreground" title={description}>
                    {description}
                </span>
            );
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const task = row.original;
            const status = row.getValue('status') as string;
            const statusColors = {
                pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
                in_progress: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
                completed: 'bg-green-100 text-green-800 hover:bg-green-200',
            };

            return (
                <Select
                    value={status}
                    onValueChange={(value) => updateTask(task.id, 'status', value)}
                >
                    <SelectTrigger className="w-[130px] h-8 border-none shadow-none">
                        <Badge className={statusColors[status as keyof typeof statusColors]}>
                            {status.replace('_', ' ')}
                        </Badge>
                    </SelectTrigger>
                    <SelectContent>
                        {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                <Badge className={statusColors[option.value as keyof typeof statusColors]}>
                                    {option.label}
                                </Badge>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        },
    },
    {
        accessorKey: 'due_date',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Due Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const dueDate = row.getValue('due_date') as string;
            if (!dueDate) return <span className="text-muted-foreground">No due date</span>;

            const date = new Date(dueDate);
            const today = new Date();
            const isOverdue = date < today;

            return (
                <span className={isOverdue ? 'text-red-600 font-medium' : 'text-foreground'}>
                    {date.toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                </span>
            );
        },
    },
    {
        accessorKey: 'priority',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Priority
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const task = row.original;
            const priority = row.getValue('priority') as string;
            const priorityColors = {
                low: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
                medium: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
                high: 'bg-red-100 text-red-800 hover:bg-red-200',
            };

            return (
                <Select
                    value={priority}
                    onValueChange={(value) => updateTask(task.id, 'priority', value)}
                >
                    <SelectTrigger className="w-[100px] h-8 border-none shadow-none">
                        <Badge className={priorityColors[priority as keyof typeof priorityColors]}>
                            {priority}
                        </Badge>
                    </SelectTrigger>
                    <SelectContent>
                        {priorityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                <Badge className={priorityColors[option.value as keyof typeof priorityColors]}>
                                    {option.label}
                                </Badge>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const task = row.original;

            const handleDelete = () => {
                if (confirm('Are you sure you want to delete this task?')) {
                    router.delete(route('tasks.destroy', task.id));
                }
            };

            return (
                <div className="flex items-center space-x-2">
                <Link href={route('tasks.edit', task.id)}>
                    <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300"
                    >
                        <EditIcon className="w-4 h-4" />
                    </Button>
                </Link>

                {/* Alert Dialog for Delete Confirmation */}
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
                                Are you sure you want to delete this task?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the task titled <strong>{task.title}</strong>.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => router.delete(route('tasks.destroy', task.id))}
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


interface PageProps {
    flash: { message?: string; error?: string };
    tasks?: Task[];
}

export default function TasksIndex({ tasks, flash }: PageProps) {
    // Ensure tasks is always an array
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data: safeTasks,
        columns: taskColumns,
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Task" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div>
                    {flash?.message && (
                    <Alert className="border-green-200 bg-green-50  dark:border-green-300 dark:bg-green-500">
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {/* Card 1 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tasks Overview</CardTitle>
                            <CardDescription>Manage your tasks efficiently.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                You have {safeTasks.length} total tasks.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Link href={route("tasks.create")}>
                                <Button variant="outline">
                                    <CirclePlus className="mr-2 h-4 w-4" />
                                    Create Task
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>

                    {/* Card 2 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Completed Tasks</CardTitle>
                            <CardDescription>All tasks you've finished.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                You have completed {safeTasks.filter(task => task.status === 'completed').length} tasks.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline">View All</Button>
                        </CardFooter>
                    </Card>

                    {/* Card 3 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Deadlines</CardTitle>
                            <CardDescription>Stay on track with your goals.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {safeTasks.filter(task => {
                                    if (!task.due_date) return false;
                                    const dueDate = new Date(task.due_date);
                                    const threeDaysFromNow = new Date();
                                    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 7);
                                    return dueDate <= threeDaysFromNow && task.status !== 'completed';
                                }).length} tasks due within the next 7 days.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline">Check Schedule</Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Card 4 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>In Progress</CardTitle>
                            <CardDescription>Tasks currently being worked on.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                You have {safeTasks.filter(task => task.status === 'in_progress').length} tasks in progress.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline">View In Progress</Button>
                        </CardFooter>
                    </Card>

                    {/* Card 5 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Task Analytics</CardTitle>
                            <CardDescription>Analyze your productivity.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Your task completion rate is {safeTasks.length > 0 ? Math.round((safeTasks.filter(task => task.status === 'completed').length / safeTasks.length) * 100) : 0}%.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline">View Report</Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Tasks Table Section */}
                <div className="space-y-4">

                    <div className="flex items-center justify-between">

                        <h1 className="text-2xl font-bold">Tasks</h1>
                        <Link href={route("tasks.create")}>
                            <Button>
                                <CirclePlus className="mr-2 h-4 w-4" />
                                Create Task
                            </Button>
                        </Link>
                    </div>

                    {/* Table Controls */}
                    <div className="flex items-center space-x-2">
                        <Input
                            placeholder="Filter tasks..."
                            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("title")?.setFilterValue(event.target.value)
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
                                                <TableHead key={header.id}>
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
                                                <TableCell key={cell.id}>
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
                                            colSpan={taskColumns.length}
                                            className="h-24 text-center"
                                        >
                                            No tasks found.
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
