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
    const [selectedStartDate, setSelectedStartDate] = useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());
    const movePage = useNavigate();

    function goHome() {
        movePage('/');
    }

    const get_barwell = (e) => {
        const start_date = new Date(selectedStartDate.getTime() - (selectedStartDate.getTimezoneOffset()*60000)).toISOString().slice(0,10);
        const end_date = new Date(selectedEndDate.getTime() - (selectedEndDate.getTimezoneOffset()*60000)).toISOString().slice(0,10);
        const data = {
            'start-date': start_date,
            'end-date': end_date,
        };
        const config = {
            "Content-Type": 'application/json',
            'params': data
        };
        axios.get(BackUrl + '/data-list', config)
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'barwell_' + start_date + '_' + end_date + '.csv'); //or any other extension
                document.body.appendChild(link);
                link.click();
            })
            .catch(error => {
                console.log(error);
            });
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
                                <button type="button" className={styles.input_btn_under} onClick={get_barwell}>Download</button>
                                <button type="button" className={styles.input_btn} onClick={get_barwell}><span>Download</span></button>
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
