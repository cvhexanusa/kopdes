<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['instansi_id', 'nama', 'desa', 'kecamatan', 'kabupaten', 'kode_pos', 'waktu_aktif', 'users_id'])]
class Instansi extends Model
{
    use HasUuids;

    protected $primaryKey = 'instansi_id';
    public $incrementing = false;
    protected $keyType = 'string';

    public function user()
    {
        return $this->belongsTo(User::class, 'users_id', 'users_id');
    }

    public function nasabahs()
    {
        return $this->hasMany(Nasabah::class, 'instansi_id', 'instansi_id');
    }
}
