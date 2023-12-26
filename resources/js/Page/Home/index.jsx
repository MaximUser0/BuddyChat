import React from "react";
import styles from "./Home.module.css";
import PostList from "../../components/PostList";

export default function Home({ posts, setPosts }) {
    return (
        <div className={styles.container}>
            <PostList
                styles={styles}
                posts={posts}
                setPosts={setPosts}
                page={"home"}
            />
        </div>
    );
}
