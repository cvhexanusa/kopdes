<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('nasabahs', function (Blueprint $table) {
            $table->dropUnique(['nik']);
        });

        Schema::table('nasabahs', function (Blueprint $table) {
            $table->text('nik')->change();
            $table->text('tempat_lahir')->change();
            $table->text('tanggal_lahir')->change();
            $table->text('no_handphone')->change();
            $table->text('foto_ktp')->nullable()->change();
            $table->text('foto_kk')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nasabahs', function (Blueprint $table) {
            $table->string('nik', 255)->change();
            $table->string('tempat_lahir', 255)->change();
            $table->date('tanggal_lahir')->change();
            $table->string('no_handphone', 255)->change();
            $table->string('foto_ktp', 255)->nullable()->change();
            $table->string('foto_kk', 255)->nullable()->change();
        });

        Schema::table('nasabahs', function (Blueprint $table) {
            $table->unique('nik');
        });
    }
};
