<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Concerns\HasTeams;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

use Illuminate\Support\Str;

#[Fillable(['users_id', 'name', 'email', 'password', 'current_team_id', 'peran', 'instansi_id'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasTeams, Notifiable, TwoFactorAuthenticatable;

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->users_id)) {
                $model->users_id = (string) Str::uuid();
            }
        });
    }

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
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
}
