import { useNavigate } from 'react-router-dom';
import styles from "../cssDir/inputAll.module.css";
import axios from "axios";
import { React, useState } from 'react';
import Modal from 'react-modal';
import img from '../imgDir/product.PNG'
import errimg from '../imgDir/err_product.png'
import nextimg from '../imgDir/next.png'
import ReactFileReader from "react-file-reader";
import MyResponsiveLine from './Graph';

let success = 0;        // rpm 변경 시 양품 갯수
let success2 = 0;       // rpm 변경 안 할 시 양품 갯수
let realSuccess = 0;    // 실제 값의 양품 갯수

let listSum = 0;        // rpm 변경을 하면서 얻은 양품 중량
let listBeforeSum = 0;  // rpm 변경 하지 않을시 양품 중량
let realSum = 0;        // 실제 값의 양품 중량

let faile = 0;          // rpm 변경 시 불량품 갯수
let faile2 = 0;         // rpm 변경 안 할 시 불량품 갯수
let realFaile = 0;      // 실제 값의 불량품 갯수

let faileSum = 0;       // rpm 변경 시 불량품 중량
let faileSum2 = 0;      // rpm 변경 안 할 시 불량품 중량
let realFaileSum = 0;   // 실제 값의 불량품 중량

let data_w = 0;         // rpm 변경 시 양품당 3.0g일때 양품 전체의 무게(목표 치)
let data_w2 = 0;        // rpm 변경 안할 시 양품당 3.0g일때 양품 전체의 무게(목표 치)
let data_w3 = 0;        // 실제 값의 양품당 3.0g일때 양품 전체의 무게(목표 치)

let graphData = [   // 그래프에 들어갈 데이터.
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

function InputAll() {
    const BackUrl = 'https://pbl-final-yvbcumjjwq-du.a.run.app';    // 배포 서버로 실행할 때 주소
    const LocalUrl = 'http://127.0.0.1:5000';   // 로컬로 실행할 때 주소
    const [data, setData] = useState([{}]);                 // 서버에서 받아온 중량 예측 데이터
    const [data2, setData2] = useState([{}]);               // 실제 중량 데이터
    const [isData, setIsData] = useState(true);             // 모달 창의 애니메이션 효과를 위한 데이터. true일 경우 화면 출력 상태
    const [data_count, setCount] = useState(0);             // 전체 예측 데이터의 갯수
    const [modalOpen, setModalOpen] = useState(false);      // 실제 입력 진행 모달 창 상태
    const [modalOpen2, setModalOpen2] = useState(false);    // 실제 입력 결과 모달 창 상태
    const [modalOpen3, setModalOpen3] = useState(false);    // 테스트 입력 진행 모달 창 상태
    const [modalOpen4, setModalOpen4] = useState(false);    // 테스트 입력 결과 모달 창 상태
    const [modalOpen5, setModalOpen5] = useState(false);    // 그래프 모달 창 상태

    const promiseSetTimeoutInputCSV = (timeToDelay, count, data_list, isTest) => {
        if(count == 0){
            timeToDelay = 0;
        }
        return new Promise((resolve, reject) => {
            setTimeout(async (i, data_list, isTest) => {  // setTimeout으로 딜레이를 주어 실행
                const datas = data_list[i].split(",");
                const pv_scale = Number(datas[9]);  // 9번 인덱스는 실제 중량
                const data = {  // request 데이터
                    'E_scr_pv': datas[1],
                    'c_temp_pv': datas[3],
                    'k_rpm_pv': datas[5],
                    'n_temp_pv': datas[7],
                    's_temp_pv': datas[10],
                };
                const config = { "Content-Type": 'application/json' };
                // if(isTest){
                //     setIsData(isData => {   // 비동기인 useState를 동기처럼 사용하기 위해 함수형 업데이트 사용
                //         return false;
                //     });
                // }
                try {
                    // if(isTest){
                    //     setIsData(isData => {   // 비동기인 useState를 동기처럼 사용하기 위해 함수형 업데이트 사용
                    //         return false;
                    //     });
                    // }
                    const response = await axios.post(BackUrl + '/predict', data, config) // 중량 예측 및 DB 등록
                    if(isTest){
                        setIsData(isData => {   // 비동기인 useState를 동기처럼 사용하기 위해 함수형 업데이트 사용
                            return false;
                        });
                    }
                    if(isTest){
                        setIsData(isData => {   // 비동기인 useState를 동기처럼 사용하기 위해 함수형 업데이트 사용
                            return true;        // 모달 출력
                        });
                    }
                    setCount(i + 1);          // 제조 데이터 수 변경
                    setData(response.data); // 데이터 변경
                    if (response.data.rpm_weight != -1 && !response.data.is_rpm_error) { // rpm 변경했고 불량 아닌 경우
                        success = success + 1;                          // rpm 변경 양품 갯수 증가
                        listSum = listSum + response.data.rpm_weight;   // rpm 변경 양품 중량 증가
                        data_w = data_w + 3.0;                          // rpm 변경 목표 중량 증가
                        if (!response.data.is_error) {    // 변경 안해도 불량 아닌 경우
                            success2 = success2 + 1;                                        // rpm 변경 안했을 때 양품 갯수 증가
                            listBeforeSum = listBeforeSum + response.data.predicted_weight; // rpm 변경 안했을 때 양품 중량 증가
                            data_w2 = data_w2 + 3.0;                                        // rpm 변경 안했을 때 목표 중량 증가
                        } else { // 변경 안하면 불량인 경우
                            faile2 = faile2 + 1;                                    // rpm 변경 안했을 때 불량품 중량 증가
                            faileSum2 = faileSum2 + response.data.predicted_weight; // rpm 변경 안했을 때 불량품 중량 증가
                        }
                    } else if (response.data.rpm_weight == -1 && !response.data.is_error) {    // rpm 변경 없고 불량 아닌 경우

                        success = success + 1;                                          // rpm 변경 양품 갯수 증가
                        success2 = success2 + 1;                                        // rpm 변경 안했을 때 양품 갯수 증가

                        listSum = listSum + response.data.predicted_weight;             // rpm 변경 양품 중량 증가
                        listBeforeSum = listBeforeSum + response.data.predicted_weight; // rpm 변경 안했을 때 양품 중량 증가

                        data_w = data_w + 3.0;                                          // rpm 변경 목표 중량 증가
                        data_w2 = data_w2 + 3.0;                                        // rpm 변경 안했을 때 목표 중량 증가

                    } else if (response.data.rpm_weight != -1 && response.data.is_rpm_error) { // rpm 변경 하고 불량
                        faile = faile + 1;                                      // rpm 변경 불량품 갯수 증가
                        faileSum = faileSum + response.data.predicted_weight;   // rpm 변경 불량품 중량 증가
                        if (response.data.is_error) { // 변경 전에도 불량인 경우
                            faile2 = faile2 + 1;                                    // rpm 변경 안했을 때 불량품 갯수 증가
                            faileSum2 = faileSum2 + response.data.predicted_weight; // rpm 변경 안했을 때 불량품 중량 증가
                        } else { // 변경 안했으면 양품인 경우
                            success2 = success2 + 1;                                        // rpm 변경 안했을 때 양품 갯수 증가
                            listBeforeSum = listBeforeSum + response.data.predicted_weight; // rpm 변경 안했을 때 양품 중량 증가
                            data_w2 = data_w2 + 3.0;                                        // rpm 변경 안했을 때 목표 중량 증가
                        }
                    } else if (response.data.rpm_weight == -1 && response.data.is_error) { // rpm 변경 없고 불량인 경우
                        faile = faile + 1;                                      // rpm 변경 불량품 갯수 증가
                        faile2 = faile2 + 1;                                    // rpm 변경 안했을 때 불량품 갯수 증가
                        faileSum = faileSum + response.data.predicted_weight;   // rpm 변경 불량품 중량 증가
                        faileSum2 = faileSum2 + response.data.predicted_weight; // rpm 변경 안했을 때 불량품 중량 증가
                    }
                    if (isTest) { // 테스트인 경우 실제 데이터 추가
                        if (Math.abs(pv_scale - 3.0) > 0.1) { // 실제 중량이 불량품인 경우
                            realFaile += 1;                         // 실제 불량품 갯수 증가
                            realFaileSum += pv_scale;               // 실제 풀량품 중량 증가
                            setData2({ is_error: true, w: pv_scale })   // 실제 데이터 설정(불량품)
                        }
                        else {   // 실제 중량이 양품인 경우
                            realSum += pv_scale;                    // 실제 양품 중량 증가
                            realSuccess += 1;                       // 실제 양품 갯수 증가
                            data_w3 += 3.0;                         // 실제 양품 목표 중량 증가
                            setData2({ is_error: false, w: pv_scale })  // 실제 데이터 설정(양품)
                        }
                    }
                    // 그래프 데이터에 실제 데이터, rpm 변경 전 데이터, rpm 변경 데이터 추가
                    let predictIndex = 0;
                    if (isTest) {
                        predictIndex = 1;
                        graphData[0].data.push({
                            "x": i + 1,
                            "y": pv_scale
                        });
                    }
                    graphData[predictIndex].data.push({
                        "x": i + 1,
                        "y": response.data.predicted_weight
                    });
                    if (response.data.rpm_weight == -1) { // rpm 변경하지 않은 경우 rpm 변경 전 중량이 rpm 변경 중량과 같음
                        graphData[predictIndex + 1].data.push({
                            "x": i + 1,
                            "y": response.data.predicted_weight
                        });
                    }
                    else {
                        graphData[predictIndex + 1].data.push({
                            "x": i + 1,
                            "y": response.data.rpm_weight
                        });
                    }
                    // setIsData(isData => {   // 비동기인 useState를 동기처럼 사용하기 위해 함수형 업데이트 사용
                    //     return false;
                    // });
                    // setIsData(isData => {   // 비동기인 useState를 동기처럼 사용하기 위해 함수형 업데이트 사용
                    //     return true;        // 모달 출력
                    // });
                    // 테스트 입력 진행 모달 창 열기
                    if(isTest){
                        openModal3();
                    }else{
                        openModal();
                    }

                    if (i + 1 >= data_list.length) {    // 마지막 데이터인 경우 딜레이 시간 뒤 결과 모달 오픈
                        setTimeout(() => {
                            // 혹시 서버쪽에서 받아오며 순서가 섞이는 경우 정렬
                            graphData[0].data.sort((n, m) => n.x - m.x);
                            graphData[1].data.sort((n, m) => n.x - m.x);
                            if (isTest) {
                                graphData[2].data.sort((n, m) => n.x - m.x);
                                closeModal3();  // 진행 모달 닫기
                                openModal4();   // 결과 모달 열기
                            }else{
                                closeModal();  // 진행 모달 닫기
                                openModal2();   // 결과 모달 열기
                            }
                            
                        }, timeToDelay)
                    }
                    resolve();

                } catch (err) {
                    console.log(err);
                    reject();
                }
            }, timeToDelay, count, data_list, isTest);
        })
    };
    const movePage = useNavigate();
    const testHandleFileChangeEvent = (files) => {
        handleFileChangeFunction(files, true);
    }
    const realHandleFileChangeEvent = (files) => {
        handleFileChangeFunction(files, false);
    }
    const handleFileChangeFunction = (files, isTest) => {
        // 전역변수들 초기화
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
        let timeToDelay = 0;
        if (isTest) { // 테스트인 경우 실제 데이터 추가, 딜레이 2초
            graphData.unshift({
                "id": "real",
                "color": "hsl(125, 70%, 50%)",
                "data": []
            });
            timeToDelay = 1000;
        }
        const read = new FileReader();  // 파일리터 생성
        read.onload = async function (e) {    // 읽기 동작이 성공적으로 완료되었을 때마다 발생
            let data_list = read.result.split(/(?:\r\n|\r|\n)/g).slice(1);  // 줄바꿈마다 잘라서 제조 데이터 리스트 생성(첫 줄은 열 이름 데이터이므로 제거)
            if (data_list[data_list.length - 1] <= 1) {  // 마지막줄이 비었는 경우 빈 데이터 제거
                data_list = data_list.slice(0, -1);
            }
            for (let i = 0; i < data_list.length; i++) {
                await promiseSetTimeoutInputCSV(timeToDelay, i, data_list, isTest);
            }
        };
        read.readAsText(files[0]);  // 파일 읽기(onload 실행)
    }
    
    function goHome() { // 홈화면 이동 함수
        movePage('/');
        window.location.reload();
    }

    // 모달 열고 닫는 함수
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
    }
    const openModal4 = () => {
        setModalOpen4(true);
    }
    const closeModal4 = () => {
        setModalOpen4(false);
        openModal5();
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
                            <ReactFileReader handleFiles={testHandleFileChangeEvent} fileTypes={".csv"}>
                                <div className={styles.input_btn_wrap2}>
                                    <button className={styles.test_btn_under}>Upload CSV to Test</button>
                                    <button className={styles.test_btn}><span>Upload CSV to Test</span></button>
                                </div>
                            </ReactFileReader>
                            <ReactFileReader handleFiles={realHandleFileChangeEvent} fileTypes={".csv"}>
                                <div className={styles.input_btn_wrap2}>
                                    <button className={styles.input_btn_under}>Upload CSV to Manufacture</button>
                                    <button className={styles.input_btn}><span>Upload CSV to Manufacture</span></button>
                                </div>
                            </ReactFileReader>
                            <div className={styles.input_btn_wrap2}>
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
                            <div>현재까지 중량 합 : {Math.round(listSum * 1000) / 1000}g(loss : {(Math.round((listSum - data_w) * 1000000) / 1000000)}g)</div>
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
                                                    <img src={errimg} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'} />
                                                    : <img src={img} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'} />
                                                }
                                                <p> - </p>
                                                <h2>기존 예상 중량 : {data.predicted_weight}g</h2>
                                                <p> - </p>
                                            </div>
                                            <img src={nextimg} width={200} height={200} className={styles.next_img} alt={'이미지를 불러오는데 실패하였습니다.'} />
                                            <div className={styles.result_div}>
                                                {data.is_rpm_error ?
                                                    <img src={errimg} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'} />
                                                    : <img src={img} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'} />
                                                }
                                                <div>
                                                    <p>추천 칼날 RPM : {data.recommended_rpm}</p>
                                                    <h2>RPM 변경 후 <br></br>예상 중량 : {data.rpm_weight}g</h2>
                                                    <h3>중량 차이 : {Math.round(Math.abs(data.predicted_weight - data.rpm_weight) * 1000) / 1000}g</h3>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className={styles.result_boxN}>
                                            <div className={styles.result_div}>
                                                {data.is_error ?
                                                    <img src={errimg} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'} />
                                                    : <img src={img} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'} />
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
                    : <></>}
            </Modal>
            <Modal
                isOpen={modalOpen3}
                onRequestClose={closeModal3}
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
                            <div>현재까지 중량 합 : {Math.round(listSum * 1000) / 1000}g(loss : {(Math.round((listSum - data_w) * 1000000) / 1000000)}g)</div>
                            <div>현재까지 불량품 : {faile}개( 총 {faileSum}g )</div>
                        </div>
                        <div className={styles.result_box}>
                            {(typeof data.predicted_weight === 'undefined') ? (
                                <p>loding...</p>
                            ) : data.recommended_rpm !== -1 ?
                                <div className={styles.result_boxR}>
                                    <div className={styles.result_div}>
                                        {Math.abs(data2.w - 3.0) > 0.1 ?
                                            <img src={errimg} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'} />
                                            : <img src={img} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'} />
                                        }
                                        <p> - </p>
                                        <h2>실제 중량 : {data2.w}g</h2>
                                        <h2>모델 예측 중량 :<br></br>{data.predicted_weight}g( {Math.round((data.predicted_weight - data2.w) * 1000) / 1000}g )</h2>
                                    </div>
                                    <img src={nextimg} width={200} height={200} className={styles.next_img} alt={'이미지를 불러오는데 실패하였습니다.'} />
                                    <div className={styles.result_div}>
                                        {data.is_rpm_error ?
                                            <img src={errimg} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'} />
                                            : <img src={img} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'} />
                                        }
                                        <div>
                                            <p>추천 칼날 RPM : {data.recommended_rpm}</p>
                                            <h2>RPM 변경 후 <br></br>예상 중량 : {data.rpm_weight}g</h2>
                                            <h3>중량 차이 : {Math.round(Math.abs(data2.w - data.rpm_weight) * 1000) / 1000}g</h3>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className={styles.result_boxR}>
                                    <div className={styles.result_div}>
                                        {Math.abs(data2.w - 3.0) > 0.1 ?
                                            <img src={errimg} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'} />
                                            : <img src={img} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'} />
                                        }
                                        <p> - </p>
                                        <h2>실제 중량 : {data2.w}g</h2>
                                        <h2>모델 예측 중량 :<br></br>{data.predicted_weight}g( {Math.round((data.predicted_weight - data2.w) * 1000) / 1000}g )</h2>
                                    </div>
                                    <img src={nextimg} width={200} height={200} className={styles.next_img} alt={'이미지를 불러오는데 실패하였습니다.'} />
                                    <div className={styles.result_div}>
                                        {data.is_error ?
                                            <img src={errimg} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'} />
                                            : <img src={img} width={200} height={200} className={styles.product_img} alt={'이미지를 불러오는데 실패하였습니다.'} />
                                        }
                                        <div>
                                            <p>칼날 RPM 유지</p>
                                            <h2>예상 중량 : {data.predicted_weight}g</h2>
                                            <h3>중량 차이 : {Math.round(Math.abs(data2.w - data.predicted_weight) * 1000) / 1000}g</h3>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    : <></>}
            </Modal>
            <Modal
                isOpen={modalOpen2}
                onRequestClose={closeModal2}
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
                            <div><h2>RPM 변경 안했을 시 양품 중량 합 :<br></br>{Math.round(listBeforeSum * 1000) / 1000}g</h2></div>
                            <div><h2>RPM 변경 안했을 시 loss :<br></br>{(Math.round((listBeforeSum - data_w2) * 1000000) / 1000000)}g</h2></div>
                            <div><h3>RPM 변경 안했을 시 불량품 :<br></br>{faile2}개</h3></div>
                            <div><h3>RPM 변경 안했을 시 불량품 중량 loss :<br></br>{faileSum2}g</h3></div>
                        </div>
                        <img src={nextimg} width={200} height={200} className={styles.next_img} alt={'이미지를 불러오는데 실패하였습니다.'} />
                        <div className={styles.result_div}>
                            <div><h2>최종 양품 :<br></br>{success}개{success > success2 ? <>(+{success - success2}개)</> : <></>}</h2></div>
                            <div><h2>최종 양품 중량 합 :<br></br>{Math.round(listSum * 1000) / 1000}g{Math.round(listSum * 1000) / 1000 < Math.round(listBeforeSum * 1000) / 1000 ?
                                <>({Math.round((listSum - listBeforeSum) * 1000) / 1000}g)</> :
                                <></>}</h2></div>
                            <div><h2>최종 loss :<br></br>{(Math.round((listSum - data_w) * 1000000) / 1000000)}g
                                {(Math.round((listSum - data_w) * 1000000) / 1000000) < (Math.round((listBeforeSum - data_w2) * 1000000) / 1000000) ?
                                    <>({(Math.round((listSum - data_w - listBeforeSum + data_w2) * 1000000) / 1000000)}g)</> :
                                    <></>}</h2></div>
                            <div><h3>최종 불량품 :<br></br>{faile}개{faile < faile2 ? <>({faile - faile2}개)</> : <></>}</h3></div>
                            <div><h3>최종 불량품 중량 loss :<br></br>{faileSum}g{faileSum < faileSum2 ? <>({faileSum - faileSum2}개)</> : <></>}</h3></div>
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
                isOpen={modalOpen4}
                onRequestClose={closeModal4}
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
                <div className={styles.result_wrap2}>
                    <div className={styles.result_title2}><h2>{success + faile}개의 제품 제조 완료</h2></div>
                    <div className={styles.result_box3}>
                        <div className={styles.result_div2}>
                            <div><h2>실제 양품 :<br></br>{realSuccess}개</h2></div>
                            <div><h2>실제 양품 중량 합 :<br></br>{Math.round(realSum * 1000) / 1000}g</h2></div>
                            <div><h2>실제 loss :<br></br>{(Math.round((realSum - data_w3) * 1000000) / 1000000)}g</h2></div>
                            <div><h3>실제 불량품 :<br></br>{realFaile}개</h3></div>
                            <div><h3>실제 불량품 중량 loss :<br></br>{realFaileSum}g</h3></div>
                        </div>
                        <img src={nextimg} width={200} height={200} className={styles.next_img2} alt={'이미지를 불러오는데 실패하였습니다.'} />
                        <div className={styles.result_div2}>
                            <div><h2>RPM 변경 안했을 시 양품 :<br></br>{success2}개</h2></div>
                            <div><h2>RPM 변경 안했을 시 양품 중량 합 :<br></br>{Math.round(listBeforeSum * 1000) / 1000}g</h2></div>
                            <div><h2>RPM 변경 안했을 시 loss :<br></br>{(Math.round((listBeforeSum - data_w2) * 1000000) / 1000000)}g</h2></div>
                            <div><h3>RPM 변경 안했을 시 불량품 :<br></br>{faile2}개</h3></div>
                            <div><h3>RPM 변경 안했을 시 불량품 중량 loss :<br></br>{faileSum2}g</h3></div>
                        </div>
                        <img src={nextimg} width={200} height={200} className={styles.next_img2} alt={'이미지를 불러오는데 실패하였습니다.'} />
                        <div className={styles.result_div2}>
                            <div><h2>최종 양품 :<br></br>{success}개{success > realSuccess ? <>(+{success - realSuccess}개)</> : <></>}</h2></div>
                            <div><h2>최종 양품 중량 합 :<br></br>{Math.round(listSum * 1000) / 1000}g{Math.round(listSum * 1000) / 1000 < Math.round(realSum * 1000) / 1000 ?
                                <>({Math.round((listSum - realSum) * 1000) / 1000}g)</> :
                                <></>}</h2></div>
                            <div><h2>최종 loss :<br></br>{(Math.round((listSum - data_w) * 1000000) / 1000000)}g
                                {(Math.round((listSum - data_w) * 1000000) / 1000000) < (Math.round((realSum - data_w3) * 1000000) / 1000000) ?
                                    <>({(Math.round((listSum - data_w - realSum + data_w3) * 1000000) / 1000000)}g)</> :
                                    <></>}</h2></div>
                            <div><h3>최종 불량품 :<br></br>{faile}개{faile < realFaile ? <>({faile - realFaile}개)</> : <></>}</h3></div>
                            <div><h3>최종 불량품 중량 loss :<br></br>{faileSum}g{faileSum < realFaileSum ? <>({faileSum - realFaileSum}개)</> : <></>}</h3></div>
                        </div>

                    </div>
                    <div className={styles.input_btn_wrap_div3}>
                        <div className={styles.input_btn_wrap3}>
                            <button className={styles.cancel_btn_under} onClick={closeModal4}>OK</button>
                            <button className={styles.cancel_btn} onClick={closeModal4}><span>OK</span></button>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={modalOpen5}
                onRequestClose={closeModal5}
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
                    <div className={styles.input_btn_wrap_div2}>
                        <div className={styles.input_btn_wrap2}>
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