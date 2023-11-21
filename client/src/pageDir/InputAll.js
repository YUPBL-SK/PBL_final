import { useNavigate } from 'react-router-dom';
import styles from "../cssDir/inputAll.module.css";
import axios from "axios";
import { React, useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import img from '../imgDir/product.PNG'
import errimg from '../imgDir/err_product.png'
import nextimg from '../imgDir/next.png'
import ReactFileReader from "react-file-reader";

const num_regex = /^\d{0,}\.{0,1}\d{1,}$/i;

function InputAll(){
    const [data, setData] = useState([{}]);
    const [isData, setIsData] = useState(false);
    const [data_count, setCount] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const movePage = useNavigate();

    const handleFileChange = (files) => {    //csv 업로드
        const read = new FileReader();
        // when readAsText will invoke, onload() method on the read object will execute.
        read.onload = function (e) {
            // perform some operations with read data
            const data_list = read.result.split(/(?:\r\n|\r|\n)/g).slice(1);
            
            // for(const one_data of data_list){
            for(let i = 0; i < data_list.length-1; i++){
                setTimeout(() => {
                    const datas = data_list[i].split(",");
                    // const datas = one_data.split(",");
                    const pv_scale = datas[9];
                    const data = {
                        'E_scr_pv': datas[1],
                        'c_temp_pv': datas[3],
                        'k_rpm_pv': datas[5],
                        'n_temp_pv': datas[7],
                        's_temp_pv': datas[10],
                    };
                    const config = { "Content-Type": 'application/json' };
                    setIsData(false);
                    axios.post('http://127.0.0.1:5000/predict', data, config)
                        .then((response) => {
                            setIsData(true);
                            setCount(i+1);
                            setData(response.data);
                            openModal();
                        })
                        .catch(error => {
                            console.log(error)
                        });
                }, i * 2000)
            }
        };
        // Invoking the readAsText() method by passing the uploaded file as a parameter
        read.readAsText(files[0]);
    };


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
    
    function goHome(){
        movePage('/');
        window.location.reload();
    }
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
                        <h1 className={styles.input_head}>Manufacturing multiple products</h1>
                        <div className={styles.input_form}>
                            <div>
                                <div className={styles.input_btn_wrap}>
                                    <ReactFileReader handleFiles={handleFileChange} fileTypes={".csv"}>
                                        <>
                                        <button className={styles.home_btn_under}>Upload CSV to Test</button>
                                        <button className={styles.home_btn}><span>Upload CSV to Test</span></button>
                                        </>
                                    </ReactFileReader>
                                </div>
                                <div className={styles.input_btn_wrap}>
                                    <ReactFileReader handleFiles={handleFileChange} fileTypes={".csv"}>
                                        <>
                                        <button className={styles.input_btn_under}>Upload CSV to Manufacture</button>
                                        <button className={styles.input_btn}><span>Upload CSV to Manufacture</span></button>
                                        </>
                                    </ReactFileReader>
                                </div>
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
                        marginTop:'10px',
                        height: '80vh',
                        backgroundColor: 'whitesmoke',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 30,
                        textAlign: 'center',
                    },
                }}>
                    {isData ? 
                <div>
                    <div>{data_count}번째 제품</div>
                    <div>
                        {(typeof data.predicted_weight === 'undefined') ? (
                            <p>loding...</p>
                        ) : (
                            <div className={styles.result_box}>
                                <div>
                                    {data.is_error ? 
                                    <img src={errimg} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                    :<img src={img} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                    }
                                    <p> - </p>
                                    {data.recommended_rpm !== -1 ?
                                    <h2>기존 예상 중량 : {data.predicted_weight}</h2>
                                    :<h2>예상 중량 : {data.predicted_weight}</h2>
                                    }
                                    <p> - </p>
                                </div>
                                {data.recommended_rpm !== -1 ? 
                                    <img src={nextimg} width={200} height={200} className={styles.next_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                    :<></>
                                }
                                {data.recommended_rpm !== -1 ?
                                    <div>
                                        {data.is_rpm_error ? 
                                        <img src={errimg} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                        :<img src={img} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                        }
                                        {data.recommended_rpm === -1 ? <p>칼날 RPM 유지</p> : 
                                        <div>
                                            <p>추천 칼날 RPM : {data.recommended_rpm}</p>
                                            <h2>RPM 변경 후 예상 중량 : {data.rpm_weight}</h2>
                                            <h3>중량 차이 : {Math.round(Math.abs(data.predicted_weight - data.rpm_weight)*1000)/1000}</h3>
                                        </div>
                                        }
                                    </div>:
                                    <></>
                                }
                            </div>
                        )}
                    </div>
                    <div className={styles.input_btn_wrap}>
                        <button className={styles.cancel_btn_under} onClick={closeModal}>OK</button>
                        <button className={styles.cancel_btn} onClick={closeModal}><span>OK</span></button>
                    </div>
                </div>
                :<></>}
            </Modal>
            
        </div>
    );
}
export default InputAll;