import React, { useEffect, useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from "react-dnd-html5-backend";
import './Game.css'
import Axios from 'axios';

function GamePage() {

    // const [Semester, setSemester] = useState("2021S")
    // const [userList, setuserList] = useState([]);

    // const variable = {
    //     semester: Semester
    // }


    // const updateSemester = (selectSemester) => {
    //     setSemester(selectSemester)
    //     console.log("updateSemester");
    // }


    const [MyChips, setMyChips] = useState(10)
    const [Bet, setBet] = useState(0)
    const [Dragable, setDragable] = useState(true)
    
    useEffect(() => {
        if (MyChips <= 8) {
            setDragable(false)
        }
        console.log("chips change", MyChips, Dragable)
    }, [MyChips])

    const MovableItem = () => {
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
            <div className='movable-item' ref={drag} style={{ opacity }}>
                {canDrag? "true" : "false"}
                {/* We will move this item */}
            </div>
        )
    }

    const FixItem = () => {
        return (
            <div className='movable-item'>
                fixed
            </div>
        )
    }

    const FirstColumn = () => {
        return (
            <div className='column first-column'>
                {MyChips}
                <br/>
                <br/>
                {Dragable
                    ? <MovableItem />
                    : <FixItem /> }
                
            </div>
        )
    }

    const SecondColumn = () => {
        const [{ canDrop, isOver }, drop] = useDrop({
            accept: 'chip',
            drop: () => ({ name: 'table' }),
            collect: (monitor) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop()
            })
        })
        // console.log(('options', { canDrop, isOver }))
        return (
            <div className='column second-column' ref={drop}>
                {Bet}
            </div>
        )
    }

    return (
        <div className="container">
            <DndProvider backend={HTML5Backend}>
                <FirstColumn />
                <SecondColumn />
            </DndProvider>
        </div>

    )
}

export default GamePage