<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Nasabah;
use App\Models\Instansi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

        // Bersihkan data teks
        $data = $request->all();
        foreach ($data as $key => $value) {
            if (is_string($value) && !Str::startsWith($value, 'data:image')) {
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
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Handle File Upload dari Google Apps Script (Base64)
        if ($request->has('foto_ktp_base64')) {
            $data['foto_ktp'] = $this->uploadBase64($request->foto_ktp_base64, 'ktp');
        }
        if ($request->has('foto_kk_base64')) {
            $data['foto_kk'] = $this->uploadBase64($request->foto_kk_base64, 'kk');
        }

        try {
            $nasabah = Nasabah::create($data);
            Log::info('Nasabah Created with Files: ' . $nasabah->nasabah_id);
            return response()->json([
                'message' => 'Nasabah created successfully',
                'data' => $nasabah
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error saving Nasabah: ' . $e->getMessage());
            return response()->json(['message' => 'Internal Server Error'], 500);
        }
    }

    /**
     * Helper to upload base64 image
     */
    private function uploadBase64($base64Data, $prefix)
    {
        try {
            if (empty($base64Data)) return null;
            
            // Format: data:image/jpeg;base64,xxxx
            $image_service_str = explode(',', $base64Data);
            if (count($image_service_str) < 2) return null;
            
            $image = base64_decode($image_service_str[1]);
            $filename = $prefix . '_' . time() . '_' . Str::random(10) . '.jpg';
            
            Storage::disk('public')->put('nasabah/' . $filename, $image);
            
            return 'nasabah/' . $filename;
        } catch (\Exception $e) {
            Log::error('Base64 Upload Error: ' . $e->getMessage());
            return null;
        }
    }
}
