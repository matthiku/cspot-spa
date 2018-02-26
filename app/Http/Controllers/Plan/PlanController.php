<?php

namespace App\Http\Controllers\Plan;

Use Carbon\Carbon;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Requests\StorePlan;
use App\Http\Controllers\Controller;

class PlanController extends Controller
{

    protected function getPlanWithRelations($plan) {
        return \App\Models\Plan::with(
            [
                'items',
                'teams',
                'resources',
                'notes',
                'histories'
            ]
        )
        ->where('id', $plan->id)
        ->first();
    }


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

    /**
     * Get date of latest change in the PLANS table
     */
    public function latest()
    {
        $latest = Plan::latest('updated_at')->first()->updated_at;
        return response($latest, Response::HTTP_OK);
    }
    /** 
     * Get date of latest update to a single plan (including child relations)
     */ 
    public function planLatest(Plan $plan)
    {
        $plan_date = $plan->updated_at;

        $item_date = $plan_date;
        if ($plan->items->count()) {
            $item_date = $plan->items()->latest('updated_at')->first()->updated_at;
        }
        $latest = $plan_date->max($item_date);
        
        $team_date = $plan_date;
        if ($plan->teams->count()) {
            $team_date = $plan->teams()->latest('updated_at')->first()->updated_at;
        }
        $latest = $latest->max($team_date);

        return response($latest, Response::HTTP_OK);
    }



    /**
     * Get a single plan
     * 
     * StorePlan handles the validation logic
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\Http\Response
     */
    public function show(Plan $plan)
    {
        $plan = $this->getPlanWithRelations($plan);
        return response($plan->jsonSerialize(), Response::HTTP_OK);
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
        // required fields
        $plan->date = Carbon::parse($request->date);
        $plan->leader_id = $request->leader_id;
        $plan->type_id = $request->type_id;
        $plan->changer = $request->changer;
        // optional fields
        if ($request->has('date_end')) $plan->date_end = Carbon::parse($request->date_end);
        if ($request->has('teacher_id')) $plan->teacher_id = $request->teacher_id;
        if ($request->has('info')) $plan->info = $request->info;
        if ($request->has('private')) $plan->private = $request->private;
        if ($request->has('subtitle')) $plan->subtitle = $request->subtitle;
        $plan->save();

        return response($plan->jsonSerialize(), Response::HTTP_OK);
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
        $plan = $this->getPlanWithRelations($plan);
        // request must contain field name and new value
        $value = $request->value;
        if ($request->field === 'date' || $request->field === 'date_end' ) {
            $value = Carbon::parse($request->value);
        }
        $plan[$request->field] = $value;
        $plan->save();

        return response($plan, Response::HTTP_OK);
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
        $plan->delete();
        return response(null, Response::HTTP_OK);
    }
    // simply change the field 'private' to '1'
    public function softdelete(Plan $plan)
    {
        //
        $plan->private = true;
        $plan->save();
        return response($plan->jsonSerialize(), Response::HTTP_OK);
    }
}
