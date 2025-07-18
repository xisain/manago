import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar, Wallet, Plus, Minus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

// Balance interface
export interface Balance {
    id: number;
    name: string;
    current_balance: number;
    created_at: string;
    updated_at: string;
}

interface PageProps {
    balances: Balance[];
    selectedBalanceId: string | null;
    type: "income" | "expense";
    flash: { message?: string; error?: string };
}

export default function TransactionCreate({ balances, selectedBalanceId, type }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Balance",
            href: "/balance",
        },
        {
            title: "New Transaction",
            href: "/transactions/create",
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        balance_id: selectedBalanceId ?? "", // Pre-select balance from query param
        type: type ?? "income", // Pre-select type from query param, default to "income"
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0], // Default to today
    });

    // Ensure selectedBalanceId is valid
    useEffect(() => {
        if (selectedBalanceId && !balances.some((b) => b.id.toString() === selectedBalanceId)) {
            setData("balance_id", ""); // Reset if invalid
        }
    }, [selectedBalanceId, balances]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("transactions.store"));
    };

    const formatCurrency = (amount: number | string) => {
        const num = typeof amount === "string" ? parseFloat(amount) : amount;
        if (isNaN(num)) return "";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(num);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
        setData("amount", value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Transaction" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Create New Transaction</h1>
                        <p className="text-muted-foreground">Add a new income or expense transaction</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Transaction Details</CardTitle>
                                <CardDescription>
                                    Fill in the details for the new transaction
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="balance_id">Balance Account</Label>
                                        <Select
                                            value={data.balance_id}
                                            onValueChange={(value) => setData("balance_id", value)}
                                        >
                                            <SelectTrigger id="balance_id">
                                                <SelectValue placeholder="Select a balance" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {balances.map((balance) => (
                                                    <SelectItem key={balance.id} value={balance.id.toString()}>
                                                        {balance.name} ({formatCurrency(balance.current_balance)})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.balance_id && (
                                            <p className="text-sm text-red-600">{errors.balance_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type">Transaction Type</Label>
                                        <Select
                                            value={data.type}
                                            onValueChange={(value) => setData("type", value as "income" | "expense")}
                                        >
                                            <SelectTrigger id="type">
                                                <SelectValue placeholder="Select transaction type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="income">
                                                    <div className="flex items-center">
                                                        <Plus className="w-4 h-4 mr-2 text-green-600" />
                                                        Income
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="expense">
                                                    <div className="flex items-center">
                                                        <Minus className="w-4 h-4 mr-2 text-red-600" />
                                                        Expense
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.type && (
                                            <p className="text-sm text-red-600">{errors.type}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount</Label>
                                        <Input
                                            id="amount"
                                            type="text"
                                            placeholder="Enter amount"
                                            value={data.amount ? formatCurrency(data.amount) : ""}
                                            onChange={handleAmountChange}
                                            onFocus={(e) => (e.target.value = data.amount)} // Show raw number on focus
                                            onBlur={(e) => (e.target.value = formatCurrency(data.amount))} // Format as currency on blur
                                        />
                                        {errors.amount && (
                                            <p className="text-sm text-red-600">{errors.amount}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Input
                                            id="category"
                                            type="text"
                                            placeholder="e.g., Salary, Groceries"
                                            value={data.category}
                                            onChange={(e) => setData("category", e.target.value)}
                                        />
                                        {errors.category && (
                                            <p className="text-sm text-red-600">{errors.category}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description (Optional)</Label>
                                        <Input
                                            id="description"
                                            type="text"
                                            placeholder="Enter description"
                                            value={data.description}
                                            onChange={(e) => setData("description", e.target.value)}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-600">{errors.description}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <div className="relative">
                                            <Input
                                                id="date"
                                                type="date"
                                                value={data.date}
                                                onChange={(e) => setData("date", e.target.value)}
                                                className="pr-10"
                                            />
                                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                        {errors.date && (
                                            <p className="text-sm text-red-600">{errors.date}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.visit(route("transactions.index"))}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? "Creating..." : "Create Transaction"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => router.visit(route("transactions.index"))}
                                >
                                    View All Transactions
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => router.visit(route("balances.create"))}
                                >
                                    Create New Balance
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}