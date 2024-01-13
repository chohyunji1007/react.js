import logo from './logo.svg';
import './css/Home.css';
import {useEffect, useState, useRef } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'; //페이지 이동에 사용되는 router
import { useCookies } from 'react-cookie'
// import Pagination from "react-js-pagination"
import { Pagination } from "./Pagination";
import Signup from './signup';

function Header(props){ //사용자 정의 태그(컴포턴트)는 대문자로 시작 해야함
	return(
		<header>
	    <h1><a className='nav-brand' href='/' style={{color : "#88AB8E", textDecoration : "none", marginLeft:"10px"}}onClick={(event)=>{
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

        lis.push(<tr key={t.id}>
            {/* <td>{i+1}</td> */}
            <td><a href={'/read/'+t.id} onClick={(event)=>{
            event.preventDefault();
            props.onChangeMode(t.id); //t.id, event.target.id 가능, event.target = a tag
        
    }} className='post-table-td-a'>{t.title}</a></td><td>{t.writer}</td><td>{t.write_time}</td></tr>)
    }

    
    return(
        <div className="post-table">
            <div style={{width : '100%', height:'300px', padding:'10px'}}>
            <table className='table table-hover htable'>
                <thead tyle={{width:"100%"}}>
                    <tr><th style={{width:"10%"}}>제목</th><th style={{width:"10%"}}>작성자</th><th style={{width:"10%"}}>작성 일시</th></tr>
                </thead>
                <tbody>
                    {/* <tr> */}
                        {/* <td style={{width:"10%", height:"10px"}}>번호</td> */}
                    {/* <td style={{width:"30%"}}>제목</td><td style={{width:"10%"}}>작성자</td><td style={{width:"20%"}}>작성 일시</td></tr> */}
                    {lis}
                </tbody>
            </table>
            </div>
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

        <div className='card postCard'>
            <div className='card-header postCardHeader'>
                <div style={{fontWeight : 'bold'}}>{props.title}</div>
                <div>작성자 {props.writer} 님</div>
                <div style={{color:'gray'}}>{props.write_time}</div>
            </div>
            <div className='card-body' style={{overflowY: 'scroll'}}>
                {props.body}
            </div>
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
                <p><input type='text' name="title" placeholder='제목' className='form-control'></input></p>
                <p><textarea name="body" placeholder='내용' className='form-control' rows='6' style={{whiteSpace:'pre-line'}}></textarea></p>
                <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
                    <input type='submit' value="추가" className='btn btn-secondary'></input>
                </div>
            </div>
    
            </form>
        </article>
        )
    
}

function Update(props){
    const [title, setTitle] = useState(props.title);
    const [body, setBody] = useState(props.body);
    const getselectPostID = props.selectPostID;
    return(
    <article style={{width: "500px"}}>
        <h2> 게시물 수정 </h2>
        <form onSubmit={event=>{
            event.preventDefault(); //submit 후 reload되는걸 막기위해
            const title = event.target.title.value;
            const body = event.target.body.value;
            // const write_time = event.target.write_time.value;
            // const writer = event.target.writer.value;
            props.onUpdate(title, body);
        }}>
        {/* <div className='form-group'> */}
            <p><input type='text' name="title" placeholder='title' value={title} onChange={event=>{
                setTitle(event.target.value);
            }} className='form-control'></input></p>
            <p><textarea name="body" placeholder='body' value={body} onChange={event=>{
                setBody(event.target.value);
            }} className='form-control' rows="6"></textarea></p>
            <input type='submit' value="수정" className='btn btn-secondary'></input>
        {/* </div> */}
        </form>
    </article>
    )
}

function Search(props){
    const [searchTitle, setsearchTitle] = useState(props.searchTitle);
    return(
    <form id='searchForm' onSubmit={event=>{
        event.preventDefault(); //submit 후 reload되는걸 막기위해
        const searchTitle = event.target.searchTitle.value;
        props.onUpdate(searchTitle);

    }} style={{display : "flex"}}>
        <input type='text' name ="searchTitle" className="form-control" value={searchTitle} placeholder='제목' onChange={event=>{
            setsearchTitle(searchTitle);
            }} autocomplete="off"></input>
        <button type='submit' form='searchForm' className='btn btn-light'><i className='bi bi-search'></i></button>
        <button className='btn btn-light bi bi-x'style={{marginLeft:"10px", marginRight:"10px"}} onClick={function(){ window.location.reload(); }}></button>
    </form>
    )
}

function Comment(props){
    return(
        <div className='card comment-card'>
            <div className='card-body comment-body'>
                <div style={{display:'flex', justifyContent: 'space-around'}}>
                    <table style={{width: '100%'}}>
                        <tbody>
                            <tr><td style={{width: '10%', fontWeight : 'bold'}}>{props.writer} </td><td style={{width: '50%'}}>{props.comment}</td><td style={{width: '40%', textAlign:'right', color:'gray'}}>{props.write_time}</td></tr>
                        </tbody>
                    </table>
                    {/* <div className='card-text' style={{fontWeight : 'bold'}}> </div>
                    <div className='card-text'> &nbsp; {props.comment}</div>    
                    <div className='card-text' style={{color:'gray'}}>{props.write_time}</div> */}
                </div>
                
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

    //update후 다시 read
    // const [updateAfterRead, setUAR] = useState(false);

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
            setTopics(data.reverse());
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
    function newFetch(){
        let searchData = null;
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
    }
    // console.log('current mode = ', mode);
    if(mode === 'HOME'){

    }
    else if(mode === 'READ'){
        let title, body, write_time, writer = null;
        // let selectPostID = null;
        let searchData = null;
       
        for(let i=0; i<topics.length; i++){
            if(topics[i].id === _id){
            title = topics[i].title;
            body = topics[i].body;
            write_time = topics[i].write_time;
            writer = topics[i].writer;
            }
        }
        content = <Article title={title} body={body} write_time={write_time} writer={writer}></Article>
        contextControl = <a onClick={event=>{
            if(writer === cookies['accessToken']){ //현재 로그인 한 사람과 작성자가 같아야 게시물 수정 가능
                event.preventDefault();
                event.target.href ='/upate/'+ _id;
                setMode('UPDATE');
            }else{
                alert('작성자만 수정 가능');
                // event.target.href ='/';
                // setMode('READ');
            }
            
        }} className='btn btn-success'>수정</a>
        
        comment_text = <CommentList selectPostID = {_id}></CommentList>
        // console.log('comment_text = ', comment_text);
        contextDelete = <button onClick={()=>{

            if(writer === cookies['accessToken']){ //현재 로그인 한 사람과 작성자가 같아야 게시물 수정 가능
                if(window.confirm('진짜 삭제할꺼야?')){
                    let delurl = geturl +'/'+ _id;
                    fetch(delurl,{
                    method : "DELETE",
                    });
                    alert("게시물 삭제 완료!");
                    window.location.reload();
                }
                
            }else{
                alert('작성자만 삭제 가능');
            }

        }} className='btn btn-danger'>삭제</button>
        
    }
    else if(mode === 'CREATE'){
        
        content = <Create onCreate={(_title, _body)=>{
            // nextId = topics.slice(-1)[0].id +1;
            console.log('nextId = ', nextId)
            var today = new Date();
            var get_now = today.toLocaleString();
            console.log('geturl = ', geturl);
            fetch(geturl, {
                method : 'POST',
                headers : {
                    "Content-Type" : "application/json",
                },
                body : JSON.stringify({
                    // id:nextId,
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
        let title, body, writer, write_time = null;
        let searchData = null;
        
        for(let i=0; i<topics.length; i++){
            if(topics[i].id === _id){
                title = topics[i].title;
                body = topics[i].body;
                writer = topics[i].writer;
                write_time = topics[i].write_time;
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
                body : body,
                writer : writer,
                write_time : write_time
                }),
            })

            // setMode('READ'); read 에서 다시 데이터 fetch해서 보여주고 싶은데 그게 안되네..
            alert('게시물 수정 완료');
            window.location.reload();
        }}></Update>
    }
    else if(mode === 'SEARCH'){
        setMode('HOME');
    }

    

    return (
    <div className="Home">
        <div className='navbar navbar-expand-lg' style={{display:'flex', justifyContent : 'space-between', background: '#EEE7DA'}}>
            <Header title="H" onChangeMode={()=>{
                setMode('HOME');
            }}></Header>
            <div className='home_loginBtn'>
                {cookies["accessToken"]===undefined ? <input type="button" value="회원가입" onClick={goSignup} className='btn' style={{color:"black"}}></input> : null}
                {cookies["accessToken"]!==undefined ? <label style={{color:'#776B5D'}}>{cookies["accessToken"]} 님 &nbsp;</label> : null}
                <input type="button" value={cookies["accessToken"]===undefined ? "로그인":"로그아웃"} 
                onClick={cookies["accessToken"]===undefined ? goLogin:goLogout} className='btn btn-secondary' style={{marginRight:"10px" , backgroundColor:'#88AB8E', border:'none'}}></input>
    
            </div>
        </div>
            
        <div className='nameAndSearch'>
            {/* <div className='postName'>게시물 목록</div> */}
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
                    setTopics(searchData.reverse());
                })
                setMode('SEARCH');
            }}></Search>
        </div>
 
        <div>
            <Post topics ={topics} onChangeMode={(_id)=>{
                setMode('READ');
                setId(_id);
                setModalOpen(true)
            }}></Post>
            <div style={{display : 'flex', justifyContent : 'flex-end'}}>
                <button onClick={event=>{
                    if(cookies['accessToken'] === undefined){
                        alert('게시물 추가는 로그인 해야해');
                    }else{
                        event.preventDefault();
                        setMode('CREATE');
                        setModalOpen(true);
                    }
                    
                }} className='btn' style={{marginRight : '10px' ,backgroundColor:'#88AB8E', color:'white'}}>게시물 추가</button>
            </div>
        </div>
        
        
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
          <div className='modal-content'>
            <div className='modal-header modalCloseBtn'>
                <button onClick={()=>{ setMode('READ'); setModalOpen(false); ori_select_id = '';}} className='btn bi bi-x' style={{fontSize : '30px', padding:'0'}}></button>
            </div>
            <div className='modal-footer'>
                {/* 게시물 */}
                {content}
                {/* 수정, 삭제 버튼 */}
                <div className='modalCloseBtn'>
                {contextControl}
                {contextDelete}
                </div>
                
                {/* 댓글 */}
                {comment_text}
            </div>

            
            {/* <button className={'modal-close-btn'} onClick={() => setModalOpen(false)}>
              모달 닫기
            </button> */}
          </div>
        </div>
      }
 
    </div>
    )
}

export default Home;
