<?php

namespace App\Http\Controllers;

use App\Models\balance;
use App\Models\transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class BalanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       $balances = balance::all();
       return Inertia::render('balance/index',[
        'balances'=> $balances
       ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $balances = balance::all();
        return Inertia::render('balance/create',[
            'balances'=>$balances
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'current_balance'=> 'sometimes|required|numeric',
        ]);
        $validated['user_id'] = Auth::id();
        balance::create($validated);
        return redirect()->route('balances.index')
            ->with('message', 'Wallet Created succesfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Balance $balance)
    {
        // Ensure the balance belongs to the authenticated user
        if ($balance->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        // Load transactions for the balance
        $transactions = Transaction::where('balance_id', $balance->id)
            ->orderBy('date', 'desc')
            ->take(5) // Limit to 5 recent transactions
            ->get();

        return Inertia::render('balance/show', [
            'balance' => $balance,
            'transactions' => $transactions,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(balance $balance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, balance $balance)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(balance $balance)
    {
        //
    }
}
