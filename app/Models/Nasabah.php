<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['nasabah_id', 'nama', 'nik', 'domisili', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'no_handphone', 'pekerjaan', 'foto_ktp', 'foto_kk', 'instansi_id'])]
class Nasabah extends Model
{
    use HasUuids;

    protected $primaryKey = 'nasabah_id';
    public $incrementing = false;
    protected $keyType = 'string';

    public function instansi()
    {
        return $this->belongsTo(Instansi::class, 'instansi_id', 'instansi_id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'nik' => 'encrypted',
            'tempat_lahir' => 'encrypted',
            'tanggal_lahir' => 'encrypted',
            'jenis_kelamin' => 'encrypted',
            'no_handphone' => 'encrypted',
            'foto_ktp' => 'encrypted',
            'foto_kk' => 'encrypted',
        ];
    }
}
