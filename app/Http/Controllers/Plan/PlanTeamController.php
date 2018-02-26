<?php

namespace App\Http\Controllers\Plan;

use App\Models\Plan;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;

class PlanTeamController extends Controller
{

    /**
     * Store a newly created TEAM member for a PLAN in storage.
     *
     * @param \Illuminate\Http\Request $request the HTTP POST request containing user_id and role_id
     * @param \App\Models\Plan         $plan    the Plan
     * 
     * @return \Illuminate\Http\Response         JSON response
     */
    public function store(Request $request, Plan $plan)
    {
        // attach role to this plan
        // see if this was a submit with a new team member request
        if ($request->has('user_id') && $request->has('role_id')) {
            // now we need to add this to the DB
            $team = new Team([
                'user_id' => $request->user_id, 
                'role_id' => $request->role_id,
                'comment' => '',
            ]);
            $plan->teams()->save($team);

            return response($team->jsonSerialize(), Response::HTTP_OK);
        }
    }




    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request the HTTP PATCH request
     * @param \App\Models\Plan         $plan    the PLAN object
     * 
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Plan $plan, Team $team)
    {        
        return response(Response::HTTP_NOT_FOUND);
    }


    
    /**
     * Remove the specified ROLE resource from a plan in storage.
     *
     * @param \App\Models\Plan $plan the Plan
     * @param \App\Models\Team $role the Team to be added to the plan
     * 
     * @return \Illuminate\Http\Response
     */
    public function destroy(Plan $plan, Team $team)
    {
        // remove this team member from the plan team
        $team->delete();
        return response($team->jsonSerialize(), Response::HTTP_OK);
    }
}
