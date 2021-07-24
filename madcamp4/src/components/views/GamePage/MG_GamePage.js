import React, { useEffect, useState } from 'react'
import "./MG_GamePage.css"
import { makeStyles } from '@material-ui/core/styles';
import Oppo_player from './Oppo_player';
import io from "socket.io-client";
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from "react-dnd-html5-backend";
import {useLocation} from "react-router";

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
    const [Socket, setSocket] = useState()
    const [roomId, setRoomId] = useState()
    const [TotalItems, setTotalItems] = useState([])
    const [Players, setPlayers] = useState([1, 2, 3, 4])
    const [MyChips, setMyChips] = useState(10)
    const [Bet, setBet] = useState(0)
    const [Dragable, setDragable] = useState(true)
    

    useEffect(() => {
        setSocket(io('http://192.249.18.171:80'))
        // get room id, set players
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

    return (
        <div class="mainbox">
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
                    <div class="game-status">현재 마이너스 경매 블럭 상황들</div>
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

export default MG_GamePage