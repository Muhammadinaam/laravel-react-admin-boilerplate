<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    const USER_TYPE_SITE = 'Site User';
    const USER_TYPE_ADMIN = 'Admin User';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'userid', 'mobile', 'user_type', 'is_super_admin', 'role_id'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'mobile_verified_at' => 'datetime',
    ];

    public function findForPassport($identifier) {
        return $this->orWhere('email', $identifier)->orWhere('userid', $identifier)->first();
    }

    public function role()
    {
        return $this->belongsTo('\App\Role');
    }

    public function hasPermission($permissionIdt)
    {
        if( $this->is_super_admin == true || $this->is_super_admin == 1 )
        {
            return true;
        }

        $role = $this->role;
        if($role != null) 
        {
            $foundPermission = $role->permissions()->where('idt', $permissionIdt)->first();
            if($foundPermission == null)
            {
                return false;
            }
        }

        return false;
    }

    public function abortIfDontHavePermission($permissionIdt)
    {
        if( $this->hasPermission($permissionIdt) == false ) 
        {
            abort(403, 'No Permission');
        }
    }
}
