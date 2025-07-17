import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { ArrowLeft, Edit, Trash2, Calendar, Clock, Flag, CheckCircle } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

export default function TaskShow({ task }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Tasks",
            href: "/tasks",
        },
        {
            title: task.title,
            href: `/tasks/${task.id}`,
        }
    ];

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
            router.delete(route('tasks.destroy', task.id));
        }
    };

    const getStatusConfig = () => {
        const configs = {
            pending: {
                color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                icon: Clock,
                label: 'Pending'
            },
            in_progress: {
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                icon: Clock,
                label: 'In Progress'
            },
            completed: {
                color: 'bg-green-100 text-green-800 border-green-200',
                icon: CheckCircle,
                label: 'Completed'
            }
        };
        return configs[task.status];
    };

    const getPriorityConfig = () => {
        const configs = {
            low: {
                color: 'bg-gray-100 text-gray-800 border-gray-200',
                icon: Flag,
                label: 'Low Priority'
            },
            medium: {
                color: 'bg-orange-100 text-orange-800 border-orange-200',
                icon: Flag,
                label: 'Medium Priority'
            },
            high: {
                color: 'bg-red-100 text-red-800 border-red-200',
                icon: Flag,
                label: 'High Priority'
            }
        };
        return configs[task.priority];
    };

    const statusConfig = getStatusConfig();
    const priorityConfig = getPriorityConfig();
    const StatusIcon = statusConfig.icon;
    const PriorityIcon = priorityConfig.icon;

    const isOverdue = () => {
        if (!task.due_date || task.status === 'completed') return false;
        return new Date(task.due_date) < new Date();
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

    const formatDueDate = (dateString: string) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Header */}
                <Head title={task.title} />
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">

                        <div>
                            <h1 className="text-3xl font-bold mb-2">{task.title}</h1>
                            <div className="flex items-center gap-3">
                                <Badge className={statusConfig.color}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusConfig.label}
                                </Badge>
                                <Badge className={priorityConfig.color}>
                                    <PriorityIcon className="w-3 h-3 mr-1" />
                                    {priorityConfig.label}
                                </Badge>
                                {isOverdue() && (
                                    <Badge className="bg-red-100 text-red-800 border-red-200">
                                        Overdue
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={route('tasks.edit', task.id)}>
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
                    {/* Task Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {task.description ? (
                                    <div className="prose prose-sm max-w-none">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap dark:text-white">
                                            {task.description}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground italic">
                                        No description provided for this task.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Task Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Timeline</CardTitle>
                                <CardDescription>
                                    Task creation and update history
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium">Task Created</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(task.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    {task.created_at !== task.updated_at && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <div>
                                                <p className="text-sm font-medium">Last Updated</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDate(task.updated_at)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {task.status === 'completed' && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <div>
                                                <p className="text-sm font-medium">Task Completed</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDate(task.updated_at)}
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
                        {/* Task Properties */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Task Properties</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <StatusIcon className="w-4 h-4" />
                                        <span className="text-sm font-medium">Status</span>
                                    </div>
                                    <Badge className={statusConfig.color}>
                                        {statusConfig.label}
                                    </Badge>
                                </div>

                                <Separator />

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <PriorityIcon className="w-4 h-4" />
                                        <span className="text-sm font-medium">Priority</span>
                                    </div>
                                    <Badge className={priorityConfig.color}>
                                        {priorityConfig.label}
                                    </Badge>
                                </div>

                                <Separator />

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-sm font-medium">Due Date</span>
                                    </div>
                                    {task.due_date ? (
                                        <p className={`text-sm ${isOverdue() ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                                            {formatDueDate(task.due_date)}
                                            {isOverdue() && (
                                                <span className="ml-2 text-red-500">(Overdue)</span>
                                            )}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No due date set</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href={route('tasks.edit', task.id)}>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Task
                                    </Button>
                                </Link>

                                {task.status !== 'completed' && (
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50"
                                        onClick={() => {
                                            router.patch(route('tasks.update', task.id), {
                                                status: 'completed'
                                            });
                                        }}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Mark as Complete
                                    </Button>
                                )}

                                <Link href={route('tasks.create')}>
                                    <Button variant="outline" className="w-full justify-start">
                                        Create New Task
                                    </Button>
                                </Link>

                                <Separator />

                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Task
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Task Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Task Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Task ID</span>
                                    <span className="text-sm font-medium">#{task.id}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Created</span>
                                    <span className="text-sm font-medium">
                                        {new Date(task.created_at).toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Updated</span>
                                    <span className="text-sm font-medium">
                                        {new Date(task.updated_at).toLocaleDateString('id-ID')}
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
