<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

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

        return response($item->jsonSerialize(), Response::HTTP_OK);
    }



    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Item  $item
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Plan $plan, Item $item)
    {
        //
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
        // need to re-calculate seq.nos!
        return response($item->jsonSerialize(), Response::HTTP_OK);
    }

}
