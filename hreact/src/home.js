import logo from './logo.svg';
import './css/Home.css';
import {useEffect, useState, useRef } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'; //페이지 이동에 사용되는 router
import { useCookies } from 'react-cookie'
// import Pagination from "react-js-pagination"
import { Pagination } from "./Pagination";

function Header(props){ //사용자 정의 태그(컴포턴트)는 대문자로 시작 해야함
	return(
		<header>
	    <h1><a className='nav-brand' href='/' style={{color : "#fff", textDecoration : "none", marginLeft:"10px"}}onClick={(event)=>{
        event.preventDefault(); // 1. onClick 이벤트에 콜백 함수로 들어간 함수가 호출될 때 event 객체를 첫 번째 파라미터로 주입
        // 2. a 태그가 동작하는 기본 동작을 막음
        props.onChangeMode(); // 3. Header 컴포넌트에 있는 onChangeMode를 가리키고 이 함수 호출 
      }}>{props.title}</a></h1>
	  </header>
	)
}
function Post(props){
    const lis=[]
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);

    useEffect(()=>{
        // setPosts(props.topics.reverse());
        setPosts(props.topics);
    })
    const firstPostIndex = (currentPage - 1) * postsPerPage;
    const lastPostIndex = firstPostIndex + postsPerPage;
    const currentPosts = posts.slice(firstPostIndex, lastPostIndex);

    for(let i=0; i<currentPosts.length; i++){
        let t = currentPosts[i];

        lis.push(<tr key={t.id}><td>{i+1}</td><td><a href={'/read/'+t.id} onClick={(event)=>{
            event.preventDefault();
            props.onChangeMode(t.id); //t.id, event.target.id 가능, event.target = a tag
        
    }}>{t.title}</a></td><td>{t.writer}</td><td>{t.write_time}</td></tr>)
    }
    return(
        <div className="container post-table">
            <table className='table table-hover htable'>
                <tbody>
                    <tr><td style={{width:"10%", height:"10px"}}>번호</td><td style={{width:"30%"}}>제목</td><td style={{width:"10%"}}>작성자</td><td style={{width:"20%"}}>작성 시간</td></tr>
                    {lis}
                </tbody>
            </table>
            
            <Pagination
            postsNum={posts.length}
            postsPerPage={postsPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            />
        </div>
    
    )
}

function Article(props){
    return(
    // <article>
    //     <h2>제목 : {props.title}</h2>
    //     {props.body}
    //   </article>
    <div className='postShow'>
        <div className='postName'> {props.title} </div>
        <div className='postContent'> {props.body} </div>
    </div>
    )
}

function Create(props){
    const [cookies, setCookie, removeCookie] = useCookies();
    const movePage = useNavigate();
   
    // if(cookies['accessToken'] === undefined){

    // }else{
        
    // }
    return(
        <article style={{width: "500px"}}>
            <h4> 게시물 추가 </h4>
            <form onSubmit={event=>{
                event.preventDefault(); //submit 후 reload되는걸 막기위해
                const title = event.target.title.value;
                const body = event.target.body.value;
                props.onCreate(title, body);
            }}>
            <div>
                <p><input type='text' name="title" placeholder='title' className='form-control'></input></p>
                <p><textarea name="body" placeholder='body' className='form-control' rows='5'></textarea></p>
                <input type='submit' value="추가" className='btn btn-secondary'></input>
            </div>
    
            </form>
        </article>
        )
    
}

function Update(props){
    const [title, setTitle] = useState(props.title);
    const [body, setBody] = useState(props.body);
    return(
    <article style={{width: "500px"}}>
        <h2> 게시물 수정 </h2>
        <form onSubmit={event=>{
        event.preventDefault(); //submit 후 reload되는걸 막기위해
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onUpdate(title, body);
        }}>
        {/* <div className='form-group'> */}
            <p><input type='text' name="title" placeholder='title' value={title} onChange={event=>{
                setTitle(event.target.value);
            }} className='form-control'></input></p>
            <p><textarea name="body" placeholder='body' value={body} onChange={event=>{
                setBody(event.target.value);
            }} className='form-control' rows="5"></textarea></p>
            <input type='submit' value="수정" className='btn btn-secondary'></input>
        {/* </div> */}
        </form>
    </article>
    )
}

function Search(props){
    const [searchTitle, setsearchTitle] = useState(props.searchTitle);
    return(
    <form onSubmit={event=>{
        event.preventDefault(); //submit 후 reload되는걸 막기위해
        const searchTitle = event.target.searchTitle.value;
        props.onUpdate(searchTitle);
    }} style={{display : "flex"}}>
        <input type='text' name ="searchTitle" className="form-control" value={searchTitle} onChange={event=>{
            setsearchTitle(searchTitle);
            }}></input>
        <input type='submit' className="btn btn-primary" value="검색" style={{marginLeft:"10px"}}></input>
        <input type="button" className="btn btn-primary" value="X" style={{marginLeft:"10px", marginRight:"10px"}} onClick={function(){ window.location.reload(); }}></input>
    </form>
    )
}

function Comment(props){
    return(
        <div className='card'>
            <div className='card-body'>
            <div style={{display:'flex'}}>
                <div className='card-text'>{props.writer} : </div>
                <div className='card-text'> &nbsp; {props.comment}</div>    
            </div>
            <p className='card-text' style={{color:'gray'}}>{props.write_time}</p>
        </div> 
        </div>
         
    )
}
let ori_select_id = '';
function CommentList(props){
    let commenturl = "http://localhost:3001/comment"
    let searchData = null;
    let lis=[];
    const [commentData, setCD] = useState();
    
    useEffect(()=>{
        // console.log('ori_id = ', ori_id);
        // console.log('props.selectPostID = ', props.selectPostID);
        if(ori_select_id === props.selectPostID){
            return;
        }else{
            fetch(commenturl)
        .then(res =>{
            return res.json(); //res는 http응답이여서 .json()을 사용해 json으로 바꿔줌
        }).then(data => {
            // console.log('data=',data);
            // console.log('_id=',props.selectPostID);
            let searchPostID = props.selectPostID;
            
            searchData = data.filter(object =>{
                if(object.post_id.indexOf(searchPostID)>-1){
                    return object
                }    
            })
            // console.log('searchData2 = ', searchData);
            // console.log('lis.len = ', lis.length)
            if(searchData.length>0 && lis.length < searchData.length+1){

                for(let i=0; i<searchData.length; i++){
                    let t = searchData[i];
                    // console.log('t=',t);
                    // lis.push(<div key={'comment_'+i}><span>{t.writer}</span><span>{t.write_time}</span><span>{t.comment}</span></div>);
                    lis.push(<Comment key={'comment_'+i} writer={t.writer} write_time={t.write_time} comment={t.comment}></Comment>);
                }
            }
            setCD(lis);
            // console.log(lis)
            if(lis.length === 0){
                lis.push(<Comment key={'comment_0'} writer={''} write_time={''} comment={"작성된 댓글이 없습니다."}></Comment>);
            }
        })
        }
        
        ori_select_id = props.selectPostID;
        // console.log('ori_id2= ', ori_id);
    });
    return(
        <div id="comment_list">
            {commentData}
        </div>
    )
     
}

// function Nav(){
//     return(
//         <div className='container'>
//             <a className='navbar-brand' href='#'>hi?</a>
//         </div>
//     )
// }

function Home() {
    const [cookies, setCookie, removeCookie] = useCookies()
    // console.log('Home cookies = ', cookies);
    // const _mode = useState('WELCOME'); //_mode를 state(상태)로 업그레이드, import {useState} from 'react',
    const [mode, setMode] = useState('HOME'); //[state로 사용할 변수 명(mode), state 값을 변경할 함수 명(setMode)]
    const [_id, setId] = useState(null); //1.2. .. 클릭한 id값 받아올때 사용하는 변수
    const [topics, setTopics] = useState([]);

    //모달
    const [modalOpen, setModalOpen] = useState(false);
    const modalBackground = useRef();

    // const [commentData, setCD ] = useState([]);
    // useState([
    //   {id:1, title:'html', body:'html is ...'},
    //   {id:2, title:'css', body:'css is ...'},
    //   {id:3, title:'js', body:'js is ...'}
    // ]);
    // const [nextId, setNextId] = useState(4); //초기값 초기화!

    // _mode[0]:데이터, [1]:데이터 상태의 값을 변경할 때 사용하는 함수
    // [0]: state 값, [1] : state 값을 변경할 때 사용할 함수

    var nextId = 0;
    let content = null;
    let comment_text = null;
    let contextControl = null;
    let contextDelete = null;
    let contextSearch = null;
    let searchTitle = undefined;
    let geturl = 'http://localhost:3001/topics';

    // console.log('current mode = ', mode);    
    useEffect(()=>{ //dom 업데이트(마운트 <-> 언마운트) 후 불러냄
    
        fetch(geturl)
        .then(res => {
            return res.json(); //res는 http응답이여서 .json()을 사용해 json으로 바꿔줌
        }).then(data => {
            setTopics(data);
        })

        // return()=>{ //언마운트 될때
            // removeCookie('accessToken',{path:'/'});
        // };
    },[]);

    //페이지 이동에 필요한거 전역으로 선언하면 안되네? ㅎ
    const movePage = useNavigate();
    function goLogin(){
        movePage('/login');
    }
    function goLogout(){
        removeCookie('accessToken',{path:'/'});
    }
    function goSignup(){
        movePage('/signup');
    }
    //페이지 이동

    // console.log('current mode = ', mode);
    if(mode === 'HOME'){

    // content = <Article title="web" body="Hello, Web"></Article>

    }
    else if(mode === 'READ'){
        let title, body = null;
        let selectPostID = null;
        // let ori_id = '';
        for(let i=0; i<topics.length; i++){
            if(topics[i].id === _id){
            title = topics[i].title;
            body = topics[i].body;
            }
        }
        content = <Article title={title} body={body}></Article>
        contextControl = <a href={'/upate/'+ _id } onClick={event=>{
            event.preventDefault();
            setMode('UPDATE');
        }} className='btn btn-success'>수정</a>
        
        comment_text = <CommentList selectPostID = {_id}></CommentList>
        // console.log('comment_text = ', comment_text);
        contextDelete = <button onClick={()=>{

            let delurl = geturl +'/'+ _id;
            fetch(delurl,{
                method : "DELETE",
                });
                setMode('HOME');
        }} className='btn btn-danger'>삭제</button>
    }
    else if(mode === 'CREATE'){
        
        content = <Create onCreate={(_title, _body)=>{
            nextId = topics.slice(-1)[0].id +1;
            var today = new Date();
            var get_now = today.toLocaleString();
            fetch(geturl, {
                method : 'POST',
                headers : {
                    "Content-Type" : "application/json",
                },
                body : JSON.stringify({
                    id:nextId,
                    title:_title,
                    body : _body,
                    writer : cookies["accessToken"],
                    write_time : get_now
                }),
                }).then(res =>{
                if(res.ok){
                    console.log("데이터 추가 완료!");
                    window.location.reload();
                }
            })
        }}></Create>

    }
    else if(mode === 'UPDATE'){
    let title, body = null;
        for(let i=0; i<topics.length; i++){
            if(topics[i].id === _id){
            title = topics[i].title;
            body = topics[i].body;
            }
        }

        content = <Update title={title} body={body} onUpdate={(title, body)=>{

        let updateurl = geturl +'/'+ _id;

        fetch(updateurl,{
            method : 'PUT',
            headers : {
            'Content-type' : 'application/json',
            },
            body : JSON.stringify({
            // ...topics,
            title : title,
            body : body
            }),
        })
        setMode('READ');
        }}></Update>
    }
    else if(mode === 'SEARCH'){
        setMode('HOME');
    }

    

    return (
    <div className="Home">
        <div className='navbar navbar-expand-lg navbar-dark bg-dark'>
            <Header title="H" onChangeMode={()=>{
            setMode('HOME');
            }}></Header>
            <div className='home_loginBtn'>
                <input type="button" value={cookies["accessToken"]===undefined ? "로그인":"로그아웃"} 
                onClick={cookies["accessToken"]===undefined ? goLogin:goLogout} className='btn btn-secondary'></input>
                <input type="button" value="회원가입" onClick={goSignup} className='btn' style={{color:"#fff"}}></input>
            </div>
        </div>
            
        
        {cookies["accessToken"]!==undefined ? <label>{cookies["accessToken"]} 님</label> : null}
            <div className='nameAndSearch'>
                <div className='postName'>게시물 목록</div>
                <Search searchTitle={searchTitle} onUpdate={(searchTitle)=>{
                    
                    if(searchTitle ==='' || searchTitle === undefined){
                        setMode('HOME');
                    }
                    let searchData = '';
                    fetch(geturl)
                    .then(res =>{
                        return res.json(); //res는 http응답이여서 .json()을 사용해 json으로 바꿔줌
                    }).then(data => {
                        searchData = data.filter(object =>{
                            if(object.title.indexOf(searchTitle) > -1){
                                return object
                            }
                        })
                        setTopics(searchData);
                    })
                    setMode('SEARCH');
                }}></Search>
            </div>
        

        <button onClick={event=>{
            event.preventDefault();
            setMode('CREATE');
            setModalOpen(true)
        }} className='btn btn-primary'>게시물 추가</button>
        
        <Post topics ={topics} onChangeMode={(_id)=>{
            setMode('READ');
            setId(_id);
            setModalOpen(true)
        }}></Post>
        {/* { modalOpen && content } */}
        {
        modalOpen &&
        <div className={'modal-container'} ref={modalBackground} onClick={e => {
          if (e.target === modalBackground.current) {
            setMode('READ');
            setModalOpen(false);
            ori_select_id = '';
          }
        }}>
          <div className={'modal-content'}>
            <div>
                {contextControl}
                {contextDelete}
                <button onClick={()=>{ setMode('READ'); setModalOpen(false); ori_select_id = '';}} className='btn btn-secondary'>X</button>
            </div>
            
            {content}
            {comment_text}
            {/* <button className={'modal-close-btn'} onClick={() => setModalOpen(false)}>
              모달 닫기
            </button> */}
          </div>
        </div>
      }
        
        {/* <CommentList selectPostID = {_id}></CommentList> */}
      
    </div>
    )
}

export default Home;
