import React from "react";
import styles from "./Friends.module.css";
import { UserContext } from "../../app";
import { Link, useNavigate } from "react-router-dom";
export default function Friends() {
    const { token, user, setUser } = React.useContext(UserContext);
    const [friends, setFriends] = React.useState([]);
    const [requests, setRequests] = React.useState([]);
    const [users, setUsers] = React.useState(null);
    const navigate = useNavigate();
    React.useEffect(() => {
        fetch("http://127.0.0.1:8000/api/friend", {
            headers: {
                Authorization: "Bearer " + token,
            },
        })
            .then((response) => response.json())
            .then((json) => {
                setFriends(json);
            });
        fetch("http://127.0.0.1:8000/api/friendRequest", {
            headers: {
                Authorization: "Bearer " + token,
            },
        })
            .then((response) => response.json())
            .then((json) => {
                setRequests(json);
            });
    }, []);
    function Find() {
        if (document.getElementById("find").value == "") {
            setUsers(null);
            return;
        }
        const text = new FormData();
        text.append("text", document.getElementById("find").value);
        fetch("http://127.0.0.1:8000/api/find", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
            },
            body: text,
        })
            .then((response) => response.json())
            .then((json) => {
                setUsers(json);
            });
    }
    function friendshipRequest(user_id, i) {
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
                let user = users[i];
                user["owner"] = true;
                requests.push(user);
                setRequests([...requests]);
                console.log(requests);
            }
        });
    }
    function acceptRequest(user_id, i) {
        fetch("http://127.0.0.1:8000/api/friend/" + user_id, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
        }).then((response) => {
            if (response.ok) {
                let request = requests[i];
                friends.push(request);
                setFriends([...friends]);
                requests.splice(i, 1);
                setRequests([...requests]);
                user["friends"]++;
                setUser([...user]);
            }
        });
    }
    function deleteRequest(friend_id, i) {
        fetch("http://127.0.0.1:8000/api/friend/" + friend_id, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
        }).then((response) => {
            if (response.ok) {
                requests.splice(i, 1);
                setRequests([...requests]);
            }
        });
    }
    function addChat($id) {
        const data = new FormData();
        data.append("user_id", $id);
        fetch("http://127.0.0.1:8000/api/chat", {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
            body: data,
        }).then((response) => {
            if (response.ok) {
                navigate("../message");
            }
        });
    }
    function deleteFriend(user_id, index) {
        fetch("http://127.0.0.1:8000/api/friend/" + user_id, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
        }).then((response) => {
            if (response.ok) {
                friends.splice(index, 1);
                setFriends([...friends]);
                user["friends"]--;
                setUser([...user]);
            }
        });
    }
    return (
        <div className={styles.container}>
            <div className={styles.dop + " hiden"}>
                <button>Список друзей</button>
                <button>Заявки на дружбу</button>
            </div>

            <div className={styles.friendlist}>
                <div className={styles.friendtop}>
                    <h2 className={styles.hiddenmobile}>Список друзей</h2>
                    <div className={styles.search}>
                        <button onClick={() => Find()}>
                            <img src="img/icons8-поиск-100 (1).png" alt="" />
                        </button>
                        <input
                            id="find"
                            type="search"
                            placeholder="Поиск по пользователям"
                            className={styles.input}
                        />
                    </div>
                </div>
                <div className={styles.friendcontainer}>
                    {users == null
                        ? friends.map((friend, i) => (
                              <div
                                  className={styles.friendcard}
                                  key={"friendcard" + i}
                              >
                                  <div className={styles.ava}>
                                      <img src={friend.photo} alt="" />
                                      <p>{friend.login}</p>
                                  </div>
                                  <div className={styles.buttonsuser}>
                                      <button
                                          style={{ marginRight: "1vw" }}
                                          onClick={() => addChat(friend.id)}
                                      >
                                          <img
                                              src="img/icons8-чат-96 (2).png"
                                              alt=""
                                          />
                                      </button>
                                      <button
                                          onClick={() =>
                                              deleteFriend(friend.friend_id, i)
                                          }
                                      >
                                          <img
                                              src="img/icons8-удалить-100.png"
                                              alt=""
                                          />
                                      </button>
                                      <button
                                          className={
                                              styles.addfriend + " hiddenmobile"
                                          }
                                          style={{ display: "none" }}
                                      >
                                          Добавить в друзья
                                      </button>
                                  </div>
                              </div>
                          ))
                        : ""}

                    {users != null
                        ? users.map((user, i) => (
                              <div className={styles.friendcard}>
                                  <div className={styles.ava}>
                                      <img src={user.photo} alt="" />
                                      <p>{user.login}</p>
                                  </div>
                                  <div className={styles.buttonsuser}>
                                      <button
                                          style={{ marginRight: "1vw" }}
                                          onClick={() => addChat(user.id)}
                                      >
                                          <img
                                              src="img/icons8-чат-96 (2).png"
                                              alt=""
                                          />
                                      </button>
                                      <button
                                          className={
                                              styles.addfriend + " hiddenmobile"
                                          }
                                          onClick={() => {
                                              friendshipRequest(user.id, i);
                                          }}
                                      >
                                          Добавить в друзья
                                      </button>
                                      <button className={styles.rot + " hiden"}>
                                          <img
                                              src="img/icons8-умножение-96.png"
                                              alt=""
                                          />
                                      </button>
                                  </div>
                              </div>
                          ))
                        : ""}

                    {friends.length == 0 && users == null ? (
                        <div
                            className={styles.empty + " " + styles.emptyfriend}
                        >
                            <img src="img/icons8-поиск-100 (1).png" alt="" />
                            <p>У вас пока нет друзей. Пора найти их!</p>
                        </div>
                    ) : (
                        ""
                    )}

                    {users != null && users.length == 0 ? (
                        <div
                            className={styles.empty + " " + styles.emptysearch}
                        >
                            <img src="img/icons8-поиск-100 (1).png" alt="" />
                            <p>
                                Пользователь не найден. Проверьте введенные
                                данные!
                            </p>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
            <div className={styles.applications}>
                <h2 className={styles.hiddenmobile}>Заявки на дружбу</h2>
                <div className={styles.applicationslist}>
                    {requests.map((request, i) => (
                        <div
                            className={styles.applicationcard}
                            key={"request" + i}
                        >
                            <div className={styles.ava}>
                                <img src={request.photo} alt="" />
                                <p>{request.login}</p>
                            </div>
                            <div className={styles.buttonsuser}>
                                {request.owner || request.user_id == user.id ? (
                                    <button style={{ marginRight: "1vw" }}>
                                        Ожидает ответа
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            style={{ marginRight: "1vw" }}
                                            onClick={() =>
                                                acceptRequest(
                                                    request.friend_id,
                                                    i
                                                )
                                            }
                                        >
                                            <img
                                                src="img/icons8-галочка-100.png"
                                                alt=""
                                            />
                                        </button>
                                        <button
                                            onClick={() =>
                                                deleteRequest(
                                                    request.friend_id,
                                                    i
                                                )
                                            }
                                        >
                                            <img
                                                src="img/icons8-умножение-96.png"
                                                alt=""
                                            />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
