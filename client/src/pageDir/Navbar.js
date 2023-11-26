import styles from '../cssDir/navigation.module.css';
import {Link, useNavigate} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import logo from '../imgDir/homeImg_nav.png';
import hover_logo from '../imgDir/homeImg_navh.png';
import logos from '../imgDir/homeImg_nav1.png';
import oneImg from '../imgDir/oneImg_nav.png';
import hover_oneImg from '../imgDir/oneImg_navh.png';
import oneImgs from '../imgDir/oneImg_nav1.png';
import csvImg from '../imgDir/csvImg_nav.png';
import hover_csvImg from '../imgDir/csvImg_navh.png';
import csvImgs from '../imgDir/csvImg_nav1.png';
import { useLocation } from 'react-router-dom';
import axios from "axios";


function Navbar() {
    const movePage = useNavigate();
    const location = useLocation();
    const [inputText, setInputText] = useState('');
    let path_list = location.pathname.split('/');
    let path_len = path_list.length;
    let path = ''
    if(path_len > 2){
        path = path_list[2];
    }
    
    function goHome() {
        movePage('/');
    }
    
    function goInput() {
        movePage('/pages/input');
    }
    function goInputAll() {
        movePage('/pages/inputAll');
    }
    
    return (
        <div className={styles.bottom_nav}>
            <nav className={styles.center_nav}>
                <ul className={styles.bottom_list}>
                    <li className={styles.tlist_item} onClick={goHome}>
                        <a className={styles.tlist_item_a}>
                        <div className={styles.logo_img_wrap}>
                            <img src={hover_logo} width={50} height={50} className={styles.green_logo_img}></img>
                            {path_len != 2 ? <img src={logo} width={50} height={50} className={styles.logo_img}></img>:
                            <img src={logos} width={50} height={50} className={styles.logo_img}></img>}
                        </div>
                        </a>
                    </li>
                    <li className={styles.tlist_item} onClick={goInput}>
                        <a className={styles.tlist_item_a}>
                        <div className={styles.logo_img_wrap}>
                            <img src={hover_oneImg} width={50} height={50} className={styles.green_logo_img}></img>
                            {path_len == 2 || path !== 'input' ? <img src={oneImg} width={50} height={50} className={styles.logo_img}></img>:
                            <img src={oneImgs} width={50} height={50} className={styles.logo_img}></img>}
                        </div>
                        </a>
                    </li>
                    <li className={styles.tlist_item} onClick={goInputAll}>
                        <a className={styles.tlist_item_a}>
                        <div className={styles.logo_img_wrap}>
                            <img src={hover_csvImg} width={50} height={50} className={styles.green_logo_img}></img>
                            {path_len == 2 || path !== 'inputAll' ? <img src={csvImg} width={50} height={50} className={styles.logo_img}></img>:
                            <img src={csvImgs} width={50} height={50} className={styles.logo_img}></img>}
                        </div>
                        </a>
                    </li>
                    <li className={styles.tlist_item}>
                        <a className={styles.tlist_item_a}>
                        <div className={styles.logo_img_wrap}>
                            <img src={hover_logo} width={50} height={50} className={styles.green_logo_img}></img>
                            <img src={logo} width={50} height={50} className={styles.logo_img}></img>
                        </div>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;