<?php

namespace App\Http\Controllers\Plan;

use Carbon\Carbon;
use App\Models\Plan;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;

class PlanItemController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Plan $plan)
    {
        // payload contains: value, seqNo and type
        // type can be: 'text', 'song' or 'read'  ==> add some Validation?
        $item = new Item(
            [
                'seq_no' => $request->seqNo,
                'song_id' => $request->type === 'song' ? $request->value : null,
                'comment' => $request->type !== 'song' ? $request->value : null,
            ]
        );
        $plan->items()->save($item);
        // make sure the update gets reported to the 'parent' record as well
        $plan->updated_at = Carbon::now();
        $plan->save();

        return response($item->jsonSerialize(), Response::HTTP_OK);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Plan  $plan
     * @param  \App\Models\Item  $item
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Plan $plan, Item $item)
    {
        // $request must contain field name and new value
        $item[$request->field] = $request->value;
        $item->save();
        // make sure the update gets reported to the 'parent' record as well
        $plan->updated_at = Carbon::now();
        $plan->save();

        return response($item->jsonSerialize(), Response::HTTP_OK);
    }



    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Item  $item
     * @return \Illuminate\Http\Response
     */
    public function destroy(Plan $plan, Item $item)
    {
        // no need to use soft-deletes
        $item->forceDelete();
        // make sure the update gets reported to the 'parent' record as well
        $plan->updated_at = Carbon::now();
        $plan->save();
        return response($item->jsonSerialize(), Response::HTTP_OK);
    }

}
