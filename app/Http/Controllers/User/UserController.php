<?php
/**
 * PHP Version 7.x
 *
 * @category Controller
 * @package  C-SpotSPA
 * @author   Matthias Kuhs <matthiku@yahoo.com>
 * @license  MIT mit.com
 * @link     Dummy
 */
namespace App\Http\Controllers\User;

use Auth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;


/**
 * UserController
 *
 * @category Controller
 * @package  C-SpotSPA
 * @author   Matthias Kuhs <matthiku@yahoo.com>
 * @license  MIT mit.com
 * @link     Dummy
 */
class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (Auth::user()->isAdmin()) {
            // full user list for Admins
            return response(
                User::with('roles')->get()->jsonSerialize(), Response::HTTP_OK
            );
        }
        // normal users only get their own profile
        $user = User::where('id', Auth::id())->with('roles')->get();
        return response($user, Response::HTTP_OK);       
    }


    /**
     * Get date of latest change in this table
     *
     * @return \Illuminate\Http\Response
     */
    public function latest()
    {        
        $latest = User::latest('updated_at')->first()->updated_at;
        return response($latest, Response::HTTP_OK);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request the HTTP request
     * @param \App\User                $user    the USER object
     *
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
     * @param \App\User $user the USER object
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        //
    }
}
