import React from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../app";

export default function Create2({
    host,
    setModal,
    error,
    setError,
    createInfo,
    categories,
    update,
}) {
    const [selectCategory, setSelectCategory] = React.useState([]);
    const [checkbox, setCheckbox] = React.useState(false);
    const { token, setToken, setUser, user } = React.useContext(UserContext);
    const navigate = useNavigate();
    React.useEffect(() => {
        const n = categories.length;
        setSelectCategory(
            Array.from({ length: n }, (_, i) => {
                return -1;
            })
        );
    }, []);
    function create2() {
        const create2 = document.querySelectorAll(".create2 input");
        if (!checkbox) {
            setError("create2-error");
            return;
        }
        const user = new FormData();
        user.append("name", createInfo.name);
        user.append("login", createInfo.login);
        user.append("email", update?"":createInfo.email);
        user.append("password", createInfo.password);
        user.append("password_repeat", createInfo.password_repeat);
        user.append("accept", create2[1].value == "on");
        if (create2[0].value) {
            user.append("photo", create2[0].files[0]);
        }

        let categoryText = "";
        selectCategory.forEach((v) => {
            categoryText +=
                categoryText != ""
                    ? v != -1
                        ? "|" + v
                        : ""
                    : v != -1
                    ? v
                    : "";
        });
        if (categoryText != "") {
            user.append("category", categoryText);
        }
        const path = update ? "user" : "create";
        fetch(host + path, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: update ? "Bearer " + token : "",
            },
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
                if (!update) {
                    console.log(json);
                    setToken(json.token);
                    setUser(json.user);
                    setModal(0);
                    if (json.user.role == "user") {
                        navigate("user");
                    }
                    if (json.user.role == "admin") {
                        navigate("admin/categories");
                    }
                } else {
                    console.log(json);
                    setUser(json.user);
                    setModal(0);
                }
            });
    }
    return (
        <div className="create2">
            <h1>{update ? "Редактирование профиля" : "Регистрация"}</h1>
            <h2>Что вас интересует?</h2>
            <div className="categslist">
                {categories.map((value, i) => (
                    <button
                        key={"selectCategory" + i}
                        className={
                            selectCategory[i] != -1 ? "selectCategory" : ""
                        }
                        onClick={() => {
                            selectCategory[i] =
                                selectCategory[i] == -1 ? value.id : -1;
                            setSelectCategory([...selectCategory]);
                            console.log(selectCategory);
                        }}
                    >
                        {value.title}
                    </button>
                ))}
            </div>
            <h2>Выберите себе аватар </h2>
            <div className="ava">
                <label className="input-file">
                    <input type="file" name="file" />
                    <span>Выберите файл</span>
                </label>
                <img src={update&&user.photo!=null?user.photo:"img/close-up-people-traveling-together.jpg"} alt="" />
            </div>
            <div className="checkbox">
                <input type="checkbox" id="accept" name="" className="check" onClick={()=>setCheckbox(!checkbox)} />
                <label htmlFor="accept">
                    Согласие на обработку персональных данных
                </label>
            </div>
            {error == "create2-error" ? (
                <p className="perror">
                    Ошибка регистрации: необходимо дать согласие на обработку!
                </p>
            ) : (
                ""
            )}
            <div className="btns">
                <button onClick={() => setModal(update?4:2)} className="arrow">
                    <img src="img/icons8-стрелка-100 (3).png" alt="" />
                </button>
                <button className="enter" onClick={() => create2()}>
                    {!update ? 'Зарегистрироваться':'Обновить'}
                </button>
            </div>

            {update ? (
                <button onClick={() => setModal(6)}>Удалить профиль</button>
            ) : (
                <button onClick={() => setModal(1)}>или Войти</button>
            )}
        </div>
    );
}
