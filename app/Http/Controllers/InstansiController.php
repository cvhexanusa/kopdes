<?php

namespace App\Http\Controllers;

use App\Models\Instansi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class InstansiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Instansi::query();

        // Jika Pengawas, hanya lihat instansinya sendiri
        if ($user->peran === 'pengawas') {
            $query->where('instansi_id', $user->instansi_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('desa', 'like', "%{$search}%")
                  ->orWhere('kecamatan', 'like', "%{$search}%")
                  ->orWhere('kabupaten', 'like', "%{$search}%");
            });
        }

        $instansis = $query->paginate(10)->withQueryString();

        return Inertia::render('instansi/index', [
            'instansis' => $instansis,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (auth()->user()->peran !== 'administrator') {
            Log::warning('Unauthorized instansi creation attempt', ['user' => auth()->id(), 'role' => auth()->user()->peran]);
            abort(403);
        }

        $request->validate([
            'nama' => 'required|string|max:255',
            'desa' => 'required|string|max:255',
            'kecamatan' => 'required|string|max:255',
            'kabupaten' => 'required|string|max:255',
            'kode_pos' => 'required|string|max:10',
            'waktu_aktif' => 'nullable|date',
        ]);

        try {
            Instansi::create([
                'nama' => $request->nama,
                'desa' => $request->desa,
                'kecamatan' => $request->kecamatan,
                'kabupaten' => $request->kabupaten,
                'kode_pos' => $request->kode_pos,
                'waktu_aktif' => $request->waktu_aktif,
                'users_id' => $request->user()->users_id,
            ]);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Instansi berhasil ditambahkan'
            ]);

            return redirect()->back();
        } catch (\Exception $e) {
            Log::error('Gagal menambah instansi: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'users_id' => auth()->user()->users_id,
                'request' => $request->all()
            ]);
            
            return redirect()->back()->withErrors(['message' => 'Gagal menambah data: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $instansi = Instansi::findOrFail($id);
        $user = auth()->user();

        // Security check for Pengawas
        if ($user->peran === 'pengawas') {
            if (trim((string)$id) !== trim((string)$user->instansi_id)) {
                Log::warning('Unauthorized Instansi access by Pengawas', [
                    'user_id' => $user->users_id,
                    'user_instansi' => $user->instansi_id,
                    'requested_id' => $id
                ]);
                abort(403, 'Anda hanya dapat mengakses profil instansi Anda sendiri.');
            }
        }

        return Inertia::render('instansi/show', [
            'instansi' => $instansi
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $instansi = Instansi::findOrFail($id);
        $user = auth()->user();

        // Security check
        if ($user->peran === 'pengawas' && trim((string)$id) !== trim((string)$user->instansi_id)) {
            abort(403);
        }

        $request->validate([
            'nama' => 'required|string|max:255',
            'desa' => 'required|string|max:255',
            'kecamatan' => 'required|string|max:255',
            'kabupaten' => 'required|string|max:255',
            'kode_pos' => 'required|string|max:10',
            'waktu_aktif' => 'nullable|date',
        ]);

        $instansi->update($request->all());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Data instansi berhasil diperbarui'
        ]);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        if (auth()->user()->peran !== 'administrator') {
            abort(403);
        }

        $instansi = Instansi::findOrFail($id);
        $instansi->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Instansi berhasil dihapus'
        ]);

        return redirect()->back();
    }
}
