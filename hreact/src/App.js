import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react'


function Header(props){ //사용자 정의 태그(컴포턴트)는 대문자로 시작 해야함
  // console.log('props title=', props.title)
	return(
		<header>
	    <h1><a href='/' onClick={(event)=>{
        event.preventDefault(); // 1. onClick 이벤트에 콜백 함수로 들어간 함수가 호출될 때 event 객체를 첫 번째 파라미터로 주입
        // 2. a 태그가 동작하는 기본 동작을 막음
        props.onChangeMode(); // 3. Header 컴포넌트에 있는 onChangeMode를 가리키고 이 함수 호출 
      }}>{props.title}</a></h1>
	  </header>
	)
}
function Nav(props){
  const lis=[]
  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}><a href={'/read/'+t.id} onClick={(event)=>{
      event.preventDefault();
      props.onChangeMode(t.id); //t.id, event.target.id 가능, event.target = a tag
      
    }}>{t.title}</a></li>)
  }
  return(
    <nav>
        <ol>
          {lis}
        </ol>
      </nav>
  )
}

function Article(props){
  return(
    <article>
        <h2>Welcome, {props.title}</h2>
        {props.body}
      </article>
  )
}

function Create(props){
  return(
    <article style={{width: "500px"}}>
      <h2> Create </h2>
      <form onSubmit={event=>{
        event.preventDefault(); //submit 후 reload되는걸 막기위해
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onCreate(title, body);
      }}>
        <div className='form-group'>
          <p><input type='text' name="title" placeholder='title' className='form-control'></input></p>
          <p><textarea name="body" placeholder='body' className='form-control'></textarea></p>
          <input type='submit' value="추가" className='btn btn-secondary'></input>
        </div>

        {/* <p><input type="text" name="title" placeholder="title" /></p>
        <p><textarea name="body" placeholder="body"></textarea></p>
        <p><input type="submit" value="Create"></input></p> */}
        
      </form>
    </article>
  )
}

function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return(
    <article style={{width: "500px"}}>
      <h2> Create </h2>
      <form onSubmit={event=>{
        event.preventDefault(); //submit 후 reload되는걸 막기위해
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onUpdate(title, body);
      }}>
        <div className='form-group'>
          <p><input type='text' name="title" placeholder='title' value={title} onChange={event=>{
            // console.log(event.target.value);
            setTitle(event.target.value);
          }} className='form-control'></input></p>
          <p><textarea name="body" placeholder='body' value={body} onChange={event=>{
            // console.log(event.target.value);
            setBody(event.target.value);
          }} className='form-control'></textarea></p>
          <input type='submit' value="수정" className='btn btn-secondary'></input>
        </div>
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
    }}>
      <input type='text' name ="searchTitle" value={searchTitle} onChange={event=>{
            // console.log('input onChange : searchTitle =',event.target.value);
            setsearchTitle(searchTitle);
          }}></input>
      <input type='submit' value="검색"></input>
    </form>
  )
}

function App() {
  // const _mode = useState('WELCOME'); //_mode를 state(상태)로 업그레이드, import {useState} from 'react',
  const [mode, setMode] = useState('WELCOME'); //[state로 사용할 변수 명(mode), state 값을 변경할 함수 명(setMode)]
  const [_id, setId] = useState(null); //1.2. .. 클릭한 id값 받아올때 사용하는 변수
  const [topics, setTopics] = useState([]);
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
  let contextControl = null;
  let contextDelete = null;
  let contextSearch = null;
  let searchTitle = undefined;

  useEffect(()=>{ //dom 업데이트 후 불러냄
    var geturl = 'http://localhost:3001/topics'
    if(searchTitle !== undefined){
      geturl+='?title='+searchTitle;
    }
    console.log('geturl = ', geturl);
    fetch(geturl)
    .then(res =>{
      return res.json(); //res는 http응답이여서 .json()을 사용해 json으로 바꿔줌
    }).then(data => {
      setTopics(data);
    })
  }, []);

  console.log('current mode = ', mode);
  if(mode === 'WELCOME'){
    
    content = <Article title="web" body="Hello, Web"></Article>
    contextSearch = <Search searchTitle={searchTitle} onUpdate={(searchTitle)=>{
      
      console.log('Search onUpdate : searchTitle = ',searchTitle);
      if(searchTitle==='' || searchTitle===undefined){
        setMode('SEARCH');
      }
      var ori_topic_len = topics.length;
      let ori_topics = [...topics];
      topics.length = 0; //배열 초기화

      // console.log('topics.length = ', topics.length);
      var countId = 1;
      for(let i=0; i<ori_topic_len; i++){
        // console.log('now topic = ', ori_topics[i]);
        if(ori_topics[i].title.indexOf(searchTitle) !== -1){ //포함된 문자열이 없는 경우 -1 반환
          let newTopic = {id:countId, title:ori_topics[i].title, body:ori_topics[i].body};
          // console.log('newTopic = ', newTopic);
          countId ++;
          topics.push(newTopic);
          if(i>ori_topic_len+1){
            break;
          }
        }else{
          
        }
      }
      if(topics.length === 0){
        topics.push({id:0, title: '검색 결과가 없습니다.', body:'없어!'});
      }
      console.log('topics = ', topics);
      setTopics(topics);
      setMode('SEARCH');
    }}></Search>
  }
  else if(mode === 'READ'){
    let title, body = null;
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
    }}>update</a>

    contextDelete = <button onClick={()=>{
      console.log('_id = ',_id-1);
      console.log('topics[',_id-1,'] = ', topics[_id-1].title);
      topics.splice(_id-1, 1);
      console.log(topics);
      setTopics(topics);
      setMode('WELCOME');
    }}>삭제</button>
  }
  else if(mode === 'CREATE'){
    content = <Create onCreate={(_title, _body)=>{
      nextId = topics.length+1;
      const newTopic = {id:nextId, title:_title, body:_body};
      const newTopics = [...topics]; //배열은 [...배열이름]을 사용해 복제해 사용해야함
      newTopics.push(newTopic);
      setTopics(newTopics);
      // setId(nextId);
      // setNextId(nextId+1);
      nextId++;
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
    const updateTopic = {id:_id, title:title, body:body};
    topics.splice(_id-1, 1, updateTopic);
    setTopics(topics);
    setMode('READ');
    }}></Update>
  }
  else if(mode === 'SEARCH'){
    setMode('WELCOME');
  }
  
  return (
    <div className="App">
      <Header title="WEB" onChangeMode={()=>{
        setMode('WELCOME');
      }}></Header>
      {contextSearch}
      
      <Nav topics ={topics} onChangeMode={(_id)=>{
        setMode('READ');
        setId(_id);
      }}></Nav>
      {content}
      
      <button onClick={event=>{
        event.preventDefault();
        setMode('CREATE');
      }} className='btn btn-primary'>create</button>
      {contextControl}
      {contextDelete}
    </div>
  )
}

export default App;
