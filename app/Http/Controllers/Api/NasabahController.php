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
            if (is_string($value) && !Str::startsWith($value, 'data:')) {
                $data[$key] = trim($value);
            }
        }

        // Normalisasi Jenis Kelamin (agar Laki-Laki, Laki-laki, laki-laki semua diterima)
        if (isset($data['jenis_kelamin'])) {
            $jk = strtolower($data['jenis_kelamin']);
            if (str_contains($jk, 'laki')) {
                $data['jenis_kelamin'] = 'Laki-laki';
            } elseif (str_contains($jk, 'perempuan') || str_contains($jk, 'wanita')) {
                $data['jenis_kelamin'] = 'Perempuan';
            }
        }

        $validator = Validator::make($data, [
            'nama' => 'required|string|max:255',
            'nik' => 'required|string|unique:nasabahs,nik',
            'domisili' => 'required|string',
            'tempat_lahir' => 'required|string',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|string|in:Laki-laki,Perempuan',
            'no_handphone' => 'required|string',
            'pekerjaan' => 'required|string',
            'instansi_id' => 'required|exists:instansis,instansi_id',
        ]);

        if ($validator->fails()) {
            Log::warning('Validation failed for Nasabah API', [
                'errors' => $validator->errors()->toArray(), 
                'received_values' => $data // Log nilai yang diterima untuk debug
            ]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Handle File Upload dari Google Apps Script (Base64)
        if ($request->has('foto_ktp_base64')) {
            Log::info('Processing foto_ktp_base64');
            $data['foto_ktp'] = $this->uploadBase64($request->foto_ktp_base64, 'ktp');
        }
        if ($request->has('foto_kk_base64')) {
            Log::info('Processing foto_kk_base64');
            $data['foto_kk'] = $this->uploadBase64($request->foto_kk_base64, 'kk');
        }

        try {
            $nasabah = Nasabah::create($data);
            Log::info('Nasabah Created Successfully: ' . $nasabah->nasabah_id . ' | Foto KTP: ' . ($nasabah->foto_ktp ?? 'null') . ' | Foto KK: ' . ($nasabah->foto_kk ?? 'null'));
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
            if (empty($base64Data)) {
                Log::warning("Base64 upload failed: data is empty for $prefix");
                return null;
            }
            
            // Format: data:image/jpeg;base64,xxxx
            if (Str::startsWith($base64Data, 'data:')) {
                $image_service_str = explode(',', $base64Data);
                if (count($image_service_str) < 2) {
                    Log::warning("Base64 upload failed: comma separator not found for $prefix");
                    return null;
                }
                $base64String = $image_service_str[1];
            } else {
                // If direct base64 string without data: prefix
                $base64String = $base64Data;
            }
            
            $image = base64_decode($base64String);
            if (!$image) {
                Log::warning("Base64 upload failed: base64_decode failed for $prefix");
                return null;
            }

            $filename = $prefix . '_' . time() . '_' . Str::random(10) . '.jpg';
            
            $path = 'nasabah/' . $filename;
            Storage::disk('public')->put($path, $image);
            
            Log::info("Base64 upload success: $path saved");
            return $path;
        } catch (\Exception $e) {
            Log::error('Base64 Upload Exception: ' . $e->getMessage());
            return null;
        }
    }
}
