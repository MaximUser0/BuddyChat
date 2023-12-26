import React from "react";
import styles from "./HeaderAdmin.module.css";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../app";

export default function HeaderAdmin() {
    const { token, setToken, user } = React.useContext(UserContext);
    const navigate = useNavigate();

    function logout() {
        fetch("http://127.0.0.1:8000/api/logout", {
            headers: {
                Authorization: "Bearer " + token,
            },
        }).then((response) => {
            if (response.ok) {
                setToken("null");
                sessionStorage.setItem("token", "null");
                sessionStorage.setItem("data", "null");
            }
            navigate("/");
        });
    }
    return (
        <header>
            <nav className={styles.nav}>
                <div className={styles.nav1}>
                    <li>
                        <Link to="../">
                            <img
                                className="logo"
                                src="../img/лого.png"
                                alt=""
                            />
                        </Link>
                    </li>
                    <li
                        style={{
                            fontSize: "1.8vw",
                            marginLeft: "2vw",
                            marginTop: "1.6vw",
                        }}
                    >
                        ADMIN
                    </li>
                </div>
                <div className={"admcategs " + styles.admcategs} style={{opacity: "0%"}}></div>
                <div className={styles.nav2} id="nav-list">
                    <button onClick={()=>logout()}>Выйти</button>
                </div>
            </nav>
        </header>
    );
}
