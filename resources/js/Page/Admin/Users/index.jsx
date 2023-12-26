import React from 'react'
import styles from './Users.module.css'

export default function Users() {
  return (
    <div className={styles.container}>
        <div className={styles.top}>
            <h2>Список пользователей</h2>
            <div className={styles.serch}>
                <button><img src="../img/icons8-поиск-100 (1).png" alt=""/></button>
                <input type="search" placeholder="Поиск по пользователям"/>
            </div>
        </div>
        <div className={styles.usercard}>
            <div className={styles.ava}>
                <img src="../img/pier-at-a-lake-in-hallstatt-austria.jpg" alt=""/>
                <p>ilovetraveling</p>
            </div>
            <div className={styles.buttonsuser}>
                <button>Забананить</button>
                <button>Разбананить</button>
            </div>
        </div>

        <div className={styles.usercard}>
            <div className={styles.ava}>
                <img src="../img/pier-at-a-lake-in-hallstatt-austria.jpg" alt=""/>
                <p>ilovetraveling</p>
            </div>
            <div className={styles.buttonsuser}>
                <button>Забананить</button>
                <button>Разбананить</button>
            </div>
        </div>

        <div className={styles.usercard}>
            <div className={styles.ava}>
                <img src="../img/pier-at-a-lake-in-hallstatt-austria.jpg" alt=""/>
                <p>ilovetraveling</p>
            </div>
            <div className={styles.buttonsuser}>
                <button>Забананить</button>
                <button>Разбананить</button>
            </div>
        </div>


    </div>
  )
}
