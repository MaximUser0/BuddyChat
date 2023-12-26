<?php

namespace App\Http\Controllers;

use App\Models\Friend;
use Illuminate\Http\Request;

class FriendController extends Controller
{
    public function index(){
        $id = auth()->user()->id;
        $data = [];
        $friends = Friend::where("user_id", $id)
        ->orWhere("friend_id", $id)
        ->join("users","friends.user_id","=","users.id")
        ->select('login', 'users.id', 'photo', 'friends.status', 'friends.id AS friend_id')
        ->get();
        foreach ($friends as $value) {
            if($value->id != $id && $value->status == 1){
                $data[] = $value;
            } 
        }
        $friends2 = Friend::where("user_id", $id)
        ->orWhere("friend_id", $id)
        ->join("users","friends.friend_id","=","users.id")
        ->select('login', 'users.id', 'photo', 'friends.status', 'friends.id AS friend_id')
        ->get();
        foreach ($friends2 as $value) {
            if($value->id != $id && $value->status == 1){
                $data[] = $value;
            } 
        }
        return response()->json($data);
    }
    public function indexRequest(){
        $id = auth()->user()->id;
        $data = [];
        $friends = Friend::where("user_id", $id)
        ->orWhere("friend_id", $id)
        ->join("users","friends.user_id","=","users.id")
        ->select('login', 'users.id', 'friends.id AS friend_id', 'friends.user_id AS user_id', 'photo', 'friends.status')
        ->get();
        foreach ($friends as $value) {
            if($value->id != $id && $value->status == 0){
                $value['owner'] = $value->user_id==$id;
                $data[] = $value;
            } 
        }
        $friends2 = Friend::where("user_id", $id)
        ->orWhere("friend_id", $id)
        ->join("users","friends.friend_id","=","users.id")
        ->select('login', 'users.id', 'friends.id AS friend_id', 'friends.user_id AS user_id', 'photo', 'friends.status')
        ->get();
        foreach ($friends2 as $value) {
            if($value->id != $id && $value->status == 0){
                $value['owner'] = $value->user_id!=$id;
                $data[] = $value;
            } 
        }
        return response()->json($data);
    }

    public function store(Request $request){
        $id = auth()->user()->id;
        $this->validate(request(), [
            "user_id"=> "required|exists:users,id",
        ]);
        if($request->user_id == $id){
            return response()->json("Forbidden for you", 403);
        }
        $ids = [$id, $request->user_id];
        $check = Friend::whereIn("user_id", $ids)->whereIn("friend_id", $ids)->first();
        if($check){
            return response()->json("The friendship request already exists", 403);
        }
        Friend::create([
            "user_id"=> $id,
            "friend_id" => $request->user_id,
        ]);
        return response()->json("Created successfully", 200);
    }

    public function update($id){
        $friend = Friend::findOrFail($id);
        if($friend->friend_id != auth()->user()->id){
            return response()->json("Forbidden for you", 403);
        }
        $friend->status = 1;
        $friend->save();
        return response()->json("Updated successfully", 200);
    }

    public function destroy($id){
        $user_id = auth()->user()->id;
        $friend = Friend::findOrFail($id);
        if($friend->friend_id != $user_id && $friend->user_id != $user_id){
            return response()->json("Forbidden for you", 403);
        }
        $friend->delete();
        return response()->json('', 204);
    }
}
