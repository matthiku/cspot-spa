<?php

namespace App\Http\Controllers\Song;

use DB;
use Carbon\Carbon;
use App\Models\Song;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;

class SongController extends Controller
{


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // get full table with related data
        $songs = Song::with('onsongs')->get();
        return response($songs->jsonSerialize(), Response::HTTP_OK);
    }


    // get date of latest change in this table:
    public function latest(Request $request)
    {        
        $latest = Song::latest('updated_at')->first()->updated_at;

        // If the updated-date reported from the frontend is older,
        // we already return the full list of songs instead of a just a date!
        if ($request->has('latest')) {
            if ($request->latest === 'init' || Carbon::parse($request->latest)->ne($latest)) {
                return $this->index();
            }
        }
        return response($latest, Response::HTTP_OK);
    }


    /**
     * Get a single resource with all related data
     */
    public function show(Song $song)
    {
        $songWithRel = Song::with('onsongs')->where('id', $song->id)->first();
        return response($songWithRel, Response::HTTP_OK);
    }



    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Song  $song
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Song $song)
    {
        //
    }



    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Song  $song
     * @return \Illuminate\Http\Response
     */
    public function destroy(Song $song)
    {
        //
    }
}
