import React from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../app";

export default function Header({ setModal, setPosts }) {
    const { token, user, setToken, setUser } = React.useContext(UserContext);
    const [windowToggle, setWindowToggle] = React.useState(false);
    const [contentToggle, setContentToggle] = React.useState(false);
    function AllPosts() {
        fetch("http://127.0.0.1:8000/api/posts", {
            headers: {
                Accept: "application/json",
            },
        })
            .then((response) => response.json())
            .then((json) => {
                setPosts(json);
            });
    }
    function CategoryPosts() {
        if (token != "null") {
            fetch("http://127.0.0.1:8000/api/post", {
                headers: {
                    Authorization: "Bearer " + token,
                    Accept: "application/json",
                },
            })
                .then((response) => {
                    if(!response.ok){
                        setToken("null")
                        setUser(null)
                        setModal(1)
                        return []
                    }
                    return response.json();
                })
                .then((json) => {
                    setPosts(json);
                });
        }
    }
    return (
        <header>
            <nav>
                <div className="nav1">
                    <li>
                        <Link to={"/"}>
                            <img className="logo" src="img/лого.png" alt="" />
                        </Link>
                    </li>
                </div>
                <div className="categs">
                    <button className="hiden" style={{ display: "none" }} onClick={()=>{
                        if(contentToggle){
                            CategoryPosts()
                        } else {
                            AllPosts()
                        }
                        setContentToggle(!contentToggle);
                    }}>
                        {contentToggle?"Все посты":"По категориям"}
                    </button>
                    <div className="over hiddenmobile">
                        <button onClick={() => AllPosts()}>Все посты</button>
                        <button onClick={() => CategoryPosts()}>
                            Посты по категориям
                        </button>
                    </div>
                </div>
                <div className="nav2" id="nav-list">
                    <li>
                        <Link to={token != "null" ? "message" : "/"}>
                            <button className="uni mess">
                                <img src="img/icons8-чат-96.png" alt="" />
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to={token != "null" ? "friends" : "/"}>
                            <button className="uni frien">
                                <img
                                    src="img/icons8-группы-пользователей-100.png"
                                    alt=""
                                />
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={
                                token != "null"
                                    ? user!=null&&user.role == "admin"
                                        ? "admin/categories"
                                        : "user"
                                    : "#"
                            }
                            onClick={() => {
                                if (token == "null") setModal(1);
                            }}
                        >
                            <button className="userimg us">
                                <img
                                    src={
                                        token != "null" && user!=null && user.photo != null
                                            ? user.photo
                                            : "img/icons8-пользователь-мужчина-в-кружке-100.png"
                                    }
                                    alt=""
                                />
                            </button>
                        </Link>
                    </li>
                </div>
                <div className="userimg hiden" onClick={()=>setWindowToggle(!windowToggle)}>
                    <img
                        src={
                            token != "null" && user!=null && user.photo != null
                                ? user.photo
                                : "img/icons8-пользователь-мужчина-в-кружке-100.png"
                        }
                        alt=""
                    />
                </div>
                {windowToggle ? (
                    <div className="nav3 hiden" id="nav-list" onClick={()=>setWindowToggle(!windowToggle)}>
                        <li>
                            <Link
                                to={
                                    token != "null"
                                        ? user!=null&&user.role == "admin"
                                            ? "admin/categories"
                                            : "user"
                                        : "/"
                                }
                                onClick={() => {
                                    if (token == "null") setModal(1);
                                }}
                            >
                                <div className="na userimg">
                                    <p>Кабинет</p>
                                    <img
                                        src={
                                            token != "null" && user!=null && user.photo != null
                                                ? user.photo
                                                : "img/icons8-пользователь-мужчина-в-кружке-100.png"
                                        }
                                        alt=""
                                    />
                                </div>
                            </Link>
                        </li>

                        <li>
                            <Link to={token != "null" ? "friends" : "/"}>
                                <div className="na">
                                    <p>Друзья</p>
                                    <img
                                        src="img/icons8-группы-пользователей-100.png"
                                        alt=""
                                    />
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link to={token != "null" ? "message" : "/"}>
                                <div className="na">
                                    <p>Мессенджер</p>
                                    <img src="img/icons8-чат-96.png" alt="" />
                                </div>
                            </Link>
                        </li>
                    </div>
                ) : (
                    ""
                )}
            </nav>
        </header>
    );
}
