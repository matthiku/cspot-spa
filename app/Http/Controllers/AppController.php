<?php

namespace App\Http\Controllers;

use Auth;
use Illuminate\Http\Request;

class AppController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, $id=-1)
    {
        $data = [];

        // check if url contains request for a single plan
        if ($request->is('plans/*') && $id) {
            $plan = \App\Models\Plan::with('items')->where('id', $id)->first();
            if ($plan) {
                $data['plan'] = $plan;
            }
        }

        // add user data if user is already authenticated
        if (Auth::user()) {
            $user = \App\Models\User::with('roles')->where('id', Auth::user()->id)->first();
            $data['user'] = $user;
        }
        return view('app', ['data' => $data]);
    }
}
