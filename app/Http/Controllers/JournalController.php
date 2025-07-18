<?php

namespace App\Http\Controllers;

use App\Models\journal;
use Illuminate\Http\Request;
use inertia\Inertia;

class JournalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia::render('journal/index', [
            
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(journal $journal)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(journal $journal)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, journal $journal)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(journal $journal)
    {
        //
    }
}
