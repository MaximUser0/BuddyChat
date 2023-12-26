import React from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../app";
import { PostContext } from "../app";

export default function UserModal({ modal, setModal, setPosts, posts }) {
    const navigate = useNavigate();
    const { token, setToken, setUser, user } = React.useContext(UserContext);
    const { post, setPost } = React.useContext(PostContext);

    function deleteUser() {
        fetch("http://127.0.0.1:8000/api/user", {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
        }).then((response) => {
            if (response.ok) {
                setToken("null");
                setUser(null);
                navigate("../");
            }
        });
    }
    function deletePost() {
        if (post != -1) {
            fetch("http://127.0.0.1:8000/api/post/" + post, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                },
            }).then((response) => {
                if (response.ok) {
                    setPost(-1);
                    setModal(0);
                    posts.forEach((element, i) => {
                        if(element.id == post){
                            posts.splice(i,1);
                            setPosts([...posts])
                            user['posts']--;
                            setUser([...user])
                        }
                    });
                }
            });
        }
    }
    return (
        <>
            {modal == 6 || modal == 7 ? (
                <div
                    className="modal"
                    onClick={(e) => {
                        if (e.target !== e.currentTarget) return;
                        setModal(0);
                    }}
                >
                    {modal == 6 ? (
                        <div className="confirmuser">
                            <p
                                style={{
                                    fontWeight: 700,
                                    marginBottom: "0.4vw",
                                }}
                            >
                                Вы уверены, что хотите удалить профиль?
                            </p>
                            <p>Также будут удалены все ваши посты</p>
                            <div className="conbtns">
                                <button onClick={() => deleteUser()}>
                                    Удалить
                                </button>
                                <button
                                    className="cancel"
                                    onClick={() => setModal(0)}
                                >
                                    Отменить
                                </button>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                    {modal == 7 ? (
                        <div className="confirmpost">
                            <p style={{ fontWeight: 700 }}>
                                Вы уверены, что хотите удалить пост?
                            </p>
                            <div className="conbtns">
                                <button onClick={() => deletePost()}>
                                    Удалить
                                </button>
                                <button
                                    className="cancel"
                                    onClick={() => {
                                        setPost(-1);
                                        setModal(0);
                                    }}
                                >
                                    Отменить
                                </button>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            ) : (
                ""
            )}
        </>
    );
}
