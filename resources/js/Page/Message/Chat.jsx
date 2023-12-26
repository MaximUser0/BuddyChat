import React from "react";
import { UserContext } from "../../app";

export default function Chat({ styles, chat, setChat }) {
    const { token, user } = React.useContext(UserContext);
    const [selected, setSelected] = React.useState([]);
    const months = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
    ];
    React.useEffect(() => {
        setSelected([]);
    }, [chat]);
    function getChatElements() {
        let content = JSON.parse(chat.content);
        let date = 0;
        let first = 0;
        content.forEach((element, i) => {
            if (element.status == 0 && i > 0 && first == 0) {
                first = 1;
                content[i - 1].status = 2;
                console.log(content);
            }
            content[i].date = 0;
            if (date != content[i].created_at.slice(0, 10)) {
                date = content[i].created_at.slice(0, 10);
                content[i].date = 1;
            }
        });
        if (first == 0) {
            content[content.length - 1].status = 2;
        }
        const author = chat.user_id == user.id ? 1 : 0;
        const elements = content.map((value, i) => (
            <>
                {value.date == 1 ? (
                    <p className={styles.date} style={{ width: "100%" }}>
                        {value.created_at.slice(8, 10) +
                            " " +
                            months[Number(value.created_at.slice(5, 7)) - 1]}
                    </p>
                ) : (
                    ""
                )}
                <div
                    className={
                        value.author == author ? "chatBlock" : "chatBlockRight"
                    }
                    key={"chatBlock" + i}
                >
                    <div
                        className={
                            (value.author == author
                                ? styles["mess-left"]
                                : styles["mess-right"]) +
                            " " +
                            styles.mess +
                            (selected.includes(i) ? " " + styles.selected : "")
                        }
                        onClick={(e) => doubleClick(e, i)}
                    >
                        <p>{value.message}</p>
                        <p className={styles.time}>
                            {value.created_at.substr(-5, 5)}
                        </p>
                    </div>
                </div>
                {value.status == 2 ? (
                    <p
                        className={styles.status + " " + styles.right}
                        style={{ textAlign: "center", width: "100%" }}
                        key={"chatBlockLast"}
                    >
                        Прочитано
                    </p>
                ) : (
                    ""
                )}
            </>
        ));
        return elements;
    }
    function sendMessage() {
        const message = document.getElementById("message").value;
        document.getElementById("message").value = "";
        console.log(chat);
        if (message == "") return;
        const data = new FormData();
        data.append("message", message);
        fetch("http://127.0.0.1:8000/api/chat/" + chat.id, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
            body: data,
        }).then((response) => {
            if (response.ok) {
                const newDate = new Date();
                const today =
                    newDate.toISOString().slice(0, 10) +
                    " " +
                    newDate.toISOString().slice(11, 16);
                let content = JSON.parse(chat.content);
                content.push({
                    author: chat.user_id == user.id ? 0 : 1,
                    created_at: today,
                    message: message,
                    status: chat.user_id == user.id ? 0 : 1,
                });
                chat.content = JSON.stringify(content);
                setChat({ ...chat });
            }
        });
    }
    function doubleClick(event, index) {
        if (event.detail == 2 && !selected.includes(index)) {
            selected.push(index);
            setSelected([...selected]);
        }
    }
    function cancelDelete() {
        setSelected([]);
    }
    function acceptDelete() {
        let content = JSON.parse(chat.content);
        setChat({ ...chat });
        selected.forEach((index, i) => {
            fetch("http://127.0.0.1:8000/api/chat/" + chat.id + "/" + index, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                },
            }).then((response) => {
                if (response.ok) {
                    content.splice(i, 1);
                }
            });
        });
        chat.content = JSON.stringify(content);
        setChat({ ...chat });
    }
    return (
        <div className={styles.messages}>
            <div className={styles.dialog}>
                <div className={styles.diatop}>
                    <div className={styles.dialeft}>
                        <button
                            className={styles.noborder + " " + "hiden"}
                            style={{ transform: "rotate(-90deg)" }}
                        >
                            <a
                                href="#"
                                onClick={() => {
                                    //history.back();
                                    //return false;
                                }}
                                className={styles["history-back"]}
                            >
                                <img
                                    src="img/icons8-стрелка-100 (1).png"
                                    alt=""
                                />
                            </a>
                        </button>
                        <p>{chat.length != 0 ? chat.login : ""}</p>
                    </div>
                    {selected.length != 0 ? (
                        <div className={styles.diaright}>
                            <button
                                className={styles.tbut}
                                onClick={() => cancelDelete()}
                            >
                                Отменить
                            </button>
                            <button
                                className={styles.noborder}
                                onClick={() => acceptDelete()}
                            >
                                <img src="img/icons8-удалить-100.png" alt="" />
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                </div>

                <div className={styles.messagelist}>
                    {Object.entries(chat).length > 0 && chat.content != "[]" ? (
                        getChatElements()
                    ) : (
                        <p style={{ color: "white", textAlign: "center" }}>
                            Здесь пока пусто
                        </p>
                    )}
                </div>
                <div className={styles.yourmess}>
                    <textarea
                        name=""
                        id="message"
                        placeholder="Напишите сообщение"
                    ></textarea>
                    <button onClick={() => sendMessage()}>
                        <img src="img/Group 5.svg" alt="" />
                    </button>
                </div>
            </div>
        </div>
    );
}
