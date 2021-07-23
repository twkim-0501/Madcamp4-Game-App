import React, {useEffect} from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import "./LandingPage.css"

const io = require("socket.io-client");
const socket = io('http://192.249.18.171:80')
socket.connect()

function LandingPage(props) {

    useEffect( ()=> {
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

    const roomCreate = () => {

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
                <input/>
                <button onClick={roomCreate}>방개설</button>
            </div>
        </div>
    )
}

export default withRouter(LandingPage)
