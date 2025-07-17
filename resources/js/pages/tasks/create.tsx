import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Link, useForm } from "@inertiajs/react";
import { CirclePlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert } from "lucide-react";




const breadcrumbs: BreadcrumbItem[]= [
    {
        title: "Task",
        href: "/tasks",
    },
    {
        title: "Create Task",
        href: "/tasks/create",
    }
]

export default function TasksCreate(){
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        due_date: '',
        priority: '',
        status: ''
    })
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('tasks.store'));
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h1 className="text-2xl font-bold">Create Task</h1>
                <p className="text-muted-foreground">This is the create task page where you can add a new task.</p>
                {/* Form Input */}
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
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
                    <div className="grid gap-4">
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor="title">Task Title</Label>
                            <Input id="title" placeholder="Enter task title" value={data.title} onChange={e => setData('title', e.target.value)} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="Enter task description" value={data.description} onChange={e => setData('description',e.target.value)}/>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor="due_date">Due Date</Label>
                            <Input type="date" id="due_date" value={data.due_date} onChange={e => setData('due_date',e.target.value)}/>
                        </div>
                        <div className='flex flex-col gap-2'>
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
                        <div className='flex flex-col gap-2'>
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
                        <div className="flex justify-end">
                            <Button type="submit">
                                Create Task
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );

}
