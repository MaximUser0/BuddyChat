import React from "react";
import Login from "./Login";
import Create1 from "./Create1";
import Create2 from "./Create2";

//Подсвечивать поля с ошибкам

export default function AuthModal({ modal, setModal }) {
    const [error, setError] = React.useState(null);
    const [createInfo, setCreateInfo] = React.useState({});
    const [categories, setCategories] = React.useState();
    const host = "http://127.0.0.1:8000/api/";
    React.useEffect(() => {
        getCategories();
    }, []);
    function getCategories() {
        fetch(host + "category", {
            headers: {
                Accept: "application/json",
            },
        })
            .then((response) => response.json())
            .then((json) => {
                setCategories(json);
            });
    }
    return (
        <>
            {modal != 0 && modal < 6 ? (
                <div
                    className="modal"
                    onClick={(e) => {
                        if (e.target !== e.currentTarget) return;
                        setModal(0);
                    }}
                >
                    {modal == 1 ? (
                        <Login
                            host={host}
                            setModal={setModal}
                            error={error}
                            setError={setError}
                        />
                    ) : (
                        ""
                    )}
                    {modal == 2 || modal == 4 ? (
                        <Create1
                            setModal={setModal}
                            error={error}
                            setError={setError}
                            setCreateInfo={setCreateInfo}
                            update={modal==4}
                        />
                    ) : (
                        ""
                    )}
                    {modal == 3 || modal == 5  ? (
                        <Create2
                            host={host}
                            setModal={setModal}
                            error={error}
                            setError={setError}
                            createInfo={createInfo}
                            categories={categories}
                            update={modal==5}
                        />
                    ) : (
                        ""
                    )}
                </div>
            ) : (
                ""
            )}
        </>
    );
}
