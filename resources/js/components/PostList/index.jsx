import React from "react";
import { UserContext } from "../../app";
import Post from "./Post";

export default function PostList({ styles, posts, setPosts, page, setModal }) {
    const { token } = React.useContext(UserContext);
    React.useEffect(() => {
        if (token != "null") {
            fetch(
                page != "user"
                    ? "http://127.0.0.1:8000/api/post"
                    : "http://127.0.0.1:8000/api/post/my",
                {
                    headers: {
                        Authorization: "Bearer " + token,
                        Accept: "application/json",
                    },
                }
            )
                .then((response) => {
                    if (!response.ok) {
                        return [];
                    }
                    return response.json();
                })
                .then((json) => {
                    setPosts(json);
                });
        } else {
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
    }, []);
    return (
        <>
            {posts.map((post, index) => (
                <Post styles={styles} post={post} index={index} page={page} setModal={page=="user"?setModal:()=>{}} key={"Post" + index}/>
            ))}
            {posts.length == 0 ? (
                <div style={{ marginTop: "27vh" }}>
                    <h1>
                        {page != "user"
                            ? "По выбранным категориям ничего не найдено"
                            : "У вас ещё нет постов"}
                    </h1>
                    <p style={{ textAlign: "center" }}>
                        {page != "user"
                            ? "Вы можете изменить категории на странице профиля"
                            : "Создайте новый нажав на плюс"}
                    </p>
                </div>
            ) : (
                ""
            )}
        </>
    );
}
