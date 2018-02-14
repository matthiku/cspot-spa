<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get(
    '/user', function (Request $request) {
        return $request->user();
    }
);

// with Authentication
Route::middleware('auth:api')->group(
    function () {        
        // provide date of latest update to certain tables
        Route::get('/song/latest', 'SongController@latest');
        Route::get('/plan/latest', 'PlanController@latest');
        Route::get('/user/latest', 'UserController@latest');

        // provide the CRUD  resources
        Route::apiResources(
            [
                'user' => 'UserController',
                'type' => 'TypeController',
                'role' => 'RoleController',
                'plan' => 'PlanController',
                'song' => 'SongController'
            ]
        );

        // provide for 'soft-deletes'
        // https://laravel.com/docs/5.5/eloquent#soft-deleting
        Route::delete('/plan/{plan}/soft', 'PlanController@softdelete');
    }
);
