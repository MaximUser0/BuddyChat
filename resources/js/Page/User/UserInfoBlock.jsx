import React from "react";
import { UserContext } from "../../app";
import { Link, useNavigate } from "react-router-dom";

export default function UserInfoBlock({ styles, setModal }) {
    const { token, setToken, user, setUser } = React.useContext(UserContext);
    const navigate = useNavigate();

    function logout() {
        fetch("http://127.0.0.1:8000/api/logout", {
            headers: {
                Authorization: "Bearer " + token,
            },
        }).then((response) => {
            if (response.ok) {
                setToken("null");
                setUser("null");
            }
            navigate("/");
        });
    }
    return (
        <div className={styles.usercontainer}>
            <div className={styles.dopuscontainer}>
                <img src={user.photo} alt="" />
                <div className={styles.inf}>
                    <p style={{ fontWeight: 700 }}>{user.login}</p>
                    <p style={{ margin: "1vw 0 2vw 0" }}>{user.name}</p>
                    <p style={{ position: "absolute", bottom: "0vw" }}>
                        <span>Посты:</span>{user.posts}
                    </p>
                </div>
                <div className={styles.vvv}>
                    <Link to={"../update"}><img src="img/icons8-умножение-96.png" alt="" /></Link>
                    <p style={{ position: "absolute", bottom: "0vw" }}>
                        <span>Друзья:</span>{user.friends}
                    </p>
                </div>
            </div>
            <div className={styles.butuser}>
                <button
                    className={styles.ex}
                    onClick={() => logout()}
                >
                    Выйти
                </button>
                <button onClick={()=>{setModal(4)}}>
                    <a>Редактировать профиль</a>
                </button>
            </div>
        </div>
    );
}
