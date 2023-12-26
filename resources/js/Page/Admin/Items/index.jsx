import React from 'react'
import styles from './Items.module.css'

export default function Items() {
  return (
    <>
    <div className={styles.categslist}>
        <button>Все посты</button>
                <button>Арт</button>
                <button>Путешествия</button>
                <button>Кругозор</button>
                <button>Арт</button>
                <button>Путешествия555555555</button>
                <button>Кругозор</button>
                <button>Арт11111</button>
                <button>Путешествия</button>
                <button>Кругозор111111111</button>

    </div>
    <div className={styles.container}>
        <div className={styles.new}>
            <div className={styles.top}>
                <h2>Путешествия</h2>
                <div className={styles.usernew}>

                    <p>ilovetraveling</p>
                    <img src="../img/pier-at-a-lake-in-hallstatt-austria.jpg" alt=""/>
                </div>
            </div>
            <div className={styles.foto}>
                <div className={styles.mini}>
                    <img src="../img/close-up-people-traveling-together.jpg" alt=""/>
                    <img src="../img/close-up-people-traveling-together.jpg" alt=""/>
                </div>
                <div className={styles.maxi}>
                    <img src="../img/close-up-people-traveling-together.jpg" alt=""/>
                </div>
            </div>
            <div className={styles.text}>
                <p style={{margin: "1vw 0"}}>12.12.23</p>
                <p style={{marginBottom: "1vw"}}>ребята!! это я, я люблю путешествия!! как у всех дела??? недавно побывала вместе с мужем за границей,
                    а конкретно в норвегии. специально покрасила волосы в рыжий, чтобы слиться с местностью! 5 зарплат
                    своих там оставила за 2 неделе :{'(((('} но экспириенс того стоит, зуб даю!! свежий морозный воздух и
                    прекрасные виды!! красивая страна!!! всем советую!!! всем добра!!!</p>
            </div>
            <div className={styles.butt}>
                <button><img src="../img/icons8-удалить-100.png" alt=""/></button>
            </div>
        </div>
        <div className={styles.new}>
            <div className={styles.top}>
                <h2>Путешествия</h2>
                <div className={styles.usernew}> 

                    <p>ilovetraveling</p>
                    <img src="../img/pier-at-a-lake-in-hallstatt-austria.jpg" alt=""/>
                </div>
            </div>
            <div className={styles.foto}>
                <div className={styles.mini}>
                    <img src="../img/close-up-people-traveling-together.jpg" alt=""/>
                    <img src="../img/close-up-people-traveling-together.jpg" alt=""/>
                </div>
                <div className={styles.maxi}>
                    <img src="../img/close-up-people-traveling-together.jpg" alt=""/>
                </div>
            </div>
            <div className={styles.text}>
                <p style={{margin: "1vw 0"}}>12.12.23</p>
                <p style={{marginBottom: "1vw"}}>ребята!! это я, я люблю путешествия!! как у всех дела??? недавно побывала вместе с мужем за границей,
                    а конкретно в норвегии. специально покрасила волосы в рыжий, чтобы слиться с местностью! 5 зарплат
                    своих там оставила за 2 неделе :{'(((('} но экспириенс того стоит, зуб даю!! свежий морозный воздух и
                    прекрасные виды!! красивая страна!!! всем советую!!! всем добра!!!</p>
            </div>
            <div className={styles.butt}>
                <button><img src="../img/icons8-удалить-100.png" alt=""/></button>
            </div>
        </div>

    </div>
    </>
  )
}
