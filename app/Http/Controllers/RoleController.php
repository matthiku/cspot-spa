<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // get all roles with all users having this role
        return response(Role::with('users')->get()->jsonSerialize(), Response::HTTP_OK);
    }



    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if ($request->has('field') && $request->has('value')) {
            // create a new ROLE
            $role = new Role;
            $role->name = $request->value;
            $role->save();
            // return back full list of all roles
            return response(Role::with('users')->get()->jsonSerialize(), Response::HTTP_OK);
        }
        return 'invalid request';
    }



    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Role $role)
    {
        // check if field and value are provided
        if ($request->has('field') && $request->has('value')) {
            $role[$request->field] = $request->value;
            $role->save();
            return response($role, Response::HTTP_OK);       
        }
        return 'invalid request';
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function destroy(Role $role)
    {
        // remove role
        $role->delete();
        return response(Role::with('users')->get()->jsonSerialize(), Response::HTTP_OK);
    }
}
