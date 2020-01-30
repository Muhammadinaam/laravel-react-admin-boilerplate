<?php

namespace App\Repositories;

class PermissionRepository extends AbstractRepository implements PermissionRepositoryInterface
{
    public function __construct() {
        parent::__construct(new \App\Permission, [], ['name'], ['singular' => 'permission', 'plural' => 'permissions']);
    }

    public function allGrouped(bool $withRelations, $groupBy)
    {
        $allPermissions = self::all($withRelations);
        $allPermissions = $allPermissions->groupBy($groupBy);
        return $allPermissions;
    }

    public function getPermissionByIdt($idt)
    {
        return $this->model->where('idt', $idt)->first();
    }

    public function getPermissionsByIdts(array $idts)
    {
        return $this->model->whereIn('idt', $idts)->get();
    }
}