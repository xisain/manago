<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\BalanceController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    // Routing Task
    Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::get('/tasks/create', [TaskController::class, 'create'])->name('tasks.create');
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::get('/tasks/{task}', [TaskController::class, 'show'])->name('tasks.show');
    Route::get('/tasks/{task}/edit', [TaskController::class, 'edit'])->name('tasks.edit');
    Route::patch('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');


    // Routing Balance
    Route::get('/balances', [BalanceController::class, 'index'])->name('balances.index');
    Route::get('/balances/create', [BalanceController::class, 'create'])->name('balances.create');
    Route::post('/balances', [BalanceController::class, 'store'])->name('balances.store');
    Route::get('/balances/{balance}', [BalanceController::class, 'show'])->name('balances.show');
    Route::get('/balances/{balance}/edit', [BalanceController::class, 'edit'])->name('balances.edit');
    Route::patch('/balances/{balance}', [BalanceController::class, 'update'])->name('balances.update');
    Route::delete('/balances/{balance}', [BalanceController::class, 'destroy'])->name('balances.destroy');

    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
