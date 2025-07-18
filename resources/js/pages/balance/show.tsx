import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, DollarSign, Edit, History, Minus, Plus, Trash2, TrendingDown, TrendingUp, Wallet } from 'lucide-react';

// Balance interface
export interface Balance {
    id: number;
    name: string;
    current_balance: number;
    created_at: string;
    updated_at: string;
}

// Transaction interface
export interface Transaction {
    id: number;
    balance_id: number;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
    created_at: string;
}

interface PageProps {
    balance: Balance;
    transactions: Transaction[];
    flash: { message?: string; error?: string };
}

export default function BalanceShow({ balance, transactions }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Wallet',
            href: '/balances',
        },
        {
            title: balance.name,
            href: `/balances/${balance.id}`,
        },
    ];

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this balance? This action cannot be undone.')) {
            router.delete(route('balances.destroy', balance.id));
        }
    };

    const handleDeleteTransaction = (transactionId: number) => {
        if (confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
            router.delete(route('transactions.destroy', transactionId));
        }
    };

    const getBalanceStatus = () => {
        if (balance.current_balance > 0) {
            return {
                color: 'bg-green-100 text-green-800 border-green-200',
                icon: TrendingUp,
                label: 'Positive',
            };
        } else if (balance.current_balance < 0) {
            return {
                color: 'bg-red-100 text-red-800 border-red-200',
                icon: TrendingDown,
                label: 'Negative',
            };
        } else {
            return {
                color: 'bg-gray-100 text-gray-800 border-gray-200',
                icon: DollarSign,
                label: 'Zero',
            };
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDateOnly = (dateString: string) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getTransactionBadge = (type: 'income' | 'expense') => {
        return type === 'income'
            ? { color: 'bg-green-100 text-green-800 border-green-200', icon: Plus, label: 'Income' }
            : { color: 'bg-red-100 text-red-800 border-red-200', icon: Minus, label: 'Expense' };
    };

    const balanceStatus = getBalanceStatus();
    const BalanceIcon = balanceStatus.icon;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Header */}
                <Head title={balance.name + ' - Balance'} />
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold">{balance.name}</h1>
                            <div className="flex items-center gap-3">
                                <Badge className={balanceStatus.color}>
                                    <BalanceIcon className="mr-1 h-3 w-3" />
                                    {balanceStatus.label}
                                </Badge>
                                <div className="text-2xl font-bold">{formatCurrency(balance.current_balance)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={route('balances.edit', balance.id)}>
                            <Button variant="outline">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Button variant="outline" onClick={handleDelete} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Balance Details */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Balance Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Balance Overview</CardTitle>
                                <CardDescription>Current financial status of {balance.name}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="rounded-lg p-4">
                                        <div className="mb-2 flex items-center gap-2">
                                            <Wallet className="h-5 w-5" />
                                            <span className="text-sm font-medium">Current Balance</span>
                                        </div>
                                        <div className="text-2xl font-bold">{formatCurrency(balance.current_balance)}</div>
                                    </div>
                                    <div className="rounded-lg p-4">
                                        <div className="mb-2 flex items-center gap-2">
                                            <History className="h-5 w-5 text-gray-600" />
                                            <span className="text-sm font-medium text-gray-800">Status</span>
                                        </div>
                                        <Badge className={balanceStatus.color}>
                                            <BalanceIcon className="mr-1 h-3 w-3" />
                                            {balanceStatus.label}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Transactions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Transactions</CardTitle>
                                <CardDescription>Latest financial activities for this balance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {transactions.length === 0 ? (
                                    <div className="py-8 text-center">
                                        <History className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                        <p className="mb-4 text-gray-500">No transactions recorded yet</p>
                                        <p className="text-sm text-gray-400">
                                            Transactions will appear here once you start recording income and expenses
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {transactions.map((transaction) => {
                                            const badge = getTransactionBadge(transaction.type);
                                            const TransactionIcon = badge.icon;
                                            return (
                                                <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-4">
                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <Badge className={badge.color}>
                                                                <TransactionIcon className="mr-1 h-3 w-3" />
                                                                {badge.label}
                                                            </Badge>
                                                            <p className="mt-1 text-sm font-medium">{transaction.category}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {transaction.description || 'No description'}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-lg font-bold">{formatCurrency(transaction.amount)}</div>
                                                        <div className="flex gap-2">
                                                            <Link href={route('transactions.edit', transaction.id)}>
                                                                <Button variant="outline" size="sm">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                onClick={() => handleDeleteTransaction(transaction.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Balance Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Balance History</CardTitle>
                                <CardDescription>Creation and modification timeline</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                        <div>
                                            <p className="text-sm font-medium">Balance Created</p>
                                            <p className="text-sm text-muted-foreground">{formatDate(balance.created_at)}</p>
                                        </div>
                                    </div>
                                    {balance.created_at !== balance.updated_at && (
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            <div>
                                                <p className="text-sm font-medium">Last Updated</p>
                                                <p className="text-sm text-muted-foreground">{formatDate(balance.updated_at)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Balance Properties */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Balance Properties</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="mb-2 flex items-center gap-2">
                                        <Wallet className="h-4 w-4" />
                                        <span className="text-sm font-medium">Current Amount</span>
                                    </div>
                                    <div className="text-lg font-bold">{formatCurrency(balance.current_balance)}</div>
                                </div>

                                <Separator />

                                <div>
                                    <div className="mb-2 flex items-center gap-2">
                                        <BalanceIcon className="h-4 w-4" />
                                        <span className="text-sm font-medium">Status</span>
                                    </div>
                                    <Badge className={balanceStatus.color}>{balanceStatus.label}</Badge>
                                </div>

                                <Separator />

                                <div>
                                    <div className="mb-2 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm font-medium">Last Updated</span>
                                    </div>
                                    <p className="text-sm text-gray-700">{formatDateOnly(balance.updated_at)}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <Link href={route('balances.edit', balance.id)}>
                                        <Button variant="outline" className="w-full justify-start">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Balance
                                        </Button>
                                    </Link>
                                </div>

                                <div>
                                    <Link href={route('transactions.create', { balance_id: balance.id, type: 'income' })}>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-green-600 hover:bg-green-50 hover:text-green-700"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Income
                                        </Button>
                                    </Link>
                                </div>

                                <div>
                                    <Link href={route('transactions.create', { balance_id: balance.id, type: 'expense' })}>
                                        <Button variant="outline" className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700">
                                            <Minus className="mr-2 h-4 w-4" />
                                            Add Expense
                                        </Button>
                                    </Link>
                                </div>

                                <div>
                                    <Link href={route('transactions.index', { balance_id: balance.id })}>
                                        <Button variant="outline" className="w-full justify-start">
                                            <History className="mr-2 h-4 w-4" />
                                            View All Transactions
                                        </Button>
                                    </Link>
                                </div>

                                <div>
                                    <Link href={route('balances.create')}>
                                        <Button variant="outline" className="w-full justify-start">
                                            Create New Balance
                                        </Button>
                                    </Link>
                                </div>

                                <div>
                                    <hr />
                                </div>

                                <div>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                                        onClick={handleDelete}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Balance
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Balance Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Balance Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Balance ID</span>
                                    <span className="text-sm font-medium">#{balance.id}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Created</span>
                                    <span className="text-sm font-medium">{new Date(balance.created_at).toLocaleDateString('id-ID')}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Updated</span>
                                    <span className="text-sm font-medium">{new Date(balance.updated_at).toLocaleDateString('id-ID')}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Balance</span>
                                    <span
                                        className={`text-sm font-medium ${
                                            balance.current_balance > 0
                                                ? 'text-green-600'
                                                : balance.current_balance < 0
                                                  ? 'text-red-600'
                                                  : 'text-gray-600'
                                        }`}
                                    >
                                        {formatCurrency(balance.current_balance)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
