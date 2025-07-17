import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { EditIcon, TrashIcon } from "lucide-react";
import { Link, router } from '@inertiajs/react'

export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
}
export const columns: ColumnDef<Task>[] = [
    {
        id:'select',
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
                onCheckedChange={(value)=> row.toggleSelected(!!value)}
                aria-label="Select Row"

            />
        ),
        enableSorting:false,
        enableHiding:false,

    },
    {
        accessorKey: 'title',
        header:'Title',
        cell: ({ row }) => {
            const title = row.getValue('title') as string;
            return(
            <span className="max-w-xs" title={title}>
                {title}
            </span>
            )
        }
    },
    {
        accessorKey: 'description',
        header:'Description',
        cell: ({ row }) => {
            const description = row.getValue('description') as string;
            return(
            <span className="max-w-xs" title={description}>
                {description}
            </span>
            )
        }
    },
    {
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row }) => {
    const status = row.getValue('status') as string;

    const getBadgeClass = (status: string) => {
      switch (status.toLowerCase()) {
        case 'complete':
          return 'bg-green-100 text-green-800 border border-green-200';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        case 'in progress':
          return 'bg-blue-100 text-blue-800 border border-blue-200';
        default:
          return 'bg-gray-100 text-gray-800 border border-gray-200';
      }
    };

    return (
      <Badge className={getBadgeClass(status)}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  },
},
{
    accessorKey: 'due_date',
    header: 'Due Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('due_date'));
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
  },
  {
  accessorKey: 'priority',
  header: 'Priority',
  cell: ({ row }) => {
    const priority = row.getValue('priority') as string;

    const getPriorityClass = (priority: string) => {
      switch (priority.toLowerCase()) {
        case 'low':
          return 'bg-green-100 text-green-800 border border-green-200';
        case 'medium':
          return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        case 'high':
          return 'bg-red-100 text-red-800 border border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border border-gray-200';
      }
    };

    return (
      <Badge className={getPriorityClass(priority)}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  },
},
{
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const tasks = row.original;

      const handleDelete = () => {
        if (confirm('Are you sure you want to delete this transaction?')) {
          router.delete(route('tasks.destroy', tasks.id));
        }
      };

      return (
        <div className="flex items-center space-x-2">
          {/* <Link href={route('transactions.edit', transaction.id)}>
            <Button variant="outline" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300">
              <EditIcon className="w-4 h-4" />
            </Button>
          </Link> */}
          <Button variant="outline" size="sm" onClick={handleDelete} className="hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300">
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
]
