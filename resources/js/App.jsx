import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import HeaderAdmin from "./components/HeaderAdmin";

import Home from "./Page/Home";
import Message from "./Page/Message";
import Friends from "./Page/Friends";
import User from "./Page/User";
import UpdatePost from "./Page/UpdatePost";
import Categories from "./Page/Admin/Categories";
import Items from "./Page/Admin/Items";
import Users from "./Page/Admin/Users";
import AuthModal from "./components/AuthModal";

export const UserContext = React.createContext();
export const PostContext = React.createContext();

export default function App() {
    const [token, setToken] = React.useState(sessionStorage.getItem("token"));
    const [user, setUser] = React.useState(
        JSON.parse(sessionStorage.getItem("user"))
    );
    const [posts, setPosts] = React.useState([]);
    const [post, setPost] = React.useState(-1);
    const [modal, setModal] = React.useState(0);
    React.useEffect(() => {
        setToken(sessionStorage.getItem("token"));
        setUser(JSON.parse(sessionStorage.getItem("user")));
    }, []);
    React.useEffect(() => {
        console.log(token);
        sessionStorage.setItem("token", token);
    }, [token]);
    React.useEffect(() => {
        console.log(user);
        sessionStorage.setItem("user", JSON.stringify(user));
    }, [user]);
    return (
        <UserContext.Provider value={{ token, setToken, user, setUser }}>
            <PostContext.Provider value={{ post, setPost }}>
                <Routes>
                    <Route
                        path="*"
                        element={<Header setModal={setModal} setPosts={setPosts} />}
                    />
                    <Route path="admin/*" element={<HeaderAdmin />} />
                </Routes>
                <Routes>
                    <Route
                        path="/"
                        element={<Home posts={posts} setPosts={setPosts} />}
                    />
                    <Route path="message" element={<Message />} />
                    <Route path="friends" element={<Friends />} />
                    
                        <Route path="user" element={<User modal={modal} setModal={setModal} />}/>
                        <Route path="update" element={<UpdatePost />} />
                    
                    <Route path="admin/categories" element={<Categories />} />
                    <Route path="admin/items" element={<Items />} />
                    <Route path="admin/users" element={<Users />} />
                </Routes>
                <AuthModal modal={modal} setModal={setModal} />
            </PostContext.Provider>
        </UserContext.Provider>
    );
}
