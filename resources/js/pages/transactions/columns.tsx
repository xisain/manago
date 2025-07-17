import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { EditIcon, TrashIcon } from 'lucide-react';
import { Link, router } from '@inertiajs/react';

export interface Transaction {
  id: number;
  date: string;
  type: string;
  category: string;
  amount: number;
  description: string;
}

export const columns: ColumnDef<Transaction>[] = [
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
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return (
        <Badge className={type === 'income' ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-600 text-white hover:bg-gray-700'}>
          {type === 'income' ? 'Income' : 'Expense'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.getValue('category') as string;
      return <span className="capitalize">{category}</span>;
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      const type = row.getValue('type') as string;
      return (
        <span className={type === 'income' ? 'text-black font-medium' : 'text-gray-600 font-medium'}>
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(amount)}
        </span>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string;
      return (
        <span className="max-w-xs truncate" title={description}>
          {description}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const transaction = row.original;

      const handleDelete = () => {
        if (confirm('Are you sure you want to delete this transaction?')) {
          router.delete(route('transactions.destroy', transaction.id));
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
];
