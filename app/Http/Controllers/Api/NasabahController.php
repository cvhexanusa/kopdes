<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Nasabah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class NasabahController extends Controller
{
    /**
     * Store a newly created nasabah from external source (e.g. Google Forms).
     */
    public function store(Request $request)
    {
        // Mendukung X-Form-Token atau X-Google-Form-Token untuk fleksibilitas
        $receivedToken = $request->header('X-Form-Token') ?? $request->header('X-Google-Form-Token');
        $expectedToken = config('services.google_form_token');

        Log::info('Google Form API Access:', [
            'has_token' => !empty($receivedToken),
            'token_match' => ($receivedToken === $expectedToken),
            'received' => $receivedToken,
            'expected' => $expectedToken
        ]);
        
        if (!$receivedToken || $receivedToken !== $expectedToken) {
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
            Log::error('Google Form Validation Error:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $nasabah = Nasabah::create($request->all());
            Log::info('Nasabah Created: ' . $nasabah->nasabah_id);
            return response()->json([
                'message' => 'Nasabah created successfully',
                'data' => $nasabah
            ], 201);
        } catch (\Exception $e) {
            Log::error('Database Error: ' . $e->getMessage());
            return response()->json(['message' => 'Internal Server Error'], 500);
        }
    }
}
