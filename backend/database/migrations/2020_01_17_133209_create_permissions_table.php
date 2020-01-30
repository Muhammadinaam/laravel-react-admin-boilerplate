<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePermissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('perms', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->string('group');
            $table->string('idt');
            $table->string('parent_idt')->nullable();
            $table->string('name');
            $table->string('order')->nullable();

            CommonMigrations::five($table);
        });

        CommonMigrations::insertEntityPermissions('Users Management', 'user', 'users', 'Users', 'User');
        CommonMigrations::insertEntityPermissions('Roles Management', 'role', 'roles', 'Roles', 'Role');
        CommonMigrations::insertEntityPermissions('Profiles Management', 'profile', 'profiles', 'Profiles', 'Profile');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('perms');
    }
}
