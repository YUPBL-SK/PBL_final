import React from 'react';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Routes, Route, useLocation} from 'react-router-dom';
import Home from "./pageDir/Home";
import Input from "./pageDir/Input";
import InputAll from "./pageDir/InputAll";
import Navbar from './pageDir/Navbar';

function App() {
  return (
  <TransitionGroup className={'transition-wrapper'}>
    <Navbar></Navbar>
    <CSSTransition key={useLocation().pathname} timeout={300} classNames={'pages_push_controll'}>
      <div id='root'>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/pages/input" element={<Input />}></Route>
          <Route path="/pages/inputAll" element={<InputAll />}></Route>
        </Routes>
      </div>
    </CSSTransition>
  </TransitionGroup>
  )
  // state
  // const [data, setData] = useState([{}])

  // useEffect(() => 
  //   {
  //   	const data = {
  //       'c_temp_pv' : 69.6,
  //       'k_rpm_pv' : 189,
  //       'n_temp_pv' : 67.2,
  //       's_temp_pv' : 67.1,
  //       'scale_pv' : 3.01
  //     };
  //     const config = {"Content-Type": 'application/json'};
  //     axios.post('http://127.0.0.1:5000/predict', data, config)
  //     .then((response) => {
  //       console.log(response)
  //       setData(response.data);
  //     })
  //     .catch(error => {
  //       console.log(error)
  //     });
  //   }, [])

  // return (
  //   <div className='App'>
  //     <h1>test 하는 중...</h1>
  //     <div>
  //       {/* 삼항연산자 */}
  //       { (typeof data.members === 'undefined') ? (
  //         // fetch가 완료되지 않았을 경우에 대한 처리
  //         <p>loding...</p>
  //       ) : (
  //         data.members.map((u) => <p>{u.name}</p>)
  //       )}
  //     </div>
  //   </div>
  // )
}

export default App;