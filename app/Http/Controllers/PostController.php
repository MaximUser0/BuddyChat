<?php

namespace App\Http\Controllers;

use App\Models\Friend;
use App\Models\Post;
use App\Models\PostImg;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index()
    {
        $categories = explode('|', auth()->user()->category);
        $posts = Post::whereIn('category_id', $categories)
            ->leftJoin('post_imgs', 'posts.id', '=', 'post_imgs.post_id')
            ->join('users', 'posts.author_id', '=', 'users.id')
            ->join('categories', 'posts.category_id', '=', 'categories.id')
            ->select('description', 'posts.created_at', 'login', 'posts.author_id AS user_id', 'photo', 'path', 'categories.title', 'category_id', 'posts.id AS post_id')
            ->get();
        if (count($posts) == 0) {
            return response()->json('Not found', 204);
        }
        $data = [];
        $last_id = 0;
        foreach ($posts as $post) {
            if ($post->post_id != $last_id) {
                if ($post->path != null) {
                    $post->path = [$post->path];
                }
                $ids = [auth()->user()->id, $post->user_id];
                $check = Friend::whereIn("user_id", $ids)->whereIn("friend_id", $ids)->first();
                if (!$check) {
                    $post->friend = auth()->user()->id == $post->user_id ? 3 : 0;
                } else {
                    $post->friend = auth()->user()->id == $post->user_id ? 3 : ($check->status == 0 ? 1 : 2);
                }
                $data[] = $post;
                $last_id = $post->post_id;
            } else {
                $imgs = $data[count($data) - 1]->path;
                $imgs[] = $post->path;
                $data[count($data) - 1]->path = $imgs;
            }
        }

        return response()->json($data);
    }
    public function indexMy()
    {
        $categories = explode('|', auth()->user()->category);
        $posts = Post::whereIn('category_id', $categories)
            ->where('author_id', auth()->user()->id)
            ->leftJoin('post_imgs', 'posts.id', '=', 'post_imgs.post_id')
            ->join('users', 'posts.author_id', '=', 'users.id')
            ->join('categories', 'posts.category_id', '=', 'categories.id')
            ->select('description', 'posts.created_at', 'login', 'posts.id', 'users.id AS user_id', 'photo', 'path', 'categories.title', 'category_id', 'posts.id AS post_id')
            ->get();
        if (count($posts) == 0) {
            return response()->json('Not found', 204);
        }
        $data = [];
        $last_id = 0;
        foreach ($posts as $post) {
            if ($post->post_id != $last_id) {
                if ($post->path != null) {
                    $post->path = [$post->path];
                }
                $post->friend = 3;
                $data[] = $post;
                $last_id = $post->post_id;
            } else {
                $imgs = $data[count($data) - 1]->path;
                $imgs[] = $post->path;
                $data[count($data) - 1]->path = $imgs;
            }
        }

        return response()->json($data);
    }
    public function indexAll()
    {
        $posts = Post::leftJoin('post_imgs', 'posts.id', '=', 'post_imgs.post_id')
            ->join('users', 'posts.author_id', '=', 'users.id')
            ->join('categories', 'posts.category_id', '=', 'categories.id')
            ->select('description', 'posts.created_at', 'login', 'users.id AS user_id', 'photo', 'path', 'categories.title', 'category_id', 'posts.id AS post_id')
            ->get();
        $data = [];
        $last_id = -1;
        foreach ($posts as $post) {
            if ($post->post_id != $last_id) {
                if ($post->path != null) {
                    $post->path = [$post->path];
                }
                $post->friend = 3;
                $data[] = $post;
                $last_id = $post->post_id;
            } else {
                $imgs = $data[count($data) - 1]->path;
                $imgs[] = $post->path;
                $data[count($data) - 1]->path = $imgs;
            }
        }

        return response()->json($data);
    }

    public function show($id){
        $posts = Post::where('posts.id', $id)
        ->leftJoin('post_imgs', 'posts.id', '=', 'post_imgs.post_id')
        ->join('categories', 'posts.category_id', '=', 'categories.id')
        ->select('description', 'path', 'categories.title', 'category_id', 'posts.id AS post_id', 'author_id', 'post_imgs.id AS img_id')
        ->get();
        if($posts[0]->author_id!=auth()->user()->id){
            return response()->json('Forbidden for you', 403);
        }
        $data = [];
        foreach ($posts as $key => $post) {
            if ($key==0) {
                if ($post->path != null) {
                    $post->path = [["img"=>$post->path, 'id' => $post->img_id ]];
                }
                $data[] = $post;
            } else {
                $imgs = $data[count($data) - 1]->path;
                $imgs[] = ["img"=>$post->path, 'id' => $post->img_id ];
                $data[count($data) - 1]->path = $imgs;
            }
        }
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $check = [
            'description' => 'required',
            'category_id' => 'required|exists:categories,id',
        ];
        $haveFiles = count($_FILES) > 0;
        if ($haveFiles) {
            foreach ($_FILES as $key => $value) {
                $check[] = ['img' . $key => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048'];
            }
        }
        $form = $this->validate($request, $check);
        $form['author_id'] = auth()->user()->id;
        $post = Post::create($form);

        if ($haveFiles) {
            foreach ($_FILES as $key => $value) {
                $imageName = $key . time() . '.' . $request[$key]->extension();
                $request[$key]->storeAs('public/posts', $imageName);
                PostImg::create([
                    'path' => asset('storage/posts/' . $imageName),
                    'post_id' => $post->id,
                ]);
            }
        }
        return response()->json($post, 201);
    }

    public function update(Request $request, $id)
    {
        $check = [
            'description' => 'required',
            'category_id' => 'required|exists:categories,id',
        ];
        $haveFiles = count($_FILES) > 0;
        if ($haveFiles) {
            foreach ($_FILES as $key => $value) {
                $check[] = ['img' . $key => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048'];
            }
        }
        $form = $this->validate($request, $check);
        $post = Post::findOrFail($id);
        $post = $post->update($form);

        if ($haveFiles) {
            foreach ($_FILES as $key => $value) {
                $imageName = $key . time() . '.' . $request[$key]->extension();
                $request[$key]->storeAs('public/posts', $imageName);
                PostImg::create([
                    'path' => asset('storage/posts/' . $imageName),
                    'post_id' => $id,
                ]);
            }
        }
        return response()->json('Updated successfully');
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        if ($post->author_id != auth()->user()->id) {
            return response()->json('Forbidden for you', 403);
        }
        $imgs = PostImg::where('post_id', $post->id)->get();
        foreach ($imgs as $img) {
            Storage::disk('public')->delete(explode("storage/", $img->path)[1]);
        }
        $post->delete();
        return response()->json('Deleted successfully');
    }

    public function destroyImage($id)
    {
        $img = PostImg::findOrFail($id);
        $post = Post::findOrFail($img->post_id);
        if ($post->author_id == auth()->user()->id) {
            Storage::disk('public')->delete(explode("storage/", $img->path)[1]);
            $img->delete();
            return response()->json('Deleted successfully');
        }
        return response()->json('Forbidden for you', 403);
    }

}
