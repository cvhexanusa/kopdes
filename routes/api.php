<?php

use App\Http\Controllers\Api\NasabahController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/nasabah', [NasabahController::class, 'store']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
