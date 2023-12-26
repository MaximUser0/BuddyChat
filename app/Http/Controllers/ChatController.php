<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\Friend;
use App\Models\User;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index()
    {
        $id = auth()->user()->id;
        $data = [];
        $chats = Chat::where("user_id", $id)
            ->orWhere("user2_id", $id)
            ->join("users", "chats.user_id", "=", "users.id")
            ->select('login', 'users.id', 'chats.id AS chat_id', 'photo')
            ->get();
        foreach ($chats as $value) {
            if ($value->id != $id) {
                $data[] = $value;
            }
        }
        $chats2 = Chat::where("user_id", $id)
            ->orWhere("user2_id", $id)
            ->join("users", "chats.user2_id", "=", "users.id")
            ->select('login', 'users.id', 'chats.id AS chat_id', 'photo')
            ->get();
        foreach ($chats2 as $value) {
            if ($value->id != $id) {
                $data[] = $value;
            }
        }
        return response()->json($data);
    }

    public function indexCall(Request $request, $id){
        $chat = Chat::findOrFail($id);
        $user_id = auth()->user()->id;
        if ($user_id != $chat->user_id && $user_id != $chat->user2_id) {
            return response()->json("Forbidden for you", 403);
        }
        if($request->updated_at != $chat->updated_at){
            return $this->show($id);
        } else {
            return response()->json('ok', 200);
        }
    }

    public function store(Request $request)
    {
        $id = auth()->user()->id;
        $this->validate(request(), [
            "user_id" => "required|exists:users,id",
        ]);
        if ($request->user_id == $id) {
            return response()->json("Forbidden for you", 403);
        }
        $ids = [$id, $request->user_id];
        $check = Chat::whereIn("user_id", $ids)->whereIn("user2_id", $ids)->first();
        if ($check) {
            return response()->json("The chat already exists", 403);
        }
        Chat::create([
            "user_id" => $id,
            "user2_id" => $request->user_id,
            "content" => json_encode([])
        ]);
        return response()->json("Created successfully", 200);
    }

    public function show($id)
    {
        $chat = Chat::findOrFail($id);
        $user_id = auth()->user()->id;
        $user = User::findOrFail($user_id == $chat->user_id ? $chat->user2_id : $chat->user_id);
        if ($user_id != $chat->user_id && $user_id != $chat->user2_id) {
            return response()->json("Forbidden for you", 403);
        }
        if ($chat->content != "[]") {
            $author = $chat->user_id == $user_id ? 0 : 1;
            $content = json_decode($chat->content, true);
            for ($i = count($content) - 1; $i >= 0; $i--) {
                if($content[$i]["author"] != $author){
                    $content[$i]["status"] = 1;
                }
            }
            $content = json_encode($content);
            if($content != json_encode(json_decode($chat->content))){
                $chat->content = $content;
                $chat->save();
            }
        }
        $chat['photo'] = $user->photo;
        $chat['login'] = $user->login;
        $chat['updated_at_check'] = (string) $chat->updated_at;
        return response($chat, 200);
    }

    public function sent(Request $request, $id)
    {
        $chat = Chat::findOrFail($id);
        $this->validate(request(), [
            "message" => "required",
        ]);
        $user_id = auth()->user()->id;
        if ($user_id != $chat->user_id && $user_id != $chat->user2_id) {
            return response()->json("Forbidden for you", 403);
        }
        $data = json_decode($chat->content);
        $data[] = [
            "author" => $chat->user_id == $user_id ? 0 : 1,
            "status" => 0,
            "message" => $request->message,
            "created_at" => date("Y-m-d H:i")
        ];
        $chat->content = json_encode($data);
        $chat->save();
        return response()->json("Sent successfully", 200);
    }

    public function destroyMessage($id, $message)
    {
        $chat = Chat::findOrFail($id);
        $user_id = auth()->user()->id;
        if ($user_id != $chat->user_id && $user_id != $chat->user2_id) {
            return response()->json("Forbidden for you", 403);
        }
        $data = json_decode($chat->content);
        $dataNew = [];
        foreach ($data as $key => $value) {
            if ($key != $message) {
                $dataNew[] = $value;
            }
        }
        $chat->content = json_encode($dataNew);
        $chat->save();
        return response()->json("Delete successfully", 200);
    }

    public function destroy($id)
    {
        //destroy chat
    }
}
