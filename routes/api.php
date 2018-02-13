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

// provide date of latest update to certain tables
Route::get('/song/latest', 'SongController@latest');
Route::get('/plan/latest', 'PlanController@latest');
Route::get('/user/latest', 'UserController@latest');

// with Authentication
Route::middleware('auth:api')->group(
    function () {
        Route::apiResources(
            [
                'user' => 'UserController',
                'type' => 'TypeController',
                'role' => 'RoleController',
                'plan' => 'PlanController',
                'song' => 'SongController'
            ]
        );
    }
);

// no authentication
// Route::apiResources(
//     [
//         'user' => 'UserController',
//         'type' => 'TypeController',
//         'role' => 'RoleController',
//         'plan' => 'PlanController',
//         'song' => 'SongController'
//     ]
// );