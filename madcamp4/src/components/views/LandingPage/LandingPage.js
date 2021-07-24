import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import "./LandingPage.css"
import {useSelector} from 'react-redux'


function LandingPage(props) {
    const user = useSelector(state => state.user)
    const [roomName, setRoomName] = useState('')
    const [rooms, setRooms] = useState([])

    useEffect(() => {
        axios.get('/api/gameroom/getAll')
        .then((res) => {
            console.log(res.data);
            setRooms(res.data);
        })
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
        setRoomName(e.target.value);
    }

    const submitHandler = () => {
        console.log(roomName);
        console.log(user.userData?._id)
        //socket으로 text 쏴주면 될듯
        axios.post('/api/gameroom/addRoom', {roomName: roomName, user: user.userData})
        setRoomName('');
    }
    const joinRoom = (e) => {
        axios.post('/api/gameroom/joinRoom', {roomId: e.target.value, playerId: user.userData?._id})
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
                <input placeholder="방 제목" onChange={onChange} value={roomName}/>
                <a href="/gamepage" >
                    <button onClick={submitHandler}>방개설</button>
                </a>
                {
                    rooms.map((room) => (
                        <div>
                            <span>방: </span>
                            <a href="/gamepage" >
                                <button onClick={joinRoom} value={room._id}>{room.roomTitle}</button>
                            </a>
                        </div>)
                    )
                }
            </div>
        </div>
    )
}

export default withRouter(LandingPage)
