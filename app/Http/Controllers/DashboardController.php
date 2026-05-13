<?php

namespace App\Http\Controllers;

use App\Models\Nasabah;
use App\Models\Instansi;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index($peran)
    {
        $user = auth()->user();
        
        $stats = [
            'total_nasabah' => 0,
            'total_instansi' => 0,
            'total_pengawas' => 0,
        ];

        if ($user->peran === 'administrator') {
            $stats['total_nasabah'] = Nasabah::count();
            $stats['total_instansi'] = Instansi::count();
            $stats['total_pengawas'] = User::where('peran', 'pengawas')->count();
            
            $recent_nasabah = Nasabah::with('instansi')
                ->latest()
                ->take(5)
                ->get();
        } else {
            // Pengawas only sees their instansi data
            $stats['total_nasabah'] = Nasabah::where('instansi_id', $user->instansi_id)->count();
            $stats['total_instansi'] = 1; // Only their own instansi
            $stats['total_pengawas'] = User::where('peran', 'pengawas')
                ->where('instansi_id', $user->instansi_id)
                ->count();

            $recent_nasabah = Nasabah::with('instansi')
                ->where('instansi_id', $user->instansi_id)
                ->latest()
                ->take(5)
                ->get();
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recent_nasabah' => $recent_nasabah
        ]);
    }
}
