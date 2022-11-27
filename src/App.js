import './App.css';
import Navbar from './components/Navbar';
import About from './components/About';
import Video from './components/Video';
import {Routes,Route,useNavigate} from 'react-router-dom';
import Attendance from './components/Attendance';
import TextState from './context/textState';


import React from 'react'
import Alert from './components/Alert';
import Login from './components/Login';



function App() {
  const navigate=useNavigate();
  const navigateAttendence=()=>{
    navigate('/attendence')
  }
  return (
    <>

    <TextState>
      <Navbar title="FaceRecWeb" aboutText="About us"/>
      <Alert/>
      <Routes>
        <Route exact path='/' element={<Video/>}/>
        <Route exact path='/attendance' element={<Attendance/>}/>    
        <Route exact path='/about' element={<About/>}/>
        <Route exact path='/login' element={<Login/>}/>

      </Routes>
     
    </TextState>
    </>

  );
}

export default App;
