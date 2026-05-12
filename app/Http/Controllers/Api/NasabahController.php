<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Nasabah;
use App\Models\Instansi;
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
        $receivedToken = $request->header('X-Form-Token') ?? $request->header('X-Google-Form-Token');
        $expectedToken = config('services.google_form_token');

        if (!$receivedToken || $receivedToken !== $expectedToken) {
            Log::warning('Google Form Unauthorized: Token Mismatch');
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Bersihkan data dari spasi/karakter aneh
        $data = $request->all();
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $data[$key] = trim($value);
            }
        }

        $validator = Validator::make($data, [
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
            Log::error('Google Form Validation Error:', [
                'errors' => $validator->errors()->toArray(),
                'input_received' => $data
            ]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $nasabah = Nasabah::create($data);
            Log::info('Nasabah Created from Google Form: ' . $nasabah->nasabah_id);
            return response()->json([
                'message' => 'Nasabah created successfully',
                'data' => $nasabah
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error saving Nasabah: ' . $e->getMessage());
            return response()->json(['message' => 'Internal Server Error'], 500);
        }
    }
}
