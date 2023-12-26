import React from "react";
import styles from "./Message.module.css";
import AllChats from "./AllChats";
import Chat from "./Chat";

export default function Message() {
    const [chat, setChat] = React.useState({});
    return (
        <div className={styles.container}>
            {true ? (
                <AllChats styles={styles} chat={chat} setChat={setChat}/>
            ) : (
                ""
            )}
            <Chat styles={styles} chat={chat} setChat={setChat}/>
        </div>
    );
}
