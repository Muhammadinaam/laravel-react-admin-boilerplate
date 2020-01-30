<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('userid')->unique();
            $table->string('email')->unique();
            $table->string('mobile')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('mobile_verified_at')->nullable();
            $table->string('password');
            $table->enum('user_type', [\App\User::USER_TYPE_SITE, \App\User::USER_TYPE_ADMIN]);
            $table->boolean('is_super_admin')->default(false);
            $table->integer('role_id')->nullable();
            $table->rememberToken();
            
            CommonMigrations::five($table);
        });

        \DB::table('users')
            ->insert([
                [
                    'name' => 'Admin',
                    'userid' => 'admin',
                    'email' => 'admin@admin.com ',
                    'mobile' => '03000000000',
                    'password' => Hash::make('admin'),
                    'user_type' => \App\User::USER_TYPE_ADMIN,
                    'is_super_admin' => true,
                    'status' => true,
                ],
                [
                    'name' => 'Admin2',
                    'userid' => 'admin2',
                    'email' => 'admin2@admin.com ',
                    'mobile' => '03010000000',
                    'password' => Hash::make('admin2'),
                    'user_type' => \App\User::USER_TYPE_ADMIN,
                    'is_super_admin' => true,
                    'status' => true,
                ],

            ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
