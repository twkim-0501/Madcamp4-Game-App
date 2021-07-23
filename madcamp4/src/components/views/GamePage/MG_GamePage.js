import React, { useEffect, useState } from 'react'
import "./MG_GamePage.css"
import { makeStyles } from '@material-ui/core/styles';
import Oppo_player from './Oppo_player';
import socketIOClient from "socket.io-client";
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
    const socket = socketIOClient('/api');
    const [Posts, setPosts] = useState([])
    const totalitems = [-1,-2,-3,-4,-5,-6,-7,-8,-9]
    var players = [0,1,2,3,4];
    var variable1;
    useEffect(() => {
    }, [])

    return (
        <div class="mainbox">
            <div class="leftbox">
                <div class="table">대충 칩들</div>
            </div>
            <div class="rightbox">
                <div class="oponent-status">
                    {
                        players.map(player =>
                                (<Oppo_player player={player}></Oppo_player>)
                            )
                    }
                </div>
                <div class="game-status">현재 마이너스 경매 블럭 상황들</div>
                <div class="my-status">플레이어 게임상태박스</div>
            </div>
        </div>
    )
}

export default MG_GamePage