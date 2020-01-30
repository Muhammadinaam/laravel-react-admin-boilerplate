<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\RoleRepositoryInterface;

class RoleController extends CommonController
{
    public function __construct(RoleRepositoryInterface $roleRepository) {
        parent::__construct($roleRepository);
    }

    public function validateRequest($request, $id)
    {
        $this->validate($request, [
            'name' => 'required|min:3|max:255|unique:roles,name,' . $id,
            'level' => 'required|numeric',
        ]);
    }
}
