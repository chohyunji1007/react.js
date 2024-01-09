// import logo from './logo.svg';
import './css/Signup.css';
import {useEffect, useState} from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'; //페이지 이동에 사용되는 router
// import { useCookies } from 'react-cookie'

// json-server connect url
let geturl = 'http://localhost:3001/members';

export default function Signup(){
    //페이지 이동
    const movePage = useNavigate();

    function gohome(){
        movePage('/');
    }
    function goLogin(){
      movePage('/login');
    }
    let nextId =0;

    return (
      <div className='login-header'>
        <div className='navbar navbar-expand-lg' style={{display:'flex', justifyContent : 'space-between', background: '#EEE7DA'}}>
        <header>
            <h1><a className='nav-brand' href='/' style={{color : "#88AB8E", textDecoration : "none", marginLeft:"10px"}}onClick={(event)=>{
            
        }}>H</a></h1>
        </header>
        </div>
        <div className='login'>
          <div className='form-group'>
          <h1> 회원가입 </h1>
          <div className='blank'></div>
              <form className="loginForm" onSubmit={event=>{
                  event.preventDefault(); //submit 후 reload되는걸 막기위해
                  const userID = event.target.userID.value;
                  const PW = event.target.PW.value;
                  const userEmail = event.target.userEmail.value;
                  
                  geturl +='/?userID=' + userID;
                  fetch(geturl)
                  .then(res =>{
                      return res.json(); //res는 http응답이여서 .json()을 사용해 json으로 바꿔줌
                  }).then(data => {
                    if(data.length >0){
                      // console.log("아이디 중복!!");
                      alert("아이디가 이미 존재 함~ 다른 아이디로 가입해~");
                    }else{
                      // console.log("가입 가능!!");
                      fetch(geturl, {
                      method : 'POST',
                      headers : {
                        "Content-Type" : "application/json",
                      },
                      body : JSON.stringify({
                      //   id:nextId,
                        userID:userID,
                        userEmail : userEmail,
                        PW : PW
                        
                      }),
                    }).then(res =>{
                      if(res.ok){
                        alert("회원가입 완료!");
                        goLogin();
                      }
                    })
                    }
                      
                  });
                  
                  
                  
              }}>
                  <label className='form-label'>아이디  <b>*</b></label>
                  <input type="text" name="userID" className="form-control" placeholder='' required></input>
                  <label className='form-label'>비밀번호  <b>*</b></label>
                  <input type="password" name="PW" className="form-control" placeholder='' required></input>
                  <label className='form-label'>이메일</label>
                  <input type="email" name="userEmail" className="form-control" placeholder=''></input>
                  
                  <input type="submit" className='btn loginBtn' value="회원가입" style={{marginTop : "20%"}}></input>
                  <a type="button" value="회원가입" onClick={goLogin}> 로그인 </a>
              </form>
              <div className='blank'></div>
              <button className='btn btn-secondary' onClick={gohome}>홈으로</button>
          </div>
            
        </div>
      </div>
    )
}

