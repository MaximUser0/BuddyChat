import React from "react";
import styles from "./UpdatePost.module.css";
import { PostContext } from "../../app";
import { UserContext } from "../../app";
import { useNavigate } from "react-router-dom";

export default function UpdatePost() {
    const { post, setPost } = React.useContext(PostContext);
    const { token } = React.useContext(UserContext);
    const [categories, setCategories] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [data, setData] = React.useState(null);
    const [category, setCategory] = React.useState(null);
    const [files, setFiles] = React.useState([]);
    const navigate = useNavigate();
    React.useEffect(() => {
        getPost();
        getCategories();
    }, []);
    function getPost() {
        if (post != -1) {
            fetch("http://127.0.0.1:8000/api/post/" + post, {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        return {
                            description: null,
                            path: [],
                            title: null,
                        };
                    }
                    return response.json();
                })
                .then((json) => {
                    console.log(json[0]);
                    setData(json[0]);
                    setCategory(json[0].category_id);
                });
        }
    }
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
    function deleteImg(id, array_id) {
        fetch("http://127.0.0.1:8000/api/post/img/" + id, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
        }).then((response) => {
            if (response.ok) {
                console.log(data);
                data.path.splice(array_id, 1);
                setData({ ...data });
            }
        });
    }
    function changePost() {
        const description = document.getElementById("description").value;
        const newPost = new FormData();
        if (category == null) {
            setError("Укажите категорию");
            return;
        }
        if (description == "") {
            setError("Укажите описание");
            return;
        }
        newPost.append("category_id", category);
        newPost.append("description", description);
        if(files.length!=0){
            files.forEach((value, i)=>{
                newPost.append("img"+(i+1), value);
            })
        }
        fetch(
            post != -1
                ? "http://127.0.0.1:8000/api/post/" + post
                : "http://127.0.0.1:8000/api/post",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                },
                body: newPost,
            }
        ).then((response) => {
            if (!response.ok) {
                setError("Произошла ошибка");
                return;
            }
            setError(null);
            setPost(-1);
            navigate("../user");
        });
    }
    function addImg() {
        let input = document.createElement("input");
        input.type = "file";

        input.onchange = (e) => {
            files.push(e.target.files[0])
            setFiles([...files])
        };
        input.click();
    }
    return (
        <div className={styles.container}>
            <h2>{post == -1 ? "Создание поста" : "Редактирование поста"}</h2>
            <div className={styles.allfots}>
                <div className={styles.fots}>
                    {data != null
                        ? data.path.map((value, i) => (
                              <div
                                  className={styles.onefoto}
                                  key={"UpdatePostImg" + i}
                              >
                                  <img
                                      className={styles.fotochka}
                                      src={value.img}
                                      alt=""
                                  />
                                  <button
                                      onClick={() => {
                                          deleteImg(value.id, i);
                                      }}
                                  >
                                      <img
                                          src="img/icons8-удалить-100.png"
                                          alt=""
                                      />
                                  </button>
                              </div>
                          ))
                        : ""}
                </div>
                <button className={styles.rot + " hiden"}>
                    <img src="img/icons8-умножение-96.png" alt="" />
                </button>
                <button className="hiddenmobile" onClick={()=>addImg()}>Добавить файл{files.length!=0?" ("+files.length+")":""}</button>
            </div>
            <textarea
                className={styles.textarea}
                name=""
                id="description"
                placeholder="Поделитесь впечатлениями"
                defaultValue={data != null ? data.description : ""}
            ></textarea>
            <div className={styles.allus}>
                <div className={styles.categslist}>
                    {categories.map((value, i) => (
                        <button
                            key={"selectCategoryUpdate" + i}
                            className={
                                post != -1 && data.category_id == value.id
                                    ? "selectCategory"
                                    : ""
                            }
                            onClick={() => {
                                setCategory(value.id);
                            }}
                        >
                            {value.title}
                        </button>
                    ))}
                    {error != null ? <p className="perror">{error}</p> : ""}
                </div>

                <div className={styles.buts}>
                    <button
                        onClick={() => {
                            setPost(-1);
                            navigate("../user");
                        }}
                    >
                        Отменить
                    </button>
                    <button
                        className={styles.save}
                        onClick={() => changePost()}
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
}
