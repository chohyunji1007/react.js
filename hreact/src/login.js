// import logo from './logo.svg';
import './css/Login.css';
import {useEffect, useState} from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'; //페이지 이동에 사용되는 router
import { useCookies } from 'react-cookie'

// json-server connect url
let geturl = 'http://localhost:3001/members';

export default function Login(){
    //페이지 이동
    const movePage = useNavigate();
    //쿠키 설정
    const [cookies, setCookie, removeCookie] = useCookies()

    function gohome(){
        movePage('/');
    }
    function goSignup(){
        movePage('/signup');
    }

    return (
        <div className='login-header'>
            <div className='navbar navbar-expand-lg navbar-dark bg-dark'>
            <header>
                <h1><a className='nav-brand' href='/' style={{color : "#fff", textDecoration : "none", marginLeft:"10px"}}onClick={(event)=>{
                
            }}>H</a></h1>
            </header>
            </div>
            <div className='login'>
                <div className='form-group'>
                <h1> 로그인 </h1>
                <div className='blank'></div>
                <form className="loginForm" onSubmit={event=>{
                    event.preventDefault(); //submit 후 reload되는걸 막기위해
                    const userID = event.target.userID.value;
                    const PW = event.target.PW.value;
                    
                    let searchurl = geturl+"/?userID="+userID;
                    fetch(searchurl)
                    .then(res =>{
                    return res.json(); //res는 http응답이여서 .json()을 사용해 json으로 바꿔줌
                    }).then(data => {
                        if(data.length !== 0){
                            if(data[0].userID == userID){
                                console.log("아이디 존재");
                                if(data[0].PW === PW){
                                    console.log("로그인 성공!");
                                    //setCookie(쿠키 이름, 저장할 정보를 담은 객체, 쿠키 설정 값) path를 /로 하면 모든 페이지에서 가능
                                    // const expires = mo
                                    setCookie('accessToken', userID , {path:'/'})
                                    console.log('cookies = ', cookies)
                                    movePage('/'); //home.js로 이동
                                }else{
                                    console.log("비밀번호 틀렸어");
                                }
                            }
                        }else{
                            console.log("없어");
                        }
                        
                    })
                    
                }}>
                    
                    <label className='form-label'>아이디</label>
                    <input type="text" name="userID" className="form-control" placeholder='' required></input>
                    <label className='form-label'>비밀번호</label>
                    
                    <input type="password" name="PW" className="form-control" placeholder='' required></input>
                    
                    <input type="submit" className="btn loginBtn" value="로그인" style={{marginTop : "30%"}}></input>
                    <a type="button" value="회원가입" onClick={goSignup}> 회원가입 </a>
                </form>
                <div className='blank'></div>
                <button className="btn btn-secondary" onClick={gohome}>홈으로</button>
                </div>
            </div>
        </div>
        
    )
}

