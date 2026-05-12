<?php

use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Controllers\PengawasController;
use App\Http\Controllers\InstansiController;
use App\Http\Controllers\NasabahController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::inertia('dashboard', 'dashboard')->name('dashboard');
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::resource('pengawas', PengawasController::class);
    Route::resource('instansi', InstansiController::class);
    Route::resource('nasabah', NasabahController::class);
});

require __DIR__.'/settings.php';
