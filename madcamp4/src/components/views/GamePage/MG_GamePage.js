import React, { useEffect, useState } from 'react'
import "./MG_GamePage.css"
import {withRouter} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Oppo_player from './Oppo_player';
import io from "socket.io-client";
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from "react-dnd-html5-backend";
import {useLocation} from "react-router";
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

function MG_GamePage() {
    // const location = useLocation();
    // const [RoomId, setRoomId] = useState(location.state?.roomId)
    
    const user = useSelector(state => state.user)
    const [PlayerId, setPlayerId] = useState(user.userData?._id)
    const [Socket, setSocket] = useState()
    const [roomId, setRoomId] = useState()
    const [TotalItems, setTotalItems] = useState([])
    const [Players, setPlayers] = useState([1, 2, 3, 4])
    const [MyChips, setMyChips] = useState(10)
    const [Bet, setBet] = useState(0)
    const [Dragable, setDragable] = useState(true)
    

    useEffect(() => {
        setSocket(io('http://192.249.18.171:80'))
        console.log(PlayerId)
        axios.post('/api/gameroom/findCurrentRoom', {user: PlayerId})
            .then(response => {
                console.log("i found room id", response.data)
            })
    }, [])

    useEffect(() => {
        if (MyChips <= 0) {
            setDragable(false)
        }
    }, [MyChips])

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
    const exitRoom = (e) => {
        axios.post('/api/gameroom/exitRoom',
            {playerId: user.userData?._id}
        )
    }

    return (
        <div class="mainbox">
            <button class="exitBtn" onClick={exitRoom}>나가기</button>
            <DndProvider backend={HTML5Backend}>
                <div class="leftbox">
                    <Table />
                </div>
                <div class="rightbox">
                    <div class="oponent-status">
                        {
                            Players.map(player =>
                                    (<Oppo_player player={player}></Oppo_player>)
                                )
                        }
                    </div>
                    <div class="game-status">{PlayerId}</div>
                    <div class="my-status">
                        {MyChips}
                        {
                            Dragable
                            ? <Chip />
                            : <FixedChip /> 
                        }
                    </div>
                </div>
            </DndProvider>
        </div>
    )
}

export default withRouter(MG_GamePage)