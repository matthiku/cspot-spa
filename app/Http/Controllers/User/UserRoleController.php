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
     * @param \Illuminate\Http\Request $request request containing userId+roleId
     * @param \App\Models\User         $user    the User
     * 
     * @return \Illuminate\Http\Response         JSON response
     */
    public function store(Request $request, User $user)
    {
        // attach role to this user
        // see if this was a submit with a new role member request
        if ($request->has('user_id') && $request->has('role_id')) {
            // now we need to add this to the DB
            $role = new Role(
                [
                    'user_id' => $request->user_id, 
                    'role_id' => $request->role_id,
                ]
            );
            $user->roles()->save($role);

            return response($role->jsonSerialize(), Response::HTTP_OK);
        }
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
