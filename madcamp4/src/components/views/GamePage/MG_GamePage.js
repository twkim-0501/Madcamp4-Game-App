import React, { useEffect, useState } from 'react'
import "./MG_GamePage.css"
import {withRouter} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Oppo_player from './Oppo_player';
import My_player from './My_player';
import io from "socket.io-client";
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from "react-dnd-html5-backend";
import {useLocation, useHistory} from "react-router";
import {useSelector} from 'react-redux'
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
}));

let Socket
function MG_GamePage() {
    const history = useHistory();
    const user = useSelector(state => state.user)
    const playerId = user.userData?._id
    const playerName = user.userData?.name
    // const [Socket, setSocket] = useState()
    const [roomInfo, setRoomInfo] = useState()
    const [Items, setItems] = useState("Wait...")
    const [Players, setPlayers] = useState(["waiting"])
    const [host, setHost] = useState()
    const [MyChips, setMyChips] = useState(10)
    const [Bet, setBet] = useState(0)
    const [Dragable, setDragable] = useState(true)
    const [Playing, setPlaying] = useState(false)
    
    useEffect(() => {
        Socket = io('http://192.249.18.179:80')
        //Socket = io('http://192.249.18.171:80')
        Socket.on('playerCome', (newPlayers) => {
            console.log('new player come')
            if(newPlayers){
                setPlayers(newPlayers)
            }
        })

        Socket.on('playerLeave', (newPlayers) => {
            console.log('player leave')
            if(newPlayers){
                setPlayers(newPlayers)
            }
        })
        Socket.on('startGame', (data) => {
            // 알람창 잠깐 뜨기
            console.log('Start Game!!!', data.items)
            setPlaying(true)
            setItems(data.items)
        })
        Socket.on('unexpectedLeave', (leaveId) => {
            if(playerId == null){
                return;
            }
            axios.post('/api/gameroom/findCurrentRoom', {user: playerId})
            .then(res => {
                console.log("undexpectedcheck",leaveId, res.data);
                if(res.data==null){
                    return;
                }
                axios.post('/api/gameroom/exitRoom',
                {playerId: leaveId, roomId: res.data})
                .then(res => {
                    if(res.data){
                        axios.post('/api/gameroom/getPlayersInfo', res.data)
                        .then(res => {
                            setPlayers(res.data)
                })
                    }
                })
            })
            //console.log(leaveId, roomInfo);
            
        } )
    }, [])

    //player 업데이트
    useEffect(() => {
        if(Players != null){
            //console.log(Players[0])
            setHost(Players[0])
        }
    }, [Players])

    useEffect(() => {
        axios.post('/api/gameroom/findCurrentRoom', {user: playerId})
            .then(response => {
                var tempRoomInfo = response.data
                console.log("i found room Info", response.data)
                if (response.data) {
                    axios.post('/api/gameroom/getPlayersInfo', response.data)
                    .then(response => {
                        console.log("detail playersInfo", response.data)
                        if(response.data){
                            setPlayers(response.data)
                            Socket.emit('enterRoom', tempRoomInfo, response.data, playerId)
                        }
                    })
                    setRoomInfo(response.data);
                    
                }
            })
    }, [user])

    useEffect(() => {
        if (MyChips <= 0) {
            setDragable(false)
        }
    }, [MyChips])

    const exitRoom = (e) => {
        //console.log("before exitRoom", playerId, roomInfo._id)
        axios.post('/api/gameroom/exitRoom',
            {playerId: playerId, roomId: roomInfo._id}
        ).then((response) => {
            var tempRoomInfo = response.data
            console.log('exitRoom')
            if (response.data) {
                axios.post('/api/gameroom/getPlayersInfo', response.data)
                .then(response => {
                    //console.log("detail playersInfo", response.data)
                    if(response.data){
                        Socket.emit('exitRoom', tempRoomInfo, response.data)
                    }
                    history.push('/')
                })
            }
            
        })
    }

    const startClick = () => {
        Socket.emit('startClick', roomInfo)
        Ordering()
    }


    const Chip = () => {
        const [{ isDragging, canDrag }, drag] = useDrag({
            type: 'chip',
            item: { name: 'chip' },
            end: (item, monitor) => {
                const dropResult = monitor.getDropResult()
                if (dropResult && dropResult.name === 'table') {
                    setMyChips(MyChips - 1)
                    setBet(Bet + 1)
                }
            },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
                canDrag: monitor.canDrag()
            }),
        });

        const opacity = isDragging ? 0.4 : 1;

        return (
            <div className='chip' ref={drag} style={{ opacity }}>
                {canDrag? "true" : "false"}
                {/* We will move this item */}
            </div>
        )
    }

    const FixedChip = () => {
        return (
            <div className='chip'>
                fix
            </div>
        )
    }

    const Table = () => {
        const [{ canDrop, isOver }, drop] = useDrop({
            accept: 'chip',
            drop: () => ({ name: 'table' }),
            collect: (monitor) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop()
            })
        })

        return (
            <div class="table" ref={drop}>
                {Bet}
            </div>
        )
    }

    const Ordering = () => {
        var ResultOrder = Players.sort(() => Math.random() - 0.5);
        var FirstPlayer = Math.floor(Math.random() * Players.length)
        //첫 순서 보여주기
        console.log("start ordering", FirstPlayer);
    }

    return (
        <div class="mainbox">
            {/* <a href="/"> */}
                <button class="exitBtn" onClick={exitRoom}>나가기</button>
            {/* </a> */}
            {
                (playerId == host?._id) ?
                <button class="startBtn" onClick={startClick}>Game Start</button> :
                null
            }
            
 
            <div>
                <div class="roomNumber">{"방 번호: "+ roomInfo?.roomIndex}</div>
                <div class="roomTitle">{"방 제목: "+ roomInfo?.roomTitle}</div>
            </div>
            
            <DndProvider backend={HTML5Backend}>
                <div class="leftbox">
                    <Table />
                </div>
                <div class="rightbox">
                    <div class="oponent-status">
                        {
                            Players.map(player =>
                                (player?._id != playerId) ?
                                <Oppo_player player={player} host={host}></Oppo_player> :
                                null
                            )
                            
                        }
                    </div>
                    <div class="game-status">{Items}</div>
                    <div class="my-status">
                        <My_player playerName={playerName} playerId={playerId}
                        MyChips={MyChips} Chip={Chip} FixedChip={FixedChip} 
                        Dragable={Dragable} host={host}/>
                    </div>
                </div>
            </DndProvider>
        </div>
    )
}

export default withRouter(MG_GamePage)