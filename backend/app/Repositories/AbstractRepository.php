<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

abstract class AbstractRepository implements RepositoryInterface
{
    protected $model;
    protected $relations = [];
    protected $searchableFields = [];
    protected $permissionIdts = [
        'singular' => '',
        'plural' => '',
    ];

    public function __construct(Model $model, $relations, $searchableFields, $permissionIdts)
    {
        $this->model = $model;
        $this->relations = $relations;
        $this->searchableFields = $searchableFields;
        $this->permissionIdts = $permissionIdts;
    }

    public function find($id, bool $withRelations)
    {
        $model = $this->model;
        if($withRelations)
        {
            $model = $model->with($this->relations);
        }
        return $model->findOrFail($id);
    }

    public function create(array $data)
    {
        \Auth::user()->abortIfDontHavePermission('add_' . $this->permissionIdts['singular']);

        try {
            DB::beginTransaction();

            $this->beforeStore();
            $model = $this->saveData($data, null);
            $this->afterStore($model);

            DB::commit();

            return [
                'success' => true,
                'message' => 'Saved Successfully',
                'id' => $model->id
            ];

        } catch (\Exception $ex) {
            DB::rollback();
            return [
                'success' => false,
                'message' => 'Not saved, error ' . $ex->getMessage(),
                'ex' => $ex->getTraceAsString()
            ];
        }
    }

    public function update(array $data, $id)
    {
        \Auth::user()->abortIfDontHavePermission('edit_' . $this->permissionIdts['singular']);

        try {
            DB::beginTransaction();

            $this->beforeUpdate();
            $model = $this->saveData($data, $id);
            $this->afterUpdate($model);

            DB::commit();

            return [
                'success' => true,
                'message' => 'Saved Successfully',
                'id' => $model->id
            ];

        } catch (\Exception $ex) {
            DB::rollback();
            return [
                'success' => false,
                'message' => 'Not saved, error ' . $ex->getMessage(),
                'ex' => $ex->getTraceAsString()
            ];
        }
    }

    protected function saveData(array $data, $id)
    {
        $model = null;
        if($id == null)
        {
            $model = $this->storeData($data);
        }
        else
        {
            $model = $this->updateData($data, $id);
        }

        return $model;
    }

    protected function storeData(array $data)
    {
        $model = $this->model->create($data);
        return $model;
    }

    protected function updateData(array $data, $id)
    {
        $model = $this->model->find($id);
        $model->update($data);
        return $model;
    }

    protected function beforeStore() 
    {

    }

    protected function afterStore() 
    {

    }

    protected function beforeUpdate() 
    {

    }

    protected function afterUpdate() 
    {

    }

    public function all(bool $withRelations)
    {
        $model = $this->model;
        if($withRelations)
        {
            $model = $model->with($this->relations);
        }
        return $model->get();
    }

    public function searchAndPaginate(array $data, bool $withRelations)
    {
        \Auth::user()->abortIfDontHavePermission($this->permissionIdts['plural'] . '_list');

        $quickSearch = isset($data['quick_search']) ? $data['quick_search'] : '';
        
        $model = $this->model;

        if($withRelations)
        {
            $model = $model->with($this->relations);
        }

        if($quickSearch != '')
        {
            foreach($this->searchableFields as $searchableField)
            {
                if (strpos($searchableField, '.') !== false) {
                    throw new \Exception("Searching in relations is not implemented", 1);
                }
    
                $model = $model->orWhere($searchableField, 'like', '%'.$quickSearch.'%');
            }
        }

        return $model->paginate(10);
    }

    public function delete($id)
    {
        \Auth::user()->abortIfDontHavePermission('delete_' . $this->permissionIdts['singular']);

        $this->model::find($id)->delete();
        return [
            'success' => true,
            'message' => 'Deleted Successfully',
        ];
    }
}