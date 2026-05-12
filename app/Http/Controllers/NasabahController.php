<?php

namespace App\Http\Controllers;

use App\Models\Nasabah;
use App\Models\Instansi;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        
        // Filter daftar instansi untuk dropdown (jika ada fitur create/edit)
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
        
        // Security check for Pengawas
        if (auth()->user()->peran === 'pengawas' && $nasabah->instansi_id !== auth()->user()->instansi_id) {
            abort(403);
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

        // Security check for Pengawas
        if (auth()->user()->peran === 'pengawas' && $nasabah->instansi_id !== auth()->user()->instansi_id) {
            abort(403);
        }

        $request->validate([
            'nama' => 'required|string|max:255',
            'nik' => 'required|string|unique:nasabahs,nik,' . $nasabah->nasabah_id . ',nasabah_id',
            'domisili' => 'required|string',
            'tempat_lahir' => 'required|string',
            'tanggal_lahir' => 'required|date',
            'no_handphone' => 'required|string',
            'pekerjaan' => 'required|string',
            'instansi_id' => 'required|exists:instansis,instansi_id',
        ]);

        $nasabah->update($request->all());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Data nasabah berhasil diperbarui'
        ]);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $nasabah = Nasabah::findOrFail($id);

        // Security check for Pengawas
        if (auth()->user()->peran === 'pengawas' && $nasabah->instansi_id !== auth()->user()->instansi_id) {
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
