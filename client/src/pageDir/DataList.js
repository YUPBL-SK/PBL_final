import { useNavigate } from 'react-router-dom';
import styles from "../cssDir/dataList.module.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios";
import { React, useState } from 'react';
import { ko } from "date-fns/esm/locale";

const num_regex = /^\d{0,}\.{0,1}\d{1,}$/i; // 숫자 정규식

const BackUrl = 'https://pbl-final-yvbcumjjwq-du.a.run.app';    // 배포 서버로 실행할 때 주소
const LocalUrl = 'http://127.0.0.1:5000';   // 로컬로 실행할 때 주소

function DataList() {
    const [data, setData] = useState([{}]);             // 서버에서 받아온 중량 예측 데이터
    const [selectedStartDate, setSelectedStartDate] = useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());
    const movePage = useNavigate();

    function goHome() {
        movePage('/');
    }

    return (
        <div className={styles.App}>
            <div className={styles.input_page}>
                <div className={styles.input_wrap}>
                    <div className={styles.input_box}>
                        <h1 className={styles.input_head}>Download Manufacturing History</h1>
                        <div className={styles.input_form}>
                            <div>
                                <div className={styles.date_message}>Start Date</div>
                                <DatePicker
                                    locale={ko}
                                    className={styles.datePicker}
                                    dateFormat='yyyy.MM.dd'
                                    shouldCloseOnSelect
                                    selected={selectedStartDate}
                                    onChange={(date) => setSelectedStartDate(date)}
                                    popperPlacement='bottom'
                                />
                            </div>
                            <div>
                                <div className={styles.date_message}>End Date</div>
                                <DatePicker
                                    locale={ko}
                                    className={styles.datePicker}
                                    dateFormat='yyyy.MM.dd'
                                    shouldCloseOnSelect
                                    selected={selectedEndDate}
                                    minDate={selectedStartDate} // minDate 이전 날짜 선택 불가
                                    onChange={(date) => setSelectedEndDate(date)}
                                    popperPlacement='bottom'
                                />
                            </div>
                            <div className={styles.input_btn_wrap}>
                                <button type="button" className={styles.input_btn_under} onClick={goHome}>Download</button>
                                <button type="button" className={styles.input_btn} onClick={goHome}><span>Download</span></button>
                            </div>
                            <div className={styles.input_btn_wrap}>
                                <button type="button" className={styles.home_btn_under} onClick={goHome}>Go Back Home</button>
                                <button type="button" className={styles.home_btn} onClick={goHome}><span>Go Back Home</span></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DataList;
