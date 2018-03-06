<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// all routes lead to the app controller as they are managed by the frontend
Route::get('/', 'AppController@index');
Route::get('/login', 'AppController@index');
Route::get('/signin', 'AppController@index');
Route::get('/profile', 'AppController@index');
Route::get('/nextsunday', 'AppController@index');
Route::get('/songs', 'AppController@index');
Route::get('/addsongtoplan', 'AppController@index');
Route::get('/plans', 'AppController@index');
Route::get('/present', 'AppController@index');
Route::get('/plans/{plan_id}', 'AppController@index');
Route::get('/createplan', 'AppController@index');
Route::get('/admin', 'AppController@index');
Route::get('/admin/{any}', 'AppController@index');

Auth::routes();
