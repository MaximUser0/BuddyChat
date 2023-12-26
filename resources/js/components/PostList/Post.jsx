import React from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../app";
import { PostContext } from "../../app";

export default function Post({ styles, post, page, setModal }) {
    const { token } = React.useContext(UserContext);
    const { setPost } = React.useContext(PostContext);
    const navigate = useNavigate();
    function friendshipRequest(user_id, button) {
        if (token == "null") return;
        const data = new FormData();
        data.append("user_id", user_id);
        fetch("http://127.0.0.1:8000/api/friend", {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
            body: data,
        }).then((response) => {
            if (response.ok) {
                button.classList.add("hiden");
            }
        });
    }
    function updatePost() {
        setPost(post.id);
        navigate("../update");
    }
    function deletePost() {
        setPost(post.id);
        setModal(7);
    }
    return (
        <div className={styles.new}>
            <div className={styles.top}>
                <h2>{post.title}</h2>
                <div className={styles.usernew}>
                    <div className={styles.buttonus}>
                        {post.friend == 2 || post.friend == 1 ? (
                            <button className={styles.hidden}>
                                <img src="img/icons8-галочка-100.png" alt="" />
                            </button>
                        ) : (
                            ""
                        )}
                        {post.friend == 0 ? (
                            <button
                                className={styles.hidden + " " + styles.rot}
                                onClick={(e) => {
                                    friendshipRequest(post.user_id, e.target);
                                }}
                            >
                                <img src="img/icons8-умножение-96.png" alt="" />
                            </button>
                        ) : (
                            ""
                        )}
                        {post.friend == 0 ? (
                            <button
                                onClick={(e) => {
                                    friendshipRequest(post.user_id, e.target);
                                }}
                            >
                                Добавить в друзья
                            </button>
                        ) : post.friend == 2 || post.friend == 1 ? (
                            <button>
                                {post.friend == 2
                                    ? "В друзьях"
                                    : "Запрос отправлен"}
                            </button>
                        ) : (
                            ""
                        )}
                    </div>
                    <p>{post.login}</p>
                    <img src={post.photo} alt="" />
                </div>
            </div>
            {post.path != null ? (
                <div className={styles.foto}>
                    <div className={styles.mini}>
                        {post.path != null
                            ? post.path.map((value, index) =>
                                  index != 0 ? (
                                      <img
                                          key={"miniImg" + index}
                                          src={value}
                                          alt=""
                                      />
                                  ) : (
                                      ""
                                  )
                              )
                            : ""}
                    </div>
                    <div className={styles.maxi}>
                        <img src={post.path[0]} alt="" />
                    </div>
                </div>
            ) : (
                ""
            )}
            <div className={styles.text}>
                <p style={{ margin: "1vw 0" }}>
                    {post.created_at.substr(0, 10)}
                </p>
                <p style={{ marginBottom: "1vw" }}>{post.description}</p>
            </div>
            {page == "user" ? (
                <div className={styles.butt}>
                    <button onClick={() => updatePost()}>
                        <a>
                            <img
                                src="img/icons8-редактировать-100.png"
                                alt=""
                            />
                        </a>
                    </button>
                    <button onClick={() => deletePost()}>
                        <img src="img/icons8-удалить-100.png" alt="" />
                    </button>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}
