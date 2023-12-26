import React from "react";
import { UserContext } from "../../app";

export default function Create1({
    setModal,
    error,
    setError,
    setCreateInfo,
    update,
}) {
    const [inputError, setInputError] = React.useState(-1);
    const { user } = React.useContext(UserContext);
    function create1() {
        const create1 = document.querySelectorAll(".create1 input");
        if(!(create1[0].value != "" && /^[А-Яа-яA-Za-z-\s]+$/.test(create1[0].value))){
            setInputError(0);
            setError("create1-error");
            return;
        }
        if(!(create1[1].value != "" && /^[A-Za-z\s]+$/.test(create1[1].value))){
            setInputError(1);
            setError("create1-error");
            return;
        }
        if(!update && !(create1[2].value != "" && /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(create1[2].value))){
            setInputError(2);
            setError("create1-error");
            return;
        }
        if( create1[update?2:3].value == ""){
            setInputError(3);
            setError("create1-error");
            return;
        }
        if(create1[update?3:4].value == "" || create1[update?3:4].value != create1[update?2:3].value){
            setInputError(4);
            setError("create1-error");
            return;
        }
        setInputError(-1);
        setError("");
        setCreateInfo({
            name: create1[0].value,
            login: create1[1].value,
            email: update?"":create1[2].value,
            password: create1[update?2:3].value,
            password_repeat: create1[update?3:4].value,
        });
        setModal(update?5:3);
    }
    return (
        <div className="create1">
            <h1>{update ? "Редактирование профиля" : "Регистрация"}</h1>
            <input type="text" className={inputError == 0?"error":""} placeholder="Введите фамилию и имя" defaultValue={update?user.name:""} />
            <input type="text" className={inputError == 1?"error":""} placeholder="Введите логин"  defaultValue={update?user.login:""} />
            {update?"":<input type="email"  className={inputError == 2?"error":""} placeholder="Введите EMAIL" defaultValue={update?user.email:""} />}
            <input type="password" className={inputError == 3?"error":""} placeholder="Введите пароль" />
            <input
                className={inputError == 4?"error":""}
                type="password"
                placeholder="Подтвердите пароль"
            />
            {error == "create1-error" ? (
                <p className="perror">
                    Ошибка {update ? "обновления" : "регистрации"}: введите
                    данные корректно!
                </p>
            ) : (
                ""
            )}
            <button onClick={() => create1()} className="enter">
                Далее
            </button>
            {update ? (
                <button onClick={() => setModal(6)}>Удалить профиль</button>
            ) : (
                <button onClick={() => setModal(1)}>или Войти</button>
            )}
        </div>
    );
}
