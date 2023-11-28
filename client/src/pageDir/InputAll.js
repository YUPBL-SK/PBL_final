import { useNavigate } from 'react-router-dom';
import styles from "../cssDir/inputAll.module.css";
import axios from "axios";
import { React, useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import img from '../imgDir/product.PNG'
import errimg from '../imgDir/err_product.png'
import nextimg from '../imgDir/next.png'
import ReactFileReader from "react-file-reader";
import MyResponsiveLine from './Graph';

const BackUrl = 'https://pbl-final-yvbcumjjwq-du.a.run.app';
const LocalUrl = 'http://127.0.0.1:5000';
let listSum = 0;    // rpm 변경을 하면서 얻은 중량 총량
let listBeforeSum = 0;  // rpm 변경 하지 않을시 중량 총량
let success = 0;    // rpm 변경 시 양품 갯수
let success2 = 0;    // rpm 변경 안 할 시 양품 갯수
let faile = 0;  // rpm 변경 시 불량품 갯수
let faile2 = 0;  // rpm 변경 안 할 시 불량품 갯수
let faileSum = 0;   // rpm 변경 시 불량품 중량
let faileSum2 = 0;   // rpm 변경 안 할 시 불량품 중량
let data_w = 0;
let data_w2 = 0;
let data_w3 = 0;
let realSum = 0;
let realFaile = 0;
let realSuccess = 0;
let realFaileSum = 0;
let graphData = [
    {
        "id": "real",
        "color": "hsl(125, 70%, 50%)",
        "data": []
    },
    {
        "id": "first-predict",
        "color": "hsl(317, 70%, 50%)",
        "data": []
    },
    {
        "id": "recomend-rpm",
        "color": "hsl(187, 70%, 50%)",
        "data": []
    },
];
function InputAll(){
    const [data, setData] = useState([{}]);
    const [data2, setData2] = useState([{}]);
    const [isData, setIsData] = useState(false);
    const [data_count, setCount] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpen2, setModalOpen2] = useState(false);
    const [modalOpen3, setModalOpen3] = useState(false);
    const [modalOpen4, setModalOpen4] = useState(false);
    const [modalOpen5, setModalOpen5] = useState(false);
    const movePage = useNavigate();

    const handleFileChangeTest = (files) => {    //csv 업로드 테스트
        listSum = 0;
        faile = 0;
        faile2 = 0;
        faileSum = 0;
        faileSum2 = 0;
        data_w = 0;
        data_w2 = 0;
        data_w3 = 0;
        success = 0;
        success2 = 0;
        listBeforeSum = 0;
        realSum = 0;
        realFaile = 0;
        realSuccess = 0;
        realFaileSum = 0;
        graphData = [
            {
                "id": "real",
                "color": "hsl(125, 70%, 50%)",
                "data": []
            },
            {
                "id": "first-predict",
                "color": "hsl(317, 70%, 50%)",
                "data": []
            },
            {
                "id": "recomend-rpm",
                "color": "hsl(187, 70%, 50%)",
                "data": []
            },
        ];
        const read = new FileReader();
        read.onload = function (e) {
            const data_list = read.result.split(/(?:\r\n|\r|\n)/g).slice(1);
            
            // for(const one_data of data_list){
            for(let i = 0; i < data_list.length-1; i++){
                setTimeout(() => {
                    const datas = data_list[i].split(",");
                    // const datas = one_data.split(",");
                    const pv_scale = Number(datas[9]);
                    // console.log(pv_scale)
                    
                    const data = {
                        'E_scr_pv': datas[1],
                        'c_temp_pv': datas[3],
                        'k_rpm_pv': datas[5],
                        'n_temp_pv': datas[7],
                        's_temp_pv': datas[10],
                    };
                    const config = { "Content-Type": 'application/json' };
                    setIsData(false);
                    axios.post(BackUrl + '/predict', data, config)
                        .then((response) => {
                            setIsData(true);
                            setCount(i+1);
                            setData(response.data);
                            if(response.data.rpm_weight != -1 && !response.data.is_rpm_error){ // rpm 변경했고 불량 아님
                                success = success + 1;
                                listSum = listSum + response.data.rpm_weight;
                                data_w = data_w + 3.0;
                                if(!response.data.is_error){    // 변경 안해도 불량 아님
                                    success2 = success2 + 1;
                                    listBeforeSum = listBeforeSum + response.data.predicted_weight;
                                    data_w2 = data_w2 + 3.0;
                                } else{ // 변경 안하면 불량
                                    faile2 = faile2 + 1;
                                    faileSum2 = faileSum2 + response.data.predicted_weight;
                                }
                            }else if(response.data.rpm_weight == -1 && !response.data.is_error){    // rpm 변경 없고 불량 아님
                                success = success + 1;
                                success2 = success2 + 1;
                                listSum = listSum + response.data.predicted_weight;
                                listBeforeSum = listBeforeSum + response.data.predicted_weight;
                                data_w = data_w + 3.0;
                                data_w2 = data_w2 + 3.0;
                            }else if(response.data.rpm_weight != -1 && response.data.is_rpm_error){ // rpm 변경 하고 불량
                                faile = faile + 1;
                                faileSum = faileSum + response.data.predicted_weight;
                                if(response.data.is_error){ // 변경 전에도 불량
                                    faile2 = faile2 + 1;
                                    faileSum2 = faileSum2 + response.data.predicted_weight;
                                } else{ // 변경 안했으면 양품
                                    success2 = success2 + 1;
                                    listBeforeSum = listBeforeSum + response.data.predicted_weight;
                                    data_w2 = data_w2 + 3.0;
                                }
                            }else if(response.data.rpm_weight == -1 && response.data.is_error){ // rpm 변경 없고 불량
                                faile = faile + 1;
                                faile2 = faile2 + 1;
                                faileSum = faileSum + response.data.predicted_weight;
                                faileSum2 = faileSum2 + response.data.predicted_weight;
                            }
                            if(Math.abs(pv_scale - 3.0) > 0.1){
                                realFaile += 1;
                                realFaileSum += pv_scale;
                                setData2({is_error:true, w:pv_scale})
                            }
                            else{
                                realSum += pv_scale;
                                realSuccess += 1;
                                data_w3 += 3.0;
                                setData2({is_error:false, w:pv_scale})
                            }
                            graphData[0].data.push({
                                "x": i+1,
                                "y": pv_scale
                            });
                            graphData[1].data.push({
                                "x": i+1,
                                "y": response.data.predicted_weight
                            });
                            if(response.data.rpm_weight == -1){
                                graphData[2].data.push({
                                    "x": i+1,
                                    "y": response.data.predicted_weight
                                });
                            }
                            else{
                                graphData[2].data.push({
                                    "x": i+1,
                                    "y": response.data.rpm_weight
                                });
                            }
                            openModal4();
                            if(i+1 >= data_list.length-1){
                                setTimeout(() => {
                                    graphData[0].data.sort((n,m)=>n.x - m.x);
                                    graphData[1].data.sort((n,m)=>n.x - m.x);
                                    graphData[2].data.sort((n,m)=>n.x - m.x);
                                    closeModal4();
                                    openModal3();
                                }, (i+1) * 2000)
                            }
                        })
                        .catch(error => {
                            console.log(error)
                        });
                }, i * 2000);
            }
        };
        read.readAsText(files[0]);
    };

    const handleFileChange = (files) => {    //csv 업로드 실제
        listSum = 0;
        faile = 0;
        faile2 = 0;
        faileSum = 0;
        faileSum2 = 0;
        data_w = 0;
        data_w2 = 0;
        data_w3 = 0;
        success = 0;
        success2 = 0;
        listBeforeSum = 0;
        realSum = 0;
        realFaile = 0;
        realSuccess = 0;
        realFaileSum = 0;
        graphData = [
            {
                "id": "first-predict",
                "color": "hsl(317, 70%, 50%)",
                "data": []
            },
            {
                "id": "recomend-rpm",
                "color": "hsl(187, 70%, 50%)",
                "data": []
            },
        ];
        const read = new FileReader();
        
        read.onload = async function (e) {
            const data_list = read.result.split(/(?:\r\n|\r|\n)/g).slice(1);
            let i = 0;
            for await(const one_data of data_list){
            // for(let i = 0; i < data_list.length-1; i++){
                // setTimeout(() => {
                    // const datas = data_list[i].split(",");
                    const datas = one_data.split(",");
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
                    try{
                        const response = await axios.post(BackUrl + '/predict', data, config)
                        // .then((response) => {
                        //     setIsData(true);
                        //     setCount(i+1);
                        //     setData(response.data);
                        //     // setDataLen(dataLen + 1);
                        //     if(response.data.rpm_weight != -1 && !response.data.is_rpm_error){ // rpm 변경했고 불량 아님
                        //         success = success + 1;
                        //         listSum = listSum + response.data.rpm_weight;
                        //         // listBeforeSum = listBeforeSum + response.data.predicted_weight;
                        //         data_w = data_w + 3.0;
                        //         if(!response.data.is_error){    // 변경 안해도 불량 아님
                        //             success2 = success2 + 1;
                        //             listBeforeSum = listBeforeSum + response.data.predicted_weight;
                        //             data_w2 = data_w2 + 3.0;
                        //         } else{ // 변경 안하면 불량
                        //             faile2 = faile2 + 1;
                        //             faileSum2 = faileSum2 + response.data.predicted_weight;
                        //         }
                        //     }else if(response.data.rpm_weight == -1 && !response.data.is_error){    // rpm 변경 없고 불량 아님
                        //         success = success + 1;
                        //         success2 = success2 + 1;
                        //         listSum = listSum + response.data.predicted_weight;
                        //         listBeforeSum = listBeforeSum + response.data.predicted_weight;
                        //         data_w = data_w + 3.0;
                        //         data_w2 = data_w2 + 3.0;
                        //     }else if(response.data.rpm_weight != -1 && response.data.is_rpm_error){ // rpm 변경 하고 불량
                        //         faile = faile + 1;
                        //         faileSum = faileSum + response.data.predicted_weight;
                        //         if(response.data.is_error){ // 변경 전에도 불량
                        //             faile2 = faile2 + 1;
                        //             faileSum2 = faileSum2 + response.data.predicted_weight;
                        //         } else{ // 변경 안했으면 양품
                        //             success2 = success2 + 1;
                        //             listBeforeSum = listBeforeSum + response.data.predicted_weight;
                        //             data_w2 = data_w2 + 3.0;
                        //         }
                        //     }else if(response.data.rpm_weight == -1 && response.data.is_error){ // rpm 변경 없고 불량
                        //         faile = faile + 1;
                        //         faile2 = faile2 + 1;
                        //         faileSum = faileSum + response.data.predicted_weight;
                        //         faileSum2 = faileSum2 + response.data.predicted_weight;
                        //     }
                        //     graphData[0].data.push({
                        //         "x": i+1,
                        //         "y": response.data.predicted_weight
                        //     });
                        //     if(response.data.rpm_weight == -1){
                        //         graphData[1].data.push({
                        //             "x": i+1,
                        //             "y": response.data.predicted_weight
                        //         });
                        //     }
                        //     else{
                        //         graphData[1].data.push({
                        //             "x": i+1,
                        //             "y": response.data.rpm_weight
                        //         });
                        //     }
                        //     // openModal();
                        //     if(i+1 >= data_list.length-1){
                        //         setTimeout(() => {
                        //             graphData[0].data.sort((n,m)=>n.x - m.x);
                        //             graphData[1].data.sort((n,m)=>n.x - m.x);
                        //             // closeModal();
                        //             openModal2();
                        //         }, 0)
                        //     }
                        // })
                        // .catch(error => {
                        //     console.log(error)
                        // });
                        setIsData(true);
                        setCount(i+1);
                        setData(response.data);
                        if(response.data.rpm_weight != -1 && !response.data.is_rpm_error){ // rpm 변경했고 불량 아님
                            success = success + 1;
                            listSum = listSum + response.data.rpm_weight;
                            data_w = data_w + 3.0;
                            if(!response.data.is_error){    // 변경 안해도 불량 아님
                                success2 = success2 + 1;
                                listBeforeSum = listBeforeSum + response.data.predicted_weight;
                                data_w2 = data_w2 + 3.0;
                            } else{ // 변경 안하면 불량
                                faile2 = faile2 + 1;
                                faileSum2 = faileSum2 + response.data.predicted_weight;
                            }
                        }else if(response.data.rpm_weight == -1 && !response.data.is_error){    // rpm 변경 없고 불량 아님
                            success = success + 1;
                            success2 = success2 + 1;
                            listSum = listSum + response.data.predicted_weight;
                            listBeforeSum = listBeforeSum + response.data.predicted_weight;
                            data_w = data_w + 3.0;
                            data_w2 = data_w2 + 3.0;
                        }else if(response.data.rpm_weight != -1 && response.data.is_rpm_error){ // rpm 변경 하고 불량
                            faile = faile + 1;
                            faileSum = faileSum + response.data.predicted_weight;
                            if(response.data.is_error){ // 변경 전에도 불량
                                faile2 = faile2 + 1;
                                faileSum2 = faileSum2 + response.data.predicted_weight;
                            } else{ // 변경 안했으면 양품
                                success2 = success2 + 1;
                                listBeforeSum = listBeforeSum + response.data.predicted_weight;
                                data_w2 = data_w2 + 3.0;
                            }
                        }else if(response.data.rpm_weight == -1 && response.data.is_error){ // rpm 변경 없고 불량
                            faile = faile + 1;
                            faile2 = faile2 + 1;
                            faileSum = faileSum + response.data.predicted_weight;
                            faileSum2 = faileSum2 + response.data.predicted_weight;
                        }
                        graphData[0].data.push({
                            "x": i + 1,
                            "y": response.data.predicted_weight
                        });
                        if (response.data.rpm_weight == -1) {
                            graphData[1].data.push({
                                "x": i + 1,
                                "y": response.data.predicted_weight
                            });
                        }
                        else {
                            graphData[1].data.push({
                                "x": i + 1,
                                "y": response.data.rpm_weight
                            });
                        }
                        openModal();
                        if (i + 1 >= data_list.length - 1) {
                            // setTimeout(() => {
                            //     graphData[0].data.sort((n, m) => n.x - m.x);
                            //     graphData[1].data.sort((n, m) => n.x - m.x);
                            //     closeModal();
                            //     openModal2();
                            // }, 0)
                            graphData[0].data.sort((n, m) => n.x - m.x);
                            graphData[1].data.sort((n, m) => n.x - m.x);
                            closeModal();
                            openModal2();
                        }
                        i += 1;
                    }catch(err){
                        console.log(err);
                    }
                // }, 0);
            }
        };
        read.readAsText(files[0]);
    };
    
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
    const openModal2 = () => {
        setModalOpen2(true);
    }
    const closeModal2 = () => {
        setModalOpen2(false);
        openModal5();
    }
    const openModal3 = () => {
        setModalOpen3(true);
    }
    const closeModal3 = () => {
        setModalOpen3(false);
        openModal5();
    }
    const openModal4 = () => {
        setModalOpen4(true);
    }
    const closeModal4 = () => {
        setModalOpen4(false);
    }
    const openModal5 = () => {
        setModalOpen5(true);
    }
    const closeModal5 = () => {
        setModalOpen5(false);
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
                                    <ReactFileReader handleFiles={handleFileChangeTest} fileTypes={".csv"}>
                                        <>
                                        <button className={styles.test_btn_under}>Upload CSV to Test</button>
                                        <button className={styles.test_btn}><span>Upload CSV to Test</span></button>
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
                <div className={styles.result_wrap}>
                    <div className={styles.result_title}>
                        <h2>{data_count}번째 제품</h2>
                        <div>현재까지 양품 : {success}개</div>
                        <div>현재까지 중량 합 : {Math.round(listSum*1000)/1000}g(loss : {(Math.round((listSum - data_w)*1000000)/1000000)}g)</div>
                        <div>현재까지 불량품 : {faile}개( 총 {faileSum}g )</div>
                    </div>
                    <div className={styles.result_box}>
                        {
                        (typeof data.predicted_weight === 'undefined') ? 
                            <p>loding...</p>
                         : data.recommended_rpm !== -1 ? 
                            <div className={styles.result_boxR}>
                                <div className={styles.result_div}>
                                    {data.is_error ? 
                                    <img src={errimg} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                    :<img src={img} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                    }
                                    <p> - </p>
                                    <h2>기존 예상 중량 : {data.predicted_weight}g</h2>
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
                                            <h2>RPM 변경 후 <br></br>예상 중량 : {data.rpm_weight}g</h2>
                                            <h3>중량 차이 : {Math.round(Math.abs(data.predicted_weight - data.rpm_weight)*1000)/1000}g</h3>
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
                                    <h2>예상 중량 : {data.predicted_weight}g</h2>
                                    <p> - </p>
                                </div>
                                <></>
                                <></>
                            </div>
                        }
                    </div>
                </div>
                :<></>}
            </Modal>
            <Modal
                isOpen={modalOpen4}
                onRequestClose={closeModal4}
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
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 30,
                        textAlign: 'center',
                    },
                }}>
                    {isData ? 
                <div className={styles.result_wrap}>
                    <div className={styles.result_title}>
                        <h2>{data_count}번째 제품</h2>
                        <div>현재까지 양품 : {success}개</div>
                        <div>현재까지 중량 합 : {Math.round(listSum*1000)/1000}g(loss : {(Math.round((listSum - data_w)*1000000)/1000000)}g)</div>
                        <div>현재까지 불량품 : {faile}개( 총 {faileSum}g )</div>
                    </div>
                    <div className={styles.result_box}>
                        {(typeof data.predicted_weight === 'undefined') ? (
                            <p>loding...</p>
                        ) : data.recommended_rpm !== -1 ? 
                            <div className={styles.result_boxR}>
                                <div className={styles.result_div}>
                                    {data2.is_error ? 
                                    <img src={errimg} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                    :<img src={img} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                    }
                                    <p> - </p>
                                    <h2>실제 중량 : {data2.w}g</h2>
                                    <h2>모델 예측 중량 :<br></br>{data.predicted_weight}g( {Math.round((data.predicted_weight - data2.w)*1000)/1000}g )</h2>
                                </div>
                                <img src={nextimg} width={200} height={200} className={styles.next_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                <div className={styles.result_div}>
                                    {data.is_error ? 
                                    <img src={errimg} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                    :<img src={img} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                    }
                                    <div>
                                        <p>추천 칼날 RPM : {data.recommended_rpm}</p>
                                        <h2>RPM 변경 후 <br></br>예상 중량 : {data.rpm_weight}g</h2>
                                        <h3>중량 차이 : {Math.round(Math.abs(data2.w - data.rpm_weight)*1000)/1000}g</h3>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className={styles.result_boxR}>
                                <div className={styles.result_div}>
                                    {data2.is_error ? 
                                    <img src={errimg} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                    :<img src={img} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                    }
                                    <p> - </p>
                                    <h2>실제 중량 : {data2.w}g</h2>
                                    <h2>모델 예측 중량 :<br></br>{data.predicted_weight}g( {Math.round((data.predicted_weight - data2.w)*1000)/1000}g )</h2>
                                </div>
                                <img src={nextimg} width={200} height={200} className={styles.next_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                <div className={styles.result_div}>
                                    {data.is_error ? 
                                    <img src={errimg} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                    :<img src={img} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                                    }
                                    <div>
                                        <p>칼날 RPM 유지</p>
                                        <h2>예상 중량 : {data.predicted_weight}g</h2>
                                        <h3>중량 차이 : {Math.round(Math.abs(data2.w - data.predicted_weight)*1000)/1000}g</h3>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                :<></>}
            </Modal>
            <Modal
                isOpen={modalOpen2}
                onRequestClose={closeModal2}
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
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 30,
                        textAlign: 'center',
                    },
                }}>
                <div className={styles.result_wrap}>
                <div className={styles.result_title}><h2>{success + faile}개의 제품 제조 완료</h2></div>
                    <div className={styles.result_boxR}>
                        <div className={styles.result_div}>
                            <div><h2>RPM 변경 안했을 시 양품 :<br></br>{success2}개</h2></div>
                            <div><h2>RPM 변경 안했을 시 양품 중량 합 :<br></br>{Math.round(listBeforeSum*1000)/1000}g</h2></div>
                            <div><h2>RPM 변경 안했을 시 loss :<br></br>{(Math.round((listBeforeSum - data_w2)*1000000)/1000000)}g</h2></div>
                            <div><h3>RPM 변경 안했을 시 불량품 :<br></br>{faile2}개</h3></div>
                            <div><h3>RPM 변경 안했을 시 불량품 중량 loss :<br></br>{faileSum2}g</h3></div>
                        </div>
                        <img src={nextimg} width={200} height={200} className={styles.next_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                        <div className={styles.result_div}>
                            <div><h2>최종 양품 :<br></br>{success}개{success > success2 ? <>(+{success - success2}개)</>: <></>}</h2></div>
                            <div><h2>최종 양품 중량 합 :<br></br>{Math.round(listSum*1000)/1000}g{Math.round(listSum*1000)/1000 < Math.round(listBeforeSum*1000)/1000 ?
                             <>({Math.round((listSum - listBeforeSum)*1000)/1000}g)</>: 
                             <></>}</h2></div>
                            <div><h2>최종 loss :<br></br>{(Math.round((listSum - data_w)*1000000)/1000000)}g
                            {(Math.round((listSum - data_w)*1000000)/1000000) < (Math.round((listBeforeSum - data_w2)*1000000)/1000000) ?
                             <>({(Math.round((listSum - data_w - listBeforeSum + data_w2)*1000000)/1000000)}g)</>: 
                             <></>}</h2></div>
                            <div><h3>최종 불량품 :<br></br>{faile}개{faile < faile2 ? <>({faile - faile2}개)</>: <></>}</h3></div>
                            <div><h3>최종 불량품 중량 loss :<br></br>{faileSum}g{faileSum < faileSum2 ? <>({faileSum - faileSum2}개)</>: <></>}</h3></div>
                        </div>
                        
                    </div>
                    <div className={styles.input_btn_wrap_div}>
                    <div className={styles.input_btn_wrap}>
                        <button className={styles.cancel_btn_under} onClick={closeModal2}>OK</button>
                        <button className={styles.cancel_btn} onClick={closeModal2}><span>OK</span></button>
                    </div>
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={modalOpen3}
                onRequestClose={closeModal3}
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
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 30,
                        textAlign: 'center',
                    },
                }}>
                <div className={styles.result_wrap}>
                <div className={styles.result_title}><h2>{success + faile}개의 제품 제조 완료</h2></div>
                    <div className={styles.result_box3}>
                        <div className={styles.result_div}>
                            <div><h2>실제 양품 :<br></br>{realSuccess}개</h2></div>
                            <div><h2>실제 양품 중량 합 :<br></br>{Math.round(realSum*1000)/1000}g</h2></div>
                            <div><h2>실제 loss :<br></br>{(Math.round((realSum - data_w3)*1000000)/1000000)}g</h2></div>
                            <div><h3>실제 불량품 :<br></br>{realFaile}개</h3></div>
                            <div><h3>실제 불량품 중량 loss :<br></br>{realFaileSum}g</h3></div>
                        </div>
                        <img src={nextimg} width={200} height={200} className={styles.next_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                        <div className={styles.result_div}>
                        <div><h2>RPM 변경 안했을 시 양품 :<br></br>{success2}개</h2></div>
                            <div><h2>RPM 변경 안했을 시 양품 중량 합 :<br></br>{Math.round(listBeforeSum*1000)/1000}g</h2></div>
                            <div><h2>RPM 변경 안했을 시 loss :<br></br>{(Math.round((listBeforeSum - data_w2)*1000000)/1000000)}g</h2></div>
                            <div><h3>RPM 변경 안했을 시 불량품 :<br></br>{faile2}개</h3></div>
                            <div><h3>RPM 변경 안했을 시 불량품 중량 loss :<br></br>{faileSum2}g</h3></div>
                        </div>
                        <img src={nextimg} width={200} height={200} className={styles.next_img} alt={'이미지를 불러오는데 실패하였습니다.'}/>
                        <div className={styles.result_div}>
                            <div><h2>최종 양품 :<br></br>{success}개{success > realSuccess ? <>(+{success - realSuccess}개)</>: <></>}</h2></div>
                            <div><h2>최종 양품 중량 합 :<br></br>{Math.round(listSum*1000)/1000}g{Math.round(listSum*1000)/1000 < Math.round(realSum*1000)/1000 ?
                             <>({Math.round((listSum - realSum)*1000)/1000}g)</>: 
                             <></>}</h2></div>
                            <div><h2>최종 loss :<br></br>{(Math.round((listSum - data_w)*1000000)/1000000)}g
                            {(Math.round((listSum - data_w)*1000000)/1000000) < (Math.round((realSum - data_w3)*1000000)/1000000) ?
                             <>({(Math.round((listSum - data_w - realSum + data_w3)*1000000)/1000000)}g)</>: 
                             <></>}</h2></div>
                            <div><h3>최종 불량품 :<br></br>{faile}개{faile < realFaile ? <>({faile - realFaile}개)</>: <></>}</h3></div>
                            <div><h3>최종 불량품 중량 loss :<br></br>{faileSum}g{faileSum < realFaileSum ? <>({faileSum - realFaileSum}개)</>: <></>}</h3></div>
                        </div>
                        
                    </div>
                    <div className={styles.input_btn_wrap_div}>
                    <div className={styles.input_btn_wrap}>
                        <button className={styles.cancel_btn_under} onClick={closeModal3}>OK</button>
                        <button className={styles.cancel_btn} onClick={closeModal3}><span>OK</span></button>
                    </div>
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={modalOpen5}
                onRequestClose={closeModal5}
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
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 30,
                        textAlign: 'center',
                    },
                }}>
                <div className={styles.result_wrap}>
                    <MyResponsiveLine data={graphData}></MyResponsiveLine>
                    <div className={styles.input_btn_wrap_div}>
                        <div className={styles.input_btn_wrap}>
                            <button className={styles.cancel_btn_under} onClick={closeModal5}>OK</button>
                            <button className={styles.cancel_btn} onClick={closeModal5}><span>OK</span></button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
export default InputAll;