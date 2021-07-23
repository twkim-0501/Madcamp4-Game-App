import React, {useEffect} from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import "./LandingPage.css"
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
                <button>방개설</button>
            </div>
        </div>
    )
}

export default withRouter(LandingPage)
