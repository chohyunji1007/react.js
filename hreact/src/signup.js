// import logo from './logo.svg';
// import './App.css';
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
    let nextId =0;

    return (
        
        <div className='signup'>
            <h1> 회원가입 </h1>
            <form onSubmit={event=>{
                event.preventDefault(); //submit 후 reload되는걸 막기위해
                const userID = event.target.userID.value;
                const PW = event.target.PW.value;
                const userEmail = event.target.userEmail.value;
                
                fetch(geturl) //next id를 얻어오기 위해
                // .then(res =>{
                //     return res.json();
                // }).then(data => {
                //     console.log("data = ", data);
                // })
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
                      console.log("회원가입 완료!");
                    }
                  })
                
            }}>
                <label>아이디</label>
                <input type="text" name="userID" placeholder='ID' required></input>
                <label>비밀번호</label>
                <input type="password" name="PW" placeholder='PW' required></input>
                <label>이메일</label>
                <input type="email" name="userEmail" placeholder='Email'></input>
                
                <input type="submit" value="회원가입"></input>
            </form>
            
            <button onClick={gohome}>홈으로</button>
        </div>
    )
}

