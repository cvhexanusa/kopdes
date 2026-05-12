<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Nasabah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NasabahController extends Controller
{
    /**
     * Store a newly created nasabah from external source (e.g. Google Forms).
     */
    public function store(Request $request)
    {
        $token = $request->header('X-Google-Form-Token');
        
        if (!$token || $token !== env('GOOGLE_FORM_TOKEN')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'nik' => 'required|string|unique:nasabahs,nik',
            'domisili' => 'required|string',
            'tempat_lahir' => 'required|string',
            'tanggal_lahir' => 'required|date',
            'no_handphone' => 'required|string',
            'pekerjaan' => 'required|string',
            'instansi_id' => 'required|exists:instansis,instansi_id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $nasabah = Nasabah::create($request->all());

        return response()->json([
            'message' => 'Nasabah created successfully',
            'data' => $nasabah
        ], 201);
    }
}
