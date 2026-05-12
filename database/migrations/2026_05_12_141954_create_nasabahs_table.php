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
        Schema::create('nasabahs', function (Blueprint $table) {
            $table->uuid('nasabah_id')->primary();
            $table->string('nama');
            $table->string('nik')->unique();
            $table->string('domisili');
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->string('no_handphone');
            $table->string('pekerjaan');
            $table->string('foto_ktp')->nullable();
            $table->string('foto_kk')->nullable();
            $table->uuid('instansi_id');
            $table->foreign('instansi_id')->references('instansi_id')->on('instansis')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nasabahs');
    }
};
