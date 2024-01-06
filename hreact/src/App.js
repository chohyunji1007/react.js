import logo from './logo.svg';
import './/css/App.css';
import {useEffect, useState} from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'; //페이지 이동에 사용되는 router
import Login from './login'
import Home from './home'
import Signup from './signup'

function App() {
  
  return (
    
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/signup' element={<Signup />}></Route>
    </Routes>

  )
}

export default App;
