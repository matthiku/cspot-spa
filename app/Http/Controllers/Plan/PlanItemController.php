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
        // type can be: 'text', 'song' or 'read'  ==> need to add some Validation?
        $item = new Item(
            [
                'seq_no' => $request->seqNo,
                'song_id' => $request->type === 'song' ? $request->value : null,
                'comment' => $request->type !== 'song' ? $request->value : null,
            ]
        );
        $plan->items()->save($item);

        // need to verify the all the sequence numbers are correct
        $this->updateSeqNos($request, $plan);

        // make sure the update gets reported to the 'parent' record as well
        $plan->updated_at = Carbon::now();
        $plan->save();

        return response($item->jsonSerialize(), Response::HTTP_OK);
    }

    public function updateSeqNos(Request $request, Plan $plan)
    {
        // get all the items for this plan, ordered by their seq_no
        $items      = $plan->items()->orderBy('seq_no')->get();
        // We are going to number all the items of this plan, starting with 1.0
        $counter = 1.0;

        // Loop through each item of the plan, making sure the
        //      seq_no of each item is always 1.0 bigger than the previous
        foreach ($items as $item) {
            if ($item->seq_no <> $counter ) {
                // update the current loop-item to correspond to the counter
                $item->seq_no = $counter;
                // Now get  the actual DB record
                $i = Item::find($item->id);
                // update the item accordingly
                $i->seq_no = $counter; $i->save();
            }
            // increase the counter to reflect the current seq_no
            $counter += 1.0;
        }
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

        // need to verify the all the sequence numbers are correct
        $this->updateSeqNos($request, $plan);

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
    public function destroy(Request $request, Plan $plan, Item $item)
    {
        // no need to use soft-deletes
        $item->forceDelete();

        // need to verify the all the sequence numbers are correct
        $this->updateSeqNos($request, $plan);

        // make sure the update gets reported to the 'parent' record as well
        $plan->updated_at = Carbon::now();
        $plan->save();
        return response($item->jsonSerialize(), Response::HTTP_OK);
    }

}
