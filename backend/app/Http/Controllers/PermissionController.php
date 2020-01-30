<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\PermissionRepositoryInterface;

class PermissionController extends Controller
{
    private $repository = null;

    public function __construct(PermissionRepositoryInterface $permissionRepository) {
        $this->repository = $permissionRepository;
    }

    public function getAllPermissions()
    {
        $allPermissions = null;
        if(request()->grouped == 1)
        {
            $allPermissions = $this->repository->allGrouped(false, 'group');
        }
        else 
        {
            $allPermissions = $this->repository->all(false);
        }
        return $allPermissions;
    }
}
