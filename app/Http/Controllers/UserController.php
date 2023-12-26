<?php

namespace App\Http\Controllers;

use App\Models\Friend;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    public function find(Request $request){
        $users = User::where("login", 'like', '%'.$request->text.'%')
        ->where('id', '!=', auth()->user()->id)
        ->select('id','login','photo')
        ->get();
        return response()->json($users);
    }

    /**
     * Display the specified resource.
     */
    public function showMe()
    {
        return response()->json(auth()->user());
    }

    public function show(string $id)
    {
        $user = User::find($id);
        if(!$user){
            return response()->json('Not found', 404);
        }
        return response()->json(["id" => $user->id, "name" => $user->name, "login" => $user->login]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $check = [
            'name' => 'required',
            'login' => 'required',
            'password' => 'required',
            'password_repeat' => 'required|same:password',
            'photo' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'accept' => 'accepted',
        ];
        $this->validate($request, $check);
        $user = auth()->user();
        $path = null;
        $update = [
            'name' => $request->name,
            'login' => $request->login,
            'password' => bcrypt($request->password),
        ];
        if(isset($request->photo)){
            $imageName = time() . '.' . $request->photo->extension();
            $request->photo->storeAs('public/photo', $imageName);
            $path = asset('storage/photo/' . $imageName);
            if($user->photo != null){
                Storage::disk('public')->delete(explode("storage/", $user->photo)[1]);
            }
            $update["photo"] = $path;
        }
        if(isset($request->category)){
            $update["category"] = $request->category;
        }
        
        $user->update($update);
        $user['posts'] = count(Post::where("author_id", $user->id)->get());
        $user['friends'] = count(Friend::where("user_id", $user->id)->orWhere("friend_id", $user->id)->get());
        return response()->json(['user' => $user], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy()
    {   
        $id = auth()->user()->id;
        auth()->user()->tokens()->delete();
        User::find($id)->delete();
        return response()->json("", 204);
    }
}
