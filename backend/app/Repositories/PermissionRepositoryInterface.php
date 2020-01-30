<?php

namespace App\Repositories;

interface PermissionRepositoryInterface extends RepositoryInterface
{
    public function allGrouped(bool $withRelations, $groupBy);

    public function getPermissionByIdt($idt);

    public function getPermissionsByIdts(array $idts);
}