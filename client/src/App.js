import React from 'react';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Routes, Route, useLocation} from 'react-router-dom';
import Home from "./pageDir/Home";
import Input from "./pageDir/Input";
import InputAll from "./pageDir/InputAll";
import DataList from './pageDir/DataList';
import Navbar from './pageDir/Navbar';

function App() {
  return (
  <TransitionGroup className={'transition-wrapper'}>
    <Navbar></Navbar>
    <CSSTransition key={useLocation().pathname} timeout={0} classNames={'pages_push_controll'}>
      <div id='root'>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/pages/input" element={<Input />}></Route>
          <Route path="/pages/input-all" element={<InputAll />}></Route>
          <Route path="/pages/data-list" element={<DataList />}></Route>
        </Routes>
      </div>
    </CSSTransition>
  </TransitionGroup>
  )
}

export default App;