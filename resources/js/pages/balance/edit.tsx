import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Link, useForm } from "@inertiajs/react";
import { CirclePlus, CircleAlert } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";



export interface Balance {
    id: number;
    name: string;
    current_balance: number;
    created_at?: string;
    updated_at?: string;
}

interface PageProps {
    flash: { message?: string; error?: string };
    balances: Balance;
}

export default function walletCreate({ balances }: PageProps){
    const breadcrumbs: BreadcrumbItem[]= [
    { title: "Wallet", href: "/balances" },
    { title: `${balances.name}`, href: `/balances/${balances.id}/` },
    { title: `Edit`, href: `/balances/${balances.id}/` }
];
    
    const { data, setData, post, processing, errors } = useForm({
        'name': balances.name,
        'current_balance': balances.current_balance,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('balances.update'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            Edit {balances.name}
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Fill out the form below to edit {balances.name}.
                        </p>
                    </div>
                </div>

                <Card className="shadow-lg border border-muted rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-xl">Wallet Information</CardTitle>
                        <CardDescription>Provide the wallet details here.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {Object.keys(errors).length > 0 && (
                                <Alert variant="destructive">
                                    <CircleAlert className="h-5 w-5" />
                                    <AlertTitle>Validation Errors</AlertTitle>
                                    <AlertDescription>
                                        <ul className="list-disc list-inside text-sm">
                                            {Object.entries(errors).map(([key, message]) => (
                                                <li key={key}>{message as string}</li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">Wallet Name</Label>
                                    <Input id="name" placeholder="Enter wallet name" value={data.name} onChange={e => setData('name', e.target.value)} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="current_balance">Amount</Label>
                                    <Input type="number" id="current_balance" placeholder="Enter balance amount" value={data.current_balance} onChange={e => setData('current_balance', e.target.value)} />
                                </div>

                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing} className="transition hover:scale-105">
                                    Create Wallet
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
