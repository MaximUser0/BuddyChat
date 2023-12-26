import React from "react";
import { UserContext } from "../../app";
import { unstable_HistoryRouter } from "react-router-dom";

export default function AllChats({ styles, chat, setChat }) {
    const { token, user } = React.useContext(UserContext);
    const [chats, setChats] = React.useState([]);
    const [timeoutChat, setTimeoutChat] = React.useState(null);
    React.useEffect(() => {
        getChats();
        return () => {
            clearTimeout(timeoutChat);
        };
    }, []);

    function updateCheck(chatSave) {
        const data = new FormData();
        data.append("updated_at", chatSave.updated_at_check);

        fetch("http://127.0.0.1:8000/api/chat/call/" + chatSave.id, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
            body: data,
        })
            .then((response) => response.json())
            .then((json) => {
                if (json != "ok") {
                    setChat(json);
                    chatSave = json;
                }
            });
        clearTimeout(timeoutChat);
        const timeout = setTimeout(() => {
            updateCheck(chatSave);
        }, 5000);
        setTimeoutChat(timeout);
    }
    function getChats() {
        fetch("http://127.0.0.1:8000/api/chat", {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
        })
            .then((response) => response.json())
            .then((json) => {
                setChats(json);
                openChat(json[0].chat_id);
            });
    }
    function openChat(chat_id) {
        clearTimeout(timeoutChat);
        fetch("http://127.0.0.1:8000/api/chat/" + chat_id, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                setChat(json);
                updateCheck(json);
            });
    }
    return (
        <div className={styles.friendlist}>
            <div className={styles.friendtop}></div>
            <div className={styles.friendcontainer}>
                {chats.length != 0 ? (
                    chats.map((chat) => (
                        <div
                            key={"ChatAll" + chat.chat_id}
                            className={styles.ava}
                            onClick={() => openChat(chat.chat_id)}
                        >
                            <img src={chat.photo} alt="" />
                            <p>{chat.login}</p>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty + " " + styles.emptyfriend}>
                        <img src="img/icons8-поиск-100 (1).png" alt="" />
                        <p style={{ textAlign: "center" }}>
                            У вас пока нет чатов. Пора их создать!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
