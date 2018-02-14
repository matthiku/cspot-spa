<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Requests\StorePlan;

class PlanController extends Controller
{



    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // for performance reasons, get the last 100 plans only
        $plans = Plan
            ::with(
                [
                    'items',
                    'teams',
                    'resources',
                    'notes',
                    'histories'
                ]
            )
            ->orderBy('date', 'desc')
            ->take(100)
            ->get();

        return response($plans->jsonSerialize(), Response::HTTP_OK);
    }

    // get date of latest change in this table:
    public function latest()
    {
        $latest = Plan::latest('updated_at')->first()->updated_at;
        return response($latest, Response::HTTP_OK);
    }



    /**
     * Store a newly created resource in storage.
     * 
     * StorePlan handles the validation logic
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StorePlan $request)
    {
        $plan = new Plan();
        // required fields (validated!)
        $plan->date = $request->date;
        $plan->leader_id = $request->leader_id;
        $plan->type_id = $request->type_id;
        $plan->changer = $request->changer;
        // optional fields
        $plan->start = $request->start;
        $plan->date_end = $request->date_end;
        $plan->teacher_id = $request->teacher_id;
        $plan->info = $request->info;
        $plan->private = $request->private;
        $plan->subtitle = $request->subtitle;
        $plan->save();
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Plan $plan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\Http\Response
     */
    public function destroy(Plan $plan)
    {
        //
        // Plan::destroy($plan)
    }
}
