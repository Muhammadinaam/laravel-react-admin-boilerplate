<?php

namespace App\Repositories;

interface RepositoryInterface
{
    public function all(bool $withRelations);

    public function find($id, bool $withRelations);

    public function create(array $data);

    public function update(array $data, $id);

    public function searchAndPaginate(array $dataData, bool $withRelations);
}