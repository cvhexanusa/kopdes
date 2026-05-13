<?php

namespace App\Http\Controllers;

use App\Models\Nasabah;
use App\Models\Instansi;
use App\Services\GoogleDriveService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class NasabahController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Nasabah::with('instansi');

        // Jika user adalah Pengawas, hanya tampilkan nasabah dari instansinya sendiri
        if ($user->peran === 'pengawas') {
            $query->where('instansi_id', $user->instansi_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%")
                  ->orWhere('pekerjaan', 'like', "%{$search}%");
            });
        }

        $nasabahs = $query->paginate(10)->withQueryString();
        
        $instansisQuery = Instansi::select('instansi_id', 'nama');
        if ($user->peran === 'pengawas') {
            $instansisQuery->where('instansi_id', $user->instansi_id);
        }
        $instansis = $instansisQuery->get();

        return Inertia::render('nasabah/index', [
            'nasabahs' => $nasabahs,
            'instansis' => $instansis,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $nasabah = Nasabah::with('instansi')->findOrFail($id);
        $user = auth()->user();
        
        // Security check for Pengawas
        if ($user->peran === 'pengawas') {
            if (trim((string)$nasabah->instansi_id) !== trim((string)$user->instansi_id)) {
                Log::warning('Unauthorized access attempt by Pengawas', [
                    'user_id' => $user->users_id,
                    'user_instansi' => $user->instansi_id,
                    'nasabah_instansi' => $nasabah->instansi_id
                ]);
                abort(403, 'Anda tidak memiliki akses ke data nasabah ini.');
            }
        }

        return Inertia::render('nasabah/show', [
            'nasabah' => $nasabah
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $nasabah = Nasabah::findOrFail($id);
        $user = auth()->user();

        // Security check for Pengawas
        if ($user->peran === 'pengawas' && trim((string)$nasabah->instansi_id) !== trim((string)$user->instansi_id)) {
            abort(403);
        }

        $request->validate([
            'nama' => 'required|string|max:255',
            'nik' => 'required|string|unique:nasabahs,nik,' . $nasabah->nasabah_id . ',nasabah_id',
            'domisili' => 'required|string',
            'tempat_lahir' => 'required|string',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|string|in:Laki-laki,Perempuan',
            'no_handphone' => 'required|string',
            'pekerjaan' => 'required|string',
            'instansi_id' => 'required|exists:instansis,instansi_id',
            'foto_ktp' => 'nullable|image|max:2048',
            'foto_kk' => 'nullable|image|max:2048',
        ]);

        $data = $request->except(['foto_ktp', 'foto_kk']);

        // Handle File Uploads
        if ($request->hasFile('foto_ktp')) {
            // Hapus file lama jika ada
            if ($nasabah->foto_ktp && Storage::disk('public')->exists($nasabah->foto_ktp)) {
                Storage::disk('public')->delete($nasabah->foto_ktp);
            }
            $data['foto_ktp'] = $request->file('foto_ktp')->store('nasabah', 'public');
        }

        if ($request->hasFile('foto_kk')) {
            // Hapus file lama jika ada
            if ($nasabah->foto_kk && Storage::disk('public')->exists($nasabah->foto_kk)) {
                Storage::disk('public')->delete($nasabah->foto_kk);
            }
            $data['foto_kk'] = $request->file('foto_kk')->store('nasabah', 'public');
        }

        $nasabah->update($data);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Data nasabah berhasil diperbarui'
        ]);

        return redirect()->back();
    }

    /**
     * Export nasabah data to PDF.
     */
    public function pdf($id)
    {
        $nasabah = Nasabah::with('instansi')->findOrFail($id);
        $user = auth()->user();

        // Security check for Pengawas
        if ($user->peran === 'pengawas' && trim((string)$nasabah->instansi_id) !== trim((string)$user->instansi_id)) {
            abort(403);
        }

        $pdf = Pdf::loadView('nasabah.pdf', compact('nasabah'))
                  ->setPaper('a4', 'portrait');

        return $pdf->stream('Nasabah_' . $nasabah->nama . '.pdf');
    }

    /**
     * Export selected nasabah to Google Drive organized by instansi.
     */
    public function exportToDrive(Request $request, GoogleDriveService $driveService)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:nasabahs,nasabah_id'
        ]);

        $token = session('google_drive_token');

        if (!$token) {
            session(['nasabah_export_ids' => $request->ids]);
            return Inertia::location($driveService->getAuthUrl());
        }

        $driveService->setAccessToken($token);

        if ($driveService->isAccessTokenExpired()) {
            session(['nasabah_export_ids' => $request->ids]);
            return Inertia::location($driveService->getAuthUrl());
        }

        return $this->processExport($request->ids, $driveService);
    }

    /**
     * Handle the callback from Google OAuth.
     */
    public function googleCallback(Request $request, GoogleDriveService $driveService)
    {
        if ($request->has('code')) {
            $token = $driveService->authenticate($request->code);
            session(['google_drive_token' => $token]);
            
            $ids = session('nasabah_export_ids');
            if ($ids) {
                $driveService->setAccessToken($token);
                $this->processExport($ids, $driveService);
                session()->forget('nasabah_export_ids');
                
                Inertia::flash('toast', [
                    'type' => 'success',
                    'message' => 'Export ke Google Drive berhasil!'
                ]);
            }
        }

        return redirect()->route('nasabah.index');
    }

    /**
     * Core logic to generate PDFs and upload to Drive.
     */
    protected function processExport($ids, $driveService)
    {
        $nasabahs = Nasabah::with('instansi')->whereIn('nasabah_id', $ids)->get();

        foreach ($nasabahs as $nasabah) {
            $instansiName = $nasabah->instansi->nama ?? 'Umum';
            $folderId = $driveService->getOrCreateFolder($instansiName);
            
            $pdf = Pdf::loadView('nasabah.pdf', compact('nasabah'))
                      ->setPaper('a4', 'portrait');
            
            $content = $pdf->output();
            $fileName = 'Nasabah_' . str_replace(' ', '_', $nasabah->nama) . '.pdf';
            
            $driveService->uploadPdf($fileName, $content, $folderId);
        }

        return redirect()->route('nasabah.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $nasabah = Nasabah::findOrFail($id);
        $user = auth()->user();

        // Security check for Pengawas
        if ($user->peran === 'pengawas' && trim((string)$nasabah->instansi_id) !== trim((string)$user->instansi_id)) {
            abort(403);
        }

        $nasabah->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Nasabah berhasil dihapus'
        ]);

        return redirect()->back();
    }
}
