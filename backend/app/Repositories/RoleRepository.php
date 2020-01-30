<?php

namespace App\Repositories;
use App\Repositories\PermissionRepositoryInterface;

class RoleRepository extends AbstractRepository implements RoleRepositoryInterface
{
    private $permissionRepository;

    public function __construct(PermissionRepositoryInterface $permissionRepository) {
        parent::__construct(new \App\Role, ['permissions'], ['name'], ['singular' => 'role', 'plural' => 'roles']);
        $this->permissionRepository = $permissionRepository;
    }

    protected function storeData(array $data)
    {
        $model = $this->model;
        return $this->storeAndUpdateCommonCode($model, $data);
    }

    protected function updateData(array $data, $id)
    {
        $model = $this->model->find($id);
        return $this->storeAndUpdateCommonCode($model, $data);
    }

    private function storeAndUpdateCommonCode($model, $data)
    {
        $model->name = $data['name'];
        $model->level = $data['level'];
        $model->save();

        $allowedPermissionIdts = [];
        if(isset($data['permissions']))
        {
            foreach($data['permissions'] as $permissionIdt => $allowed) 
            {
                if($allowed == true)
                {
                    $allowedPermissionIdts[] = $permissionIdt;
                }
            }
        }

        if(count($allowedPermissionIdts) > 0)
        {
            $allowedPermissions = $this->permissionRepository->getPermissionsByIdts($allowedPermissionIdts);
            
            $parentPermissionsIdts = $allowedPermissions->pluck('parent_idt')->toArray();
            $parentPermissions = $this->permissionRepository->getPermissionsByIdts($parentPermissionsIdts);


            $allowedPermissionIds = $allowedPermissions->pluck('id');
            $parentPermissionIds = $parentPermissions->pluck('id');
            $model->permissions()->sync( array_merge($allowedPermissionIds->toArray(), $parentPermissionIds->toArray()) );
        }

        return $model;
    }
}