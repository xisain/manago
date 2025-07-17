<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index()
    {

        $tasks = Task::where('user_id', Auth::id())->get();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks
        ]);
    }

    public function create()
    {
        return Inertia::render('tasks/create');
    }

    public function store(Request $request)
    {
        // dd($request);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
        ]);
        $validated['user_id'] = Auth::id();
        Task::create($validated);

        return redirect()->route('tasks.index')
            ->with('message', 'Task created successfully.');
    }

    public function show(Task $task)
    {
        return Inertia::render('tasks/show', [
            'task' => $task
        ]);
    }

    public function edit(Task $task)
    {
        return Inertia::render('tasks/edit', [
            'task' => $task
        ]);
    }

    public function update(Request $request, Task $task)
    {
        // Validate the request
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'status' => 'sometimes|required|in:pending,in_progress,completed',
            'priority' => 'sometimes|required|in:low,medium,high',
            'due_date' => 'sometimes|nullable|date',
        ]);

        // Update the task
        $task->update($validated);

        // For inline updates (AJAX), return JSON response
         if (!$request->header('X-Inertia')) {
        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $task
        ]);
    }

        // For form updates, redirect back
        return redirect()->route('tasks.index')
            ->with('message', 'Task updated successfully.');
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return redirect()->route('tasks.index')
            ->with('message', 'Task deleted successfully.');
    }
}
