<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    public function permissions()
    {
        return $this->belongsToMany('App\Permission', 'perm_role', 'role_id', 'perm_id');
    }
}
