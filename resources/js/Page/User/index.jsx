import React from "react";
import styles from "./User.module.css";
import ConfirmModal from "../../components/ConfirmModal";
import UserInfoBlock from "./UserInfoBlock";
import PostList from "../../components/PostList";

export default function User({ modal, setModal }) {
    const [posts, setPosts] = React.useState([]);
    return (
        <>
            <div className={styles.container}>
                <UserInfoBlock styles={styles} setModal={setModal} />
                <PostList
                    styles={styles}
                    posts={posts}
                    setPosts={setPosts}
                    page={"user"}
                    setModal={setModal}
                />
            </div>
            <ConfirmModal modal={modal} setModal={setModal} setPosts={setPosts} posts={posts} />
        </>
    );
}
