<?php

namespace App\Http\Controllers\Song;

use App\Models\SongPart;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;

class SongPartController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // get all roles with all users having this role
        return response(SongPart::get()->jsonSerialize(), Response::HTTP_OK);
    }



    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request the request from the fontend
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if ($request->has('field') && $request->has('value')) {
            // create a new SongPart
            $songPart = new SongPart;
            $songPart->name = $request->value;
            $songPart->save();
            // return back full list of all roles
            return response(SongPart::with('users')->get()->jsonSerialize(), Response::HTTP_OK);
        }
        return 'invalid request';
    }



    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request  the request from the fontend
     * @param \App\Models\SongPart     $songPart the item to be modified
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SongPart $songPart)
    {
        // check if field and value are provided
        if ($request->has('field') && $request->has('value')) {
            $songPart[$request->field] = $request->value;
            $songPart->save();
            return response($songPart, Response::HTTP_OK);       
        }
        return 'invalid request';
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\SongPart $songPart the item to be modified
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(SongPart $songPart)
    {
        // remove role
        $songPart->delete();
        return response(SongPart::with('users')->get()->jsonSerialize(), Response::HTTP_OK);
    }
}
