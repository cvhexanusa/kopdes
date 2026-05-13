<?php

use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Controllers\PengawasController;
use App\Http\Controllers\InstansiController;
use App\Http\Controllers\NasabahController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth'])->group(function () {
    // Redirect /dashboard to the role-prefixed version
    Route::get('dashboard', function () {
        return redirect(auth()->user()->peran . '/dashboard');
    });

    // Grouping all routes with {peran} prefix
    Route::prefix('{peran}')->group(function () {
        
        // Dashboard
        Route::get('dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');

        // Resources and Shared Routes
        Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
        Route::resource('pengawas', PengawasController::class);
        Route::resource('instansi', InstansiController::class);
        
        // Nasabah Routes
        Route::get('nasabah/{nasabah}/pdf', [NasabahController::class, 'pdf'])->name('nasabah.pdf');
        Route::post('nasabah/export-drive', [NasabahController::class, 'exportToDrive'])->name('nasabah.export-drive');
        Route::get('nasabah/export-drive/callback', [NasabahController::class, 'googleCallback'])->name('nasabah.export-drive.callback');
        Route::resource('nasabah', NasabahController::class);
    });
});

require __DIR__.'/settings.php';
