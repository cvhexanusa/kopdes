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
        Schema::create('instansis', function (Blueprint $table) {
            $table->uuid('instansi_id')->primary();
            $table->string('nama');
            $table->string('desa');
            $table->string('kecamatan');
            $table->string('kabupaten');
            $table->string('kode_pos');
            $table->timestamp('waktu_aktif')->nullable();
            $table->uuid('users_id');
            $table->foreign('users_id')->references('users_id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('instansis');
    }
};
