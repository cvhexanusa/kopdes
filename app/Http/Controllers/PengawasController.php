<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Instansi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PengawasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::where('peran', 'pengawas')->with('instansi');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $pengawas = $query->paginate(10)->withQueryString();
        $instansis = Instansi::select('instansi_id', 'nama')->get();

        return Inertia::render('pengawas/index', [
            'pengawas' => $pengawas,
            'instansis' => $instansis,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'instansi_id' => 'nullable|exists:instansis,instansi_id',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'peran' => 'pengawas',
            'instansi_id' => $request->instansi_id,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pengawas berhasil ditambahkan'
        ]);

        return redirect()->back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $pengawa = User::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $pengawa->id,
            'instansi_id' => 'nullable|exists:instansis,instansi_id',
        ]);

        $pengawa->update([
            'name' => $request->name,
            'email' => $request->email,
            'instansi_id' => $request->instansi_id,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Data pengawas berhasil diperbarui'
        ]);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $pengawa = User::findOrFail($id);
        $pengawa->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pengawas berhasil dihapus'
        ]);

        return redirect()->back();
    }
}
