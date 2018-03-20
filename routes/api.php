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
        Route::get('/song/latest', 'song\SongController@latest');
        Route::get('/user/latest', 'User\UserController@latest');

        Route::get('/plan/latest', 'Plan\PlanController@latest');
        Route::get('/plan/{plan}/latest', 'Plan\PlanController@planLatest');


        // provide the  CRUD  resources
        Route::apiResources(
            [
                'user' => 'User\UserController',
                'user.role' => 'User\UserRoleController',

                'type' => 'TypeController',
                'role' => 'RoleController',

                'song' => 'Song\SongController',
                'song_part' => 'Song\SongPartController',

                'plan' => 'Plan\PlanController',
                'plan.team' => 'Plan\PlanTeamController',
                'plan.item' => 'Plan\PlanItemController',
            ]
        );
        

        // provide for 'soft-deletes' https://laravel.com/docs/5.5/eloquent#soft-deleting
        Route::delete('/plan/{plan}/soft', 'Plan\PlanController@softdelete');

        // API route to compile bible references
        Route::get('bible/books',                           'BibleController@books');         // get all books
        Route::get('bible/books/all/chapters',              'BibleController@allChapters');   // get chapter numbers of ALL books
        Route::get('bible/books/all/verses',                'BibleController@allVerses')->name('bible.books.all.verses'); // get chapter and verse numbers of ALL books
        Route::get('bible/books/{book}',                    'BibleController@chapters');      // get chapter numbers of a book
        Route::get('bible/books/{book}/chapters/{chapter}', 'BibleController@verses');        // get verse numbers of a chapter
        // get bible texts
        Route::get('bible/text/{version}/{book}/{chapter}/', 'BibleController@getChapter')->name('bible.chapter');     // get bible text
        Route::get('bible/passage/{version}/{book}/{chapter}/{verseFrom?}/{verseTo?}/', 'BibleController@getBibleText')->name('bible.passage'); // get bible passage

    }
);
