<?php

namespace App\Http\Controllers;

use App\Models\Type;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return response(Type::all()->jsonSerialize(), Response::HTTP_OK);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if ($request->has('field') && $request->has('value')) {
            // create a new TYPE
            $type = new Type;
            $type->name = $request->value;
            $type->start = $request->start;
            $type->end = $request->end;
            $type->save();
            // return back full list of all types
            return response(Type::all()->jsonSerialize(), Response::HTTP_OK);
        }
        return 'invalid request';
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Type  $type
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Type $type)
    {
        // check if field and value are provided
        if ($request->has('field') && $request->has('value')) {
            $type[$request->field] = $request->value;
            $type->save();
            return response(Type::all()->jsonSerialize(), Response::HTTP_OK);       
        }
        return 'invalid request';
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Type  $type
     * @return \Illuminate\Http\Response
     */
    public function destroy(Type $type)
    {
        // remove TYPE
        $type->delete();
        return response(Type::all()->jsonSerialize(), Response::HTTP_OK);
    }
}
