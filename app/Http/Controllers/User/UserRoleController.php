<?php

namespace App\Http\Controllers\User;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;

class UserRoleController extends Controller
{

    /**
     * Store a new ROLE for a USER in storage.
     *
     * @param \App\Models\User $user the User
     * @param \App\Models\Role $role the ROLE object
     * 
     * @return \Illuminate\Http\Response         JSON response
     */
    public function store(User $user, Role $role)
    {
        // attach role to this user        
        $user->roles()->save($role);
        return response($role->jsonSerialize(), Response::HTTP_OK);       
    }




    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request the HTTP PATCH request
     * @param \App\Models\User         $user    the USER object
     * @param \App\Models\Role         $role    the ROLE object
     * 
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user, Role $role)
    {
        return response(Response::HTTP_NOT_FOUND);
    }


    
    /**
     * Remove the specified ROLE resource from a user in storage.
     *
     * @param \App\Models\User $user the User
     * @param \App\Models\Role $role the Role to be added to the user
     * 
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user, Role $role)
    {
        // remove this role member from the user role
        $role->delete();
        return response($role->jsonSerialize(), Response::HTTP_OK);
    }
}
