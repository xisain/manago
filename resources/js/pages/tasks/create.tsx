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

const breadcrumbs: BreadcrumbItem[]= [
    { title: "Task", href: "/tasks" },
    { title: "Create Task", href: "/tasks/create" }
];

export default function TasksCreate(){
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        due_date: '',
        priority: '',
        status: ''
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('tasks.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            Create Task
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Fill out the form below to add a new task.
                        </p>
                    </div>
                </div>

                <Card className="shadow-lg border border-muted rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-xl">Task Information</CardTitle>
                        <CardDescription>Provide the task details here.</CardDescription>
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
                                    <Label htmlFor="title">Task Title</Label>
                                    <Input id="title" placeholder="Enter task title" value={data.title} onChange={e => setData('title', e.target.value)} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="due_date">Due Date</Label>
                                    <Input type="date" id="due_date" value={data.due_date} onChange={e => setData('due_date', e.target.value)} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select value={data.priority} onValueChange={value => setData('priority', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={data.status} onValueChange={value => setData('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" placeholder="Enter task description" value={data.description} onChange={e => setData('description', e.target.value)} />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing} className="transition hover:scale-105">
                                    Create Task
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
