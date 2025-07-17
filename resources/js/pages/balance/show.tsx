import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { Edit, Trash2, Calendar, Wallet, TrendingUp, TrendingDown, DollarSign, Plus, Minus, History } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
            title: "Wallet",
            href: "/balances",
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
                label: 'Positive'
            };
        } else if (balance.current_balance < 0) {
            return {
                color: 'bg-red-100 text-red-800 border-red-200',
                icon: TrendingDown,
                label: 'Negative'
            };
        } else {
            return {
                color: 'bg-gray-100 text-gray-800 border-gray-200',
                icon: DollarSign,
                label: 'Zero'
            };
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
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
            minute: '2-digit'
        });
    };

    const formatDateOnly = (dateString: string) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
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
                <Head title={balance.name + " - Balance"} />
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{balance.name}</h1>
                            <div className="flex items-center gap-3">
                                <Badge className={balanceStatus.color}>
                                    <BalanceIcon className="w-3 h-3 mr-1" />
                                    {balanceStatus.label}
                                </Badge>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(balance.current_balance)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={route('balances.edit', balance.id)}>
                            <Button variant="outline">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            onClick={handleDelete}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Balance Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Balance Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Balance Overview</CardTitle>
                                <CardDescription>
                                    Current financial status of {balance.name}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Wallet className="w-5 h-5" />
                                            <span className="text-sm font-medium">Current Balance</span>
                                        </div>
                                        <div className="text-2xl font-bold">
                                            {formatCurrency(balance.current_balance)}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <History className="w-5 h-5 text-gray-600" />
                                            <span className="text-sm font-medium text-gray-800">Status</span>
                                        </div>
                                        <Badge className={balanceStatus.color}>
                                            <BalanceIcon className="w-3 h-3 mr-1" />
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
                                <CardDescription>
                                    Latest financial activities for this balance
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {transactions.length === 0 ? (
                                    <div className="text-center py-8">
                                        <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500 mb-4">No transactions recorded yet</p>
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
                                                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <Badge className={badge.color}>
                                                                <TransactionIcon className="w-3 h-3 mr-1" />
                                                                {badge.label}
                                                            </Badge>
                                                            <p className="text-sm font-medium mt-1">{transaction.category}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {transaction.description || 'No description'}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {formatDate(transaction.date)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-lg font-bold">
                                                            {formatCurrency(transaction.amount)}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Link href={route('transactions.edit', transaction.id)}>
                                                                <Button variant="outline" size="sm">
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                                onClick={() => handleDeleteTransaction(transaction.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
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
                                <CardDescription>
                                    Creation and modification timeline
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium">Balance Created</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(balance.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    {balance.created_at !== balance.updated_at && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <div>
                                                <p className="text-sm font-medium">Last Updated</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDate(balance.updated_at)}
                                                </p>
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
                                    <div className="flex items-center gap-2 mb-2">
                                        <Wallet className="w-4 h-4" />
                                        <span className="text-sm font-medium">Current Amount</span>
                                    </div>
                                    <div className="text-lg font-bold">
                                        {formatCurrency(balance.current_balance)}
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <BalanceIcon className="w-4 h-4" />
                                        <span className="text-sm font-medium">Status</span>
                                    </div>
                                    <Badge className={balanceStatus.color}>
                                        {balanceStatus.label}
                                    </Badge>
                                </div>

                                <Separator />

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-sm font-medium">Last Updated</span>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        {formatDateOnly(balance.updated_at)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href={route('balances.edit', balance.id)}>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Balance
                                    </Button>
                                </Link>

                                <Link href={route('transactions.create', { balance_id: balance.id, type: 'income' })}>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Income
                                    </Button>
                                </Link>

                                <Link href={route('transactions.create', { balance_id: balance.id, type: 'expense' })}>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Minus className="w-4 h-4 mr-2" />
                                        Add Expense
                                    </Button>
                                </Link>

                                <Link href={route('transactions.index', { balance_id: balance.id })}>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                    >
                                        <History className="w-4 h-4 mr-2" />
                                        View All Transactions
                                    </Button>
                                </Link>

                                <Link href={route('balances.create')}>
                                    <Button variant="outline" className="w-full justify-start">
                                        Create New Balance
                                    </Button>
                                </Link>

                                <Separator />

                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Balance
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Balance Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Balance Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Balance ID</span>
                                    <span className="text-sm font-medium">#{balance.id}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Created</span>
                                    <span className="text-sm font-medium">
                                        {new Date(balance.created_at).toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Updated</span>
                                    <span className="text-sm font-medium">
                                        {new Date(balance.updated_at).toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Balance</span>
                                    <span className={`text-sm font-medium ${
                                        balance.current_balance > 0 ? 'text-green-600' : 
                                        balance.current_balance < 0 ? 'text-red-600' : 
                                        'text-gray-600'
                                    }`}>
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