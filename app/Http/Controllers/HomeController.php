<?php

namespace App\Http\Controllers;

use Auth;
use Illuminate\Http\Request;

class HomeController extends Controller
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
    public function index()
    {
        $data = [];
        if (Auth::user()) {
            $user = \App\Models\User::with('roles')->where('id', Auth::user()->id)->first();
            $data['user'] = $user;
        }
        return view('app', ['data' => $data]);
    }
}
