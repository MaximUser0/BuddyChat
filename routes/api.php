<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::post("login", [AuthController::class,"login"]);
Route::post("create", [AuthController::class,"create"]);

Route::get("category", [CategoryController::class,"index"]);
Route::get("posts", [PostController::class,"indexAll"]);

Route::middleware('auth:sanctum')->group(function () {
    Route::get("logout", [AuthController::class,"logout"]);

    Route::get("user", [UserController::class,"showMe"]);
    Route::get("user/{id}", [UserController::class,"show"]);
    Route::delete("user", [UserController::class,"destroy"]);
    Route::post("user", [UserController::class,"update"]);
    Route::post("find", [UserController::class,"find"]);

    Route::get("post", [PostController::class,"index"]);
    Route::get("post/my", [PostController::class,"indexMy"]);
    Route::get("post/{id}", [PostController::class,"show"]);
    Route::post("post", [PostController::class,"store"]);
    Route::delete("post/img/{id}", [PostController::class,"destroyImage"]);
    Route::post("post/{id}", [PostController::class,"update"]);//Patch
    Route::delete("post/{id}", [PostController::class,"destroy"]);

    Route::get("friend", [FriendController::class,"index"]);
    Route::get("friendRequest", [FriendController::class,"indexRequest"]);
    Route::post("friend", [FriendController::class,"store"]);
    Route::post("friend/{id}", [FriendController::class,"update"]);
    Route::delete("friend/{id}", [FriendController::class,"destroy"]);

    Route::get("chat", [ChatController::class,"index"]);
    Route::post("chat/call/{id}", [ChatController::class,"indexCall"]);
    Route::post("chat", [ChatController::class,"store"]);
    Route::get("chat/{id}", [ChatController::class,"show"]);
    Route::post("chat/{id}", [ChatController::class,"sent"]);
    Route::delete("chat/{id}/{message}", [ChatController::class,"destroyMessage"]);

    Route::middleware('admin')->group(function () {
        Route::get("users", [UserController::class,"index"]);
        Route::post("category", [CategoryController::class,"store"]);
        Route::patch("category/{id}", [CategoryController::class,"update"]);
        Route::delete("category/{id}", [CategoryController::class,"destroy"]);
    });
});
