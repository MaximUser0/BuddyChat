import React from "react";
import styles from "./Categories.module.css";
import { UserContext } from "../../../app";

export default function Categories() {
    const { token } = React.useContext(UserContext);
    const [categories, setCategories] = React.useState([]);
    const [category, setCategory] = React.useState(-1);
    React.useEffect(() => {
        getCategories();
    }, []);
    function getCategories() {
        fetch("http://127.0.0.1:8000/api/category", {
            headers: {
                Accept: "application/json",
            },
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                setCategories(json);
            });
    }
    function deleteCategory(index) {
        fetch("http://127.0.0.1:8000/api/category/" + index, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
        }).then((response) => {
            if (response.ok) {
                getCategories();
            }
        });
    }
    function addCategory() {
        if(category != -1){
            updateCategory(category);
            return
        }
        const title = document.getElementById("inputTitle").value;
        document.getElementById("inputTitle").value = "";
        if (title == "") {
            return;
        }
        const data = new FormData();
        data.append("title", title);
        fetch("http://127.0.0.1:8000/api/category", {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
            body: data,
        }).then((response) => {
            if (response.ok) {
                getCategories();
            }
        });
    }
    function cancelAddCategory(){
        setCategory(-1)
        document.getElementById("inputTitle").value = "";
    }
    function updateCategory(index) {
        setCategory(-1)
        const title = document.getElementById("inputTitle").value;
        if (title == "") {
            return;
        }
        const data = new FormData();
        data.append("title", title);
        data.append("_method", "PATCH");
        document.getElementById("inputTitle").value = "";
        fetch("http://127.0.0.1:8000/api/category/" + index, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
            body: data,
        }).then((response) => {
            if (response.ok) {
                getCategories();
            }
        });
    }
    return (
        <div className={styles.container}>
            <div className={styles.catlist}>
                <div className={styles.cattop}>
                    <h2>Список категорий</h2>
                </div>
                <div className={styles.catcontainer}>
                    {categories.map((value, i) => (
                        <div
                            className={styles.catcard}
                            key={"AdminCategory" + i}
                        >
                            <p>{value.title}</p>
                            <div className={styles.buttonscat}>
                                <button style={{ marginRight: "1vw" }} onClick={()=>{
                                    document.getElementById("inputTitle").value = value.title;
                                    setCategory(value.id);
                                }}>
                                    <img
                                        src="../img/icons8-чат-96 (2).png"
                                        alt=""
                                    />
                                </button>
                                <button
                                    onClick={() => deleteCategory(value.id)}
                                >
                                    <img
                                        src="../img/icons8-удалить-100.png"
                                        alt=""
                                    />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.upd}>
                <h2 style={{ marginBottom: "2.5vw" }}>
                    Добавление/редактирование
                </h2>
                <input
                    type="text"
                    placeholder="Введите данные"
                    id="inputTitle"
                />
                <button className={styles.en} onClick={() => addCategory()}>
                    Готово
                </button>
                <button onClick={() => cancelAddCategory()}>Отмена</button>
            </div>
        </div>
    );
}
