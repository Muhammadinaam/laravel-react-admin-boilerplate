<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\RepositoryInterface;

class CommonController extends Controller
{
    protected $repository;

    public function __construct(RepositoryInterface $repository) {
        $this->repository = $repository;
    }

    public function index(Request $request)
    {
        if(request()->has('load_all') && request()->load_all == 1) {
            return $this->repository->all(true);
        }
        return $this->repository->searchAndPaginate($request->all(), true);
    }

    public function edit($id)
    {
        return $this->repository->find($id, true);
    }

    public function store(Request $request)
    {
        $this->validateRequest($request, null);
        return $this->repository->create($request->all());
    }

    public function update(Request $request, $id)
    {
        $this->validateRequest($request, $id);
        return $this->repository->update($request->all(), $id);
    }

    public function validateRequest($request, $id)
    {
        
    }

    public function destroy($id)
    {
        return $this->repository->delete($id);
    }
}
