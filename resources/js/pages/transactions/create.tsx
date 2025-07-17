import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlert, Terminal } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transaksi',
        href: '/transactions',
    },
    {
        title: 'Tambah Transaksi',
        href: '/transactions/create',
    },
];

export default function CreateTransaction() {

    const { data, setData, post, processing, errors } = useForm({
        date: '',
        type: '',
        category: '',
        amount: '',
        description: '',

    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('transactions.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Transaksi" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
                    {/* Form Error*/}

                    {Object.keys(errors).length > 0 &&(
                        <Alert variant='destructive' className='mb-4'>
                        <CircleAlert className="h-4 w-4" />
                        <AlertTitle>Errors !</AlertTitle>
                        <AlertDescription>
                            <ul>
                                {Object.entries(errors).map(([key, message]) => (
                                    <li key={key}>{message as string}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='date'>Tanggal</Label>
                        <Input type="date" id='date' name='date' value={data.date} onChange={e => setData('date', e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='type'>Tipe</Label>
                        <Select value={data.type} onValueChange={value => setData('type', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder='Pilih tipe'/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='income'>Pemasukan</SelectItem>
                                <SelectItem value='expense'>Pengeluaran</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='category'>Kategori</Label>
                        <Input type="text" id='category' name='category' value={data.category} onChange={e => setData('category', e.target.value)}/>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='amount'>Jumlah</Label>
                        <Input type="number" id='amount' name='amount' value={data.amount} onChange={e => setData('amount', e.target.value)}/>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='description'>Deskripsi</Label>
                        <Textarea id='description' name='description' value={data.description} onChange={e => setData('description', e.target.value)}/>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Button type="submit">Simpan</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
