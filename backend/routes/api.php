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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// Solved Error: Route [login] not defined.
Route::get('unauthenticated', function(){
    return response()->json(
        [
            'errors' => [
                'status' => 401,
                'message' => 'Unauthenticated',
            ]
        ], 401
    );
})->name('login');

Route::middleware(['auth:api'])->group(function () {
    Route::resource('users', 'UserController');
    Route::resource('roles', 'RoleController');

    Route::get('get-all-permissions', 'PermissionController@getAllPermissions');
    Route::get('get-loggedin-user-information', 'UserController@getLoggedinUserInformation');
});
