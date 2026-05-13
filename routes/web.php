<?php

use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Controllers\PengawasController;
use App\Http\Controllers\InstansiController;
use App\Http\Controllers\NasabahController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect('/' . auth()->user()->peran . '/dashboard');
    }
    return redirect()->route('login');
})->name('home');

// Direct /dashboard to correct role path
Route::get('/dashboard', function () {
    if (auth()->check()) {
        return redirect('/' . auth()->user()->peran . '/dashboard');
    }
    return redirect()->route('login');
})->middleware(['auth']);

// Google Drive Callback (Must be outside prefix)
Route::get('nasabah/export-drive/callback', [NasabahController::class, 'googleCallback'])
    ->middleware(['auth'])
    ->name('nasabah.export-drive.callback');

// Role-based routes
Route::group([
    'prefix' => '{peran}',
    'middleware' => ['auth'],
    'where' => ['peran' => 'administrator|pengawas']
], function () {
    
    // Dashboard (for other roles or fallback)
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Resources and Shared Routes
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::resource('pengawas', PengawasController::class);
    Route::resource('instansi', InstansiController::class);
    
    // Nasabah Routes
    Route::get('nasabah/{nasabah}/pdf', [NasabahController::class, 'pdf'])->name('nasabah.pdf');
    Route::get('nasabah/export-drive', [NasabahController::class, 'exportToDrive'])->name('nasabah.export-drive');
    Route::resource('nasabah', NasabahController::class);
});

require __DIR__.'/settings.php';
