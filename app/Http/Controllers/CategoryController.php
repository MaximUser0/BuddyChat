<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(){
        $categories = Category::select('id', 'title')->get();
        return response()->json($categories);
    }

    public function store(Request $request){
        $this->validate($request,['title' => 'required']);
        $category = Category::create($request->only(['title']));
        return response()->json('Created category: ' . $request->title);
    }

    public function update(Request $request, $id){
        $this->validate($request,['title'=> 'required']);
        $category = Category::findOrFail($id);
        $category->update($request->only(['title']));
        return response()->json('Category updated on: '. $request->title);
    }

    public function destroy($id){
        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json('Deleted successfully');
    }

}
