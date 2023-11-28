import { useNavigate } from 'react-router-dom';
import styles from "../cssDir/input.module.css";
import axios from "axios";
import { React, useState, useEffect } from 'react';
import Modal from 'react-modal';
import img from '../imgDir/product.PNG'
import errimg from '../imgDir/err_product.png'
import nextimg from '../imgDir/next.png'

const num_regex = /^\d{0,}\.{0,1}\d{1,}$/i;

function Input() {
    const [data, setData] = useState([{}]);
    const [modalOpen, setModalOpen] = useState(false);
    const movePage = useNavigate();
    
    let [E_scr_pv, setEscrpv] = useState('');
    let [c_temp_pv, setCtemppv] = useState('');
    let [k_rpm_pv, setKrpmpv] = useState('');
    let [n_temp_pv, setNtemppv] = useState('');
    let [s_temp_pv, setStemppv] = useState('');

    // useEffect(() => {
    //     const data = {
    //         'E_scr_pv': 8,
    //         'c_temp_pv': 69.6,
    //         'k_rpm_pv': 189,
    //         'n_temp_pv': 67.2,
    //         's_temp_pv': 67.1,
    //     };
    //     const config = { "Content-Type": 'application/json' };
    //     axios.post('http://127.0.0.1:5000/predict', data, config)
    //         .then((response) => {
    //             console.log(response)
    //             setData(response.data);
    //         })
    //         .catch(error => {
    //             console.log(error)
    //         });
    // }, [])
    
    const changeScrrpv = (e) =>{
        const value = e.target.value;
        setEscrpv(value);
    }
    const changeCtemppv = (e) =>{
        const value = e.target.value;
        setCtemppv(value);
    }
    const changeKrpmpv = (e) =>{
        const value = e.target.value;
        setKrpmpv(value);
    }
    const changeNtemppv = (e) =>{
        const value = e.target.value;
        setNtemppv(value);
    }
    const changeStemppv = (e) =>{
        const value = e.target.value;
        setStemppv(value);
    }
    const num_error = '***숫자를 입력해 주세요.***';
    
    function goHome(){
        movePage('/');
        window.location.reload();
    }
    const input = (e) => {
        e.preventDefault();
        if (!num_regex.test(E_scr_pv)) {
            alert('정확한 E_scr_pv를 입력해 주세요.');
            return false;
        }
        if (E_scr_pv === '') {
            alert('E_scr_pv를 입력해 주세요.');
            return false;
        }
        if (!num_regex.test(c_temp_pv)) {
            alert('정확한 c_temp_pv를 입력해 주세요.');
            return false;
        }
        if (c_temp_pv === '') {
            alert('c_temp_pv를 입력해 주세요.');
            return false;
        }
        if (!num_regex.test(k_rpm_pv)) {
            alert('정확한 k_rpm_pv를 입력해 주세요.');
            return false;
        }
        if (k_rpm_pv === '') {
            alert('k_rpm_pv를 입력해 주세요.');
            return false;
        }
        if (!num_regex.test(n_temp_pv)) {
            alert('정확한 n_temp_pv를 입력해 주세요.');
            return false;
        }
        if (n_temp_pv === '') {
            alert('n_temp_pv를 입력해 주세요.');
            return false;
        }
        if (!num_regex.test(s_temp_pv)) {
            alert('정확한 s_temp_pv를 입력해 주세요.');
            return false;
        }
        if (s_temp_pv === '') {
            alert('s_temp_pv를 입력해 주세요.');
            return false;
        }
        // const data = {
        //     'E_scr_pv': 8,
        //     'c_temp_pv': 69.6,
        //     'k_rpm_pv': 189,
        //     'n_temp_pv': 67.2,
        //     's_temp_pv': 67.1,
        // };
        const data = {
            'E_scr_pv': E_scr_pv,
            'c_temp_pv': c_temp_pv,
            'k_rpm_pv': k_rpm_pv,
            'n_temp_pv': n_temp_pv,
            's_temp_pv': s_temp_pv,
        };
        const config = { "Content-Type": 'application/json' };
        axios.post('https://pbl-final-yvbcumjjwq-du.a.run.app/predict', data, config)
            .then((response) => {
                setData(response.data);
                openModal();
            })
            .catch(error => {
                console.log(error)
            });
    }
    const handleOnKeyPress = e => {
        if (e.key === 'Enter') {
            input(e); // Enter 입력이 되면 클릭 이벤트 실행
        }
    };
    const openModal = () => {
        setModalOpen(true);
    }
    const closeModal = () => {
        setModalOpen(false);
    }
    return (
        <div className={styles.App}>
            <div className={styles.input_page}>
                <div className={styles.input_wrap}>
                    <div className={styles.input_box}>
                        <h1 className={styles.input_head}>Manufacturing A Single Product</h1>
                        <div className={styles.input_form}>
                            <div>
                                <form name='input_form' id='input_form' method='post'>
                                    <input type='text' className={styles.input} placeholder='E_scr_pv' name='E_scr_pv' onChange={changeScrrpv} value={E_scr_pv} onKeyDown={handleOnKeyPress}></input>
                                    {!num_regex.test(E_scr_pv) && E_scr_pv !== '' ? <div className={styles.error_message}>{num_error}</div> : <div className={styles.error_message}></div>}
                                    <input type='text' className={styles.input} placeholder='c_temp_pv' name='c_temp_pv' onChange={changeCtemppv} value={c_temp_pv} onKeyDown={handleOnKeyPress}></input>
                                    {!num_regex.test(c_temp_pv) && c_temp_pv !== '' ? <div className={styles.error_message}>{num_error}</div> : <div className={styles.error_message}></div>}
                                    <input type='text' className={styles.input} placeholder='k_rpm_pv' name='k_rpm_pv' onChange={changeKrpmpv} value={k_rpm_pv} onKeyDown={handleOnKeyPress}></input>
                                    {!num_regex.test(k_rpm_pv) && k_rpm_pv !== '' ? <div className={styles.error_message}>{num_error}</div> : <div className={styles.error_message}></div>}
                                    <input type='text' className={styles.input} placeholder='n_temp_pv' name='n_temp_pv' onChange={changeNtemppv} value={n_temp_pv} onKeyDown={handleOnKeyPress}></input>
                                    {!num_regex.test(n_temp_pv) && n_temp_pv !== '' ? <div className={styles.error_message}>{num_error}</div> : <div className={styles.error_message}></div>}
                                    <input type='text' className={styles.input} placeholder='s_temp_pv' name='s_temp_pv' onChange={changeStemppv} value={s_temp_pv} onKeyDown={handleOnKeyPress}></input>
                                    {!num_regex.test(s_temp_pv) && s_temp_pv !== '' ? <div className={styles.error_message}>{num_error}</div> : <div className={styles.error_message}></div>}
                                    <div className={styles.input_btn_wrap}>
                                        <button className={styles.input_btn_under} onClick={input}>Manufacturing</button>
                                        <button className={styles.input_btn} onClick={input}><span>Manufacturing</span></button>
                                    </div>
                                </form>
                            </div>
                            <div className={styles.input_btn_wrap}>
                                <button type="button" className={styles.home_btn_under} onClick={goHome}>Go Back Home</button>
                                <button type="button" className={styles.home_btn} onClick={goHome}><span>Go Back Home</span></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalOpen}
                onRequestClose={closeModal}
                // onClick={closeExitChatModal}
                ariaHideApp={false}
                style={{
                    content: {
                        margin: '0 auto',
                        height: '80vh',
                        backgroundColor: 'whitesmoke',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        zIndex: 30,
                        textAlign: 'center',
                    },
                }}>
                <div className={styles.result_wrap}>
                    <div className={styles.result_title}><h2>제조 결과</h2></div>
                    <div className={styles.result_box}>
                        {(typeof data.predicted_weight === 'undefined') ? (
                            <p>loding...</p>
                        ) : data.recommended_rpm !== -1 ? 
                            <div className={styles.result_boxR}>
                                <div className={styles.result_div}>
                                    {data.is_error ? 
                                    <img src={errimg} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                    :<img src={img} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                    }
                                    <p> - </p>
                                    <h2>기존 예상 중량 : {data.predicted_weight}</h2>
                                    <p> - </p>
                                </div>
                                <img src={nextimg} width={200} height={200} className={styles.next_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                <div className={styles.result_div}>
                                        {data.is_rpm_error ? 
                                        <img src={errimg} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                        :<img src={img} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                        }
                                        <div>
                                            <p>추천 칼날 RPM : {data.recommended_rpm}</p>
                                            <h2>RPM 변경 후 예상 중량 : {data.rpm_weight}</h2>
                                            <h3>중량 차이 : {Math.round(Math.abs(data.predicted_weight - data.rpm_weight)*1000)/1000}</h3>
                                        </div>
                                    </div>
                            </div>
                            :
                            <div className={styles.result_boxN}>
                                <div className={styles.result_div}>
                                    {data.is_error ? 
                                    <img src={errimg} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                    :<img src={img} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                    }
                                    <p> - </p>
                                    <h2>예상 중량 : {data.predicted_weight}</h2>
                                    <p> - </p>
                                </div>
                                <></>
                                <></>
                            </div>
                        }
                    </div>
                    <div className={styles.input_btn_wrap_div}>
                    <div className={styles.input_btn_wrap}>
                        <button className={styles.cancel_btn_under} onClick={closeModal}>OK</button>
                        <button className={styles.cancel_btn} onClick={closeModal}><span>OK</span></button>
                    </div>
                    </div>
                </div>
            </Modal>
            
        </div>
    );
}

export default Input;
