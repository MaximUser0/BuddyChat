import React from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../app";

export default function Login({ host, setModal, error, setError }) {
    const { setToken, setUser } = React.useContext(UserContext);

    const navigate = useNavigate();
    function logIn() {
        const login = document.getElementById("login").value;
        const password = document.getElementById("login-password").value;
        const user = new FormData();
        user.append("login", login);
        user.append("password", password);
        if (login == "" || password == "") {
            setError("login-error");
            return;
        }
        fetch(host + "login", {
            method: "POST",
            body: user,
        })
            .then((response) => {
                if (!response.ok) {
                    setError("login-error");
                    return;
                }
                setError("");
                console.log(response);
                return response.json();
            })
            .then((json) => {
                console.log(json.user);
                setToken(json.token);
                setUser(json.user);
                setModal(0);
                if (json.user.role == "user") {
                    navigate("user");
                }
                if (json.user.role == "admin") {
                    navigate("admin/categories");
                }
            });
    }
    return (
        <div className="login">
            <h1>Авторизация</h1>
            <input id="login" type="text" placeholder="Введите логин" />
            <input
                id="login-password"
                type="password"
                placeholder="Введите пароль"
            />
            {error == "login-error" ? (
                <p className="perror">
                    Ошибка авторизации: введите данные корректно!
                </p>
            ) : (
                ""
            )}
            <button onClick={() => logIn()} className="enter">
                Войти
            </button>
            <button onClick={() => setModal(2)}>или Зарегистрироваться</button>
        </div>
    );
}
