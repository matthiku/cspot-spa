<?php

namespace App\Http\Controllers\User;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return response(User::with('roles')->get()->jsonSerialize(), Response::HTTP_OK);
    }

    // get date of latest change in this table:
    public function latest()
    {        
        $latest = User::latest('updated_at')->first()->updated_at;
        return response($latest, Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        // currently, only the name can be changed here
        if ($request->has('name')) {
            $user->name = $request->name;
            $user->save();
            // reload this user with the related roles
            $user = User::where('id', $user->id)->with('roles')->first();
            return response($user, Response::HTTP_OK);       
        }
        return;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        //
    }
}
