<?php

namespace App\Http\Controllers;

use DB;
use App\Models\Song;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

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
    public function latest()
    {        
        $latest = Song::latest('updated_at')->first()->updated_at;
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
