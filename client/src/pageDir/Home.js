import styles from '../cssDir/home.module.css';
import { useNavigate } from 'react-router-dom';
import csvimg from '../imgDir/csvImg.png'
import oneimg from '../imgDir/oneImg.png'
import React from 'react';

function Home() {
    const movePage = useNavigate();
    function goInput(){
        movePage('/pages/input');
    }
    function goInputAll(){
        movePage('/pages/inputAll');
    }
    return (
        <div className='App'>
            <div className={styles.home_page}>
                <div className={styles.home_wrap}>
                    <div className={styles.home_box}>
                        <section className={styles.top_section}>
                            <div className={styles.home_top}>
                                <div className={styles.home_img_box}>
                                    <img src={oneimg} width={400} height={400} className={styles.home_top_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                </div>
                                <div className={styles.home_text}>
                                    <h1 className={styles.home_top_title}>
                                        하나의 제조 데이터
                                    </h1>
                                    <h1 className={`${styles.home_top_title} ${styles.home_top_panda}`}>
                                        직접 입력
                                    </h1>
                                    <p>하나의 제조 데이터 입력으로</p>
                                    <p>중량 예측 및 칼날 rpm 추천</p>
                                    <div className={styles.home_mem}>
                                        <button className={styles.home_mem_btn_under} onClick={goInput}>직접 입력 하러가기</button>
                                        <button className={styles.home_mem_btn_left} onClick={goInput}><span>직접 입력 하러가기</span></button>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className={styles.bottom_section}>
                        <div className={styles.home_bottom}>
                            <div className={styles.home_text}>
                                <h1 className={styles.home_bottom_title}>
                                    CSV파일을 사용하여
                                </h1>
                                <h1 className={`${styles.home_bottom_title} ${styles.home_bottom_panda}`}>
                                    <a>한번에 입력</a>
                                </h1>
                                <p>여러개의 제조 데이터 입력으로</p>
                                <p>여러 제품 중량 예측 및 칼날 rpm 추천</p>
                                <div className={styles.home_mem}>
                                    <button className={styles.home_mem_btn_under} onClick={goInputAll}>CSV 입력 하러가기</button>
                                    <button className={styles.home_mem_btn} onClick={goInputAll}><span>CSV 입력 하러가기</span></button>
                                </div>
                            </div>
                            <div className={styles.home_img_box}>
                                <img src={csvimg} width={400} height={400} className={styles.home_bottom_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                            </div>
                        </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
