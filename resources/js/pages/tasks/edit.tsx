import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { ArrowLeft, Save, X } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

interface PageProps {
    task: Task;
    flash: { message?: string; error?: string };
}

export default function TaskEdit({ task }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Tasks",
            href: "/tasks",
        },
        {
            title: task.title,
            href: `/tasks/${task.id}`,
        },
        {
            title: "Edit",
            href: `/tasks/${task.id}/edit`,
        }
    ];

    const { data, setData, patch, processing, errors, reset } = useForm({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('tasks.update', task.id), {
            onSuccess: () => {
                // Optional: redirect to show page or index
                router.visit(route('tasks.show', task.id));
            },
        });
    };

    const handleCancel = () => {
        reset();
        router.visit(route('tasks.show', task.id));
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
        { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' }
    ];

    const priorityOptions = [
        { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
        { value: 'medium', label: 'Medium', color: 'bg-orange-100 text-orange-800' },
        { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
    ];

    const getCurrentStatusColor = () => {
        const status = statusOptions.find(s => s.value === data.status);
        return status?.color || 'bg-gray-100 text-gray-800';
    };

    const getCurrentPriorityColor = () => {
        const priority = priorityOptions.find(p => p.value === data.priority);
        return priority?.color || 'bg-gray-100 text-gray-800';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Header */}
                <Head title={"Task- "+task.title + "(Edit)" } />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('tasks.show', task.id)}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Edit Task</h1>
                            <p className="text-muted-foreground">
                                Update task details and settings
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className={getCurrentStatusColor()}>
                            {data.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getCurrentPriorityColor()}>
                            {data.priority}
                        </Badge>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Edit Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Task Details</CardTitle>
                                <CardDescription>
                                    Update the task information below
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title *</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Enter task title"
                                            className={errors.title ? 'border-red-500' : ''}
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-red-500">{errors.title}</p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Enter task description"
                                            rows={4}
                                            className={errors.description ? 'border-red-500' : ''}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-500">{errors.description}</p>
                                        )}
                                    </div>

                                    {/* Status and Priority */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Status */}
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status *</Label>
                                            <Select
                                                value={data.status}
                                                onValueChange={(value) => setData('status', value as any)}
                                            >
                                                <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {statusOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            <div className="flex items-center gap-2">
                                                                <Badge className={option.color}>
                                                                    {option.label}
                                                                </Badge>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.status && (
                                                <p className="text-sm text-red-500">{errors.status}</p>
                                            )}
                                        </div>

                                        {/* Priority */}
                                        <div className="space-y-2">
                                            <Label htmlFor="priority">Priority *</Label>
                                            <Select
                                                value={data.priority}
                                                onValueChange={(value) => setData('priority', value as any)}
                                            >
                                                <SelectTrigger className={errors.priority ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {priorityOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            <div className="flex items-center gap-2">
                                                                <Badge className={option.color}>
                                                                    {option.label}
                                                                </Badge>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.priority && (
                                                <p className="text-sm text-red-500">{errors.priority}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Due Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="due_date">Due Date</Label>
                                        <Input
                                            id="due_date"
                                            type="date"
                                            value={data.due_date}
                                            onChange={(e) => setData('due_date', e.target.value)}
                                            className={errors.due_date ? 'border-red-500' : ''}
                                        />
                                        {errors.due_date && (
                                            <p className="text-sm text-red-500">{errors.due_date}</p>
                                        )}
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex items-center gap-3 pt-4">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancel}
                                            disabled={processing}
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-4">
                        {/* Task Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Task Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Task ID</Label>
                                    <p className="text-sm">{task.id}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                                    <p className="text-sm">
                                        {new Date(task.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                                    <p className="text-sm">
                                        {new Date(task.updated_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
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
                                <Link href={route('tasks.show', task.id)}>
                                    <Button variant="outline" className="w-full justify-start">
                                        View Task
                                    </Button>
                                </Link>
                                <Link href={route('tasks.index')}>
                                    <Button variant="outline" className="w-full justify-start">
                                        All Tasks
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this task?')) {
                                            router.delete(route('tasks.destroy', task.id));
                                        }
                                    }}
                                >
                                    Delete Task
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
