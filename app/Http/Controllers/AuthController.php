<?php

namespace App\Http\Controllers;

use App\Models\Friend;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $this->validate($request, ['login' => 'required',
            'password' => 'required']);
        if (auth()->attempt($request->only('login', 'password'))) {
            $token = auth()->user()->createToken('token')->plainTextToken;
            $user = User::find(auth()->user()->id);
            $user['posts'] = count(Post::where("author_id", $user->id)->get());
            $user['friends'] = count(Friend::where("user_id", $user->id)->orWhere("friend_id", $user->id)->get());
            return response()->json(['token' => $token, 'user' => $user], '200');
        } else {
            return response()->json('Unauthorized', 403);
        }
    }

    public function logout()
    {
        auth()->user()->tokens()->delete();
        return response()->json('Logout successfully', 200);
    }

    public function create(Request $request)
    {
        $check = [
            'name' => 'required',
            'login' => 'required|unique:users,login',
            'email' => 'required|email|unique:users,email',
            'password' => 'required',
            'password_repeat' => 'required|same:password',
            'photo' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'accept' => 'accepted',
        ];
        $this->validate($request, $check);
        $path = null;
        if (isset($request->photo)) {
            $imageName = time() . '.' . $request->photo->extension();
            $request->photo->storeAs('public/photo', $imageName);
            $path = asset('storage/photo/' . $imageName);
        }
        $user = User::create([
            'name' => $request->name,
            'login' => $request->login,
            'email' => $request->email,
            'category' => $request->category,
            'photo' => $path,
            'password' => bcrypt($request->password),
        ]);
        auth()->login($user);
        $token = auth()->user()->createToken('token')->plainTextToken;
        $user['posts'] = count(Post::where("author_id", $user->id)->get());
        $user['friends'] = count(Friend::where("user_id", $user->id)->orWhere("friend_id", $user->id)->get());
        return response()->json(['token' => $token, 'user' => $user], '200');
    }
}
