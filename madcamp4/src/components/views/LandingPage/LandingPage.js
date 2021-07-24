import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import "./LandingPage.css"
import io from "socket.io-client"
// const io = require("socket.io-client");



function LandingPage(props) {
    const [text, setText] = useState('')
    

    useEffect(()=> {
        axios.get('/api/hello')
            .then(response => console.log(response.data))
    }, [])

    const onClickHandler= () => {
        axios.get('api/user/logout')
        .then(response => {
            if (response.data.ok) {
                alert('로그아웃되었습니다.')
                props.history.push('/login')
            }
        })
    }
    const onChange = (e) => {
        setText(e.target.value);
    }

    const submitHandler = () => {
        console.log(text);
        //socket으로 text 쏴주면 될듯
        axios.post('api/gameroom/addroom', )
        setText('');
    }
 
    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh', flexDirection: 'column'
        }} class="mainbox">
            <h2>시작 페이지 (게임 목록을 볼 수 있는 화면) </h2> 
            <button onClick={onClickHandler}> Logout </button>
            <div>
                <div>title</div>
                <input placeholder="방 제목" onChange={onChange} value={text}/>
                <a href="/gamepage" >
                    <button onClick={submitHandler}>방개설</button>
                </a>
                
            </div>
        </div>
    )
}

export default withRouter(LandingPage)
