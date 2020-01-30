<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\UserRepositoryInterface;

class UserController extends CommonController
{
    public function __construct(UserRepositoryInterface $userRepository) {
        parent::__construct($userRepository);
    }

    public function validateRequest($request, $id)
    {
        $passwordValidation = $id == null ? 'required|confirmed|min:3' : 'confirmed|nullable|min:3';

        $this->validate($request, [
            'name' => 'required|min:3|max:255',
            'userid' => 'required|unique:users,userid,' . $id,
            'email' => 'required|unique:users,email,' . $id,
            'mobile' => 'required|unique:users,mobile,' . $id,
            'password' => $passwordValidation,
        ]);
    }

    public function getLoggedinUserInformation()
    {
        return $this->repository->getUserInformation(\Auth::user()->id);
    }
}
