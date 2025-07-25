<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Balance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Validator;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $transactions = Transaction::with('balance.user')
            ->orderBy('date', 'desc')
            ->get();
        
        $balances = Balance::with('user')->get();
        
        return Inertia::render('transactions/index', compact('transactions', 'balances'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $balances = Balance::with('user')->get();
        $balanceId = $request->query('balance_id');
        $type = $request->query('type', 'expense');
        return Inertia::render('transactions/create', [
            'balances' => $balances,
            'selectedBalanceId' => $balanceId,
            'type' => $type,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::id();
        $request->validate([
            'date' => 'required|date',
            'type' => 'required|in:income,expense',
            'category' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'balance_id' => 'required|exists:balances,id',
        ]);

        // Validate that the balance belongs to the authenticated user
        $balance = Balance::where('id', $request->balance_id)
            ->where('user_id', $user)
            ->firstOrFail();

        DB::transaction(function () use ($request, $balance) {
            // Create the transaction with balance_id
            $transaction = Transaction::create($request->only([
                'balance_id',
                'type',
                'amount',
                'category',
                'description',
                'date',
            ]));

            // Update balance based on transaction type
            if ($request->type === 'expense') {
                $balance->current_balance -= $request->amount;
            } else {
                $balance->current_balance += $request->amount;
            }

            $balance->save();
        });

        return redirect()->route('transactions.index')->with('message', 'Transaction created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        return redirect()->route('transactions.index')->with('message', 'Transaction Deleted');
    }
      public function bulkDelete(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|exists:transactions,id'
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('error',$validator)->withInput();
        }

        try {
            Transaction::whereIn('id', $request->ids)->delete();
            
            return redirect()->route('transactions.index')->with('message', 'Transaction Deleted');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error deleting transactions');
        }
    }
}