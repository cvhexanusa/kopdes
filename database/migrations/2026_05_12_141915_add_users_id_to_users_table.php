<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->uuid('users_id')->nullable()->after('id');
        });

        // Populate existing users
        $users = DB::table('users')->get();
        foreach ($users as $user) {
            DB::table('users')
                ->where('id', $user->id)
                ->update(['users_id' => (string) Str::uuid()]);
        }

        Schema::table('users', function (Blueprint $table) {
            $table->uuid('users_id')->nullable(false)->change();
            $table->unique('users_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('users_id');
        });
    }
};
