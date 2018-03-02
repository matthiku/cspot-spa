<?php

namespace App\Http\Controllers\User;

use Carbon\Carbon;
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
     * @param \Illuminate\Http\Request $request the HTTP PATCH request
     * @param \App\Models\User $user the User
     * 
     * @return \Illuminate\Http\Response         JSON response
     */
    public function store(Request $request, User $user)
    {
        $user->roles()->attach($request->role_id);

        // make sure the update gets reported to the 'parent' record as well
        $user->updated_at = Carbon::now();
        $user->save();
        
        return response($user->roles()->get(), Response::HTTP_OK);       
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
        $user->roles()->detach($role->id);

        // make sure the update gets reported to the 'parent' record as well
        $user->updated_at = Carbon::now();
        $user->save();
        
        return response($user->roles()->get(), Response::HTTP_OK);
    }
}
