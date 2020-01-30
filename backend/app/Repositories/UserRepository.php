<?php

namespace App\Repositories;
use Illuminate\Support\Facades\Hash;

class UserRepository extends AbstractRepository implements UserRepositoryInterface
{
    public function __construct() {
        parent::__construct(new \App\User, ['role'], ['name'], ['singular' => 'user', 'plural' => 'users']);
    }

    protected function saveData(array $data, $id)
    {
        if($data['password'] != '')
        {
            $data['password'] = Hash::make($data['password']);
        } 
        else 
        {
            unset($data['password']);
        }

        return parent::saveData($data, $id);
    }

    public function getUserInformation($id)
    {
        return $this->model->with(['role.permissions'])->whereId($id)->first();
    }
}