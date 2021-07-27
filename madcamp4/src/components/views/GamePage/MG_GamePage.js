import React, { useEffect, useState } from 'react'
import "./MG_GamePage.css"
import { withRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Oppo_player from './Oppo_player';
import My_player from './My_player';
import io from "socket.io-client";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useLocation, useHistory } from "react-router";
import { useSelector } from "react-redux";
import axios from "axios";
import Hexagon from "react-hexagon";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

let Socket
function MG_GamePage() {
    const user = useSelector(state => state.user)
    const playerId = user.userData?._id
    const playerName = user.userData?.name
    const [roomInfo, setRoomInfo] = useState()
    const [Items, setItems] = useState("Wait...")
    const [myIndex, setMyIndex] = useState(-1)
    const [Players, setPlayers] = useState(["waiting"])
    const [host, setHost] = useState()
    const [Bet, setBet] = useState(0)
    const [Dragable, setDragable] = useState(true)
    const [Playing, setPlaying] = useState(false)
    const [Chips, setChips] = useState([])
    const [curTurn, setCurTurn] = useState(0)
    const [curBid, setCurBid] = useState(0)
    const [playerBids, setPlayerBids] = useState([])
    const [BidStatus, setBidStatus] = useState([])//플레이어별 유효 bid 총합과 index
    
    const waiting = [0, 1, 2, 3, 4, 5];
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
            var bidItems = data.items
            setPlaying(true)
            setCurBid(bidItems.pop())
            setItems(bidItems)
            console.log('Start Game!!!',bidItems)
            setChips(data.Chips)
            setBet(0)
            setCurTurn(data.curTurn)
            setPlayerBids(data.initBids)
            setBidStatus(data.initTotal)
        })
        Socket.on('unexpectedLeave', (leaveId) => {
            // if(playerId == null){
            //     return;
            // }
            axios.post('/api/gameroom/findCurrentRoom', {user: leaveId})
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
        } )
        Socket.on('turnInfo', (turnInfo) => {
            setChips(turnInfo.Chips)
            setBet(turnInfo.Bet)
            setCurTurn(turnInfo.curTurn)
        })

        Socket.on('nackchal', (nackchalInfo) => {
            console.log("낙찰상황", nackchalInfo.playerBids)
            setPlayerBids(nackchalInfo.playerBids)
            setCurBid(nackchalInfo.curBid)
            setBidStatus(nackchalInfo.BidStatus)
            setItems(nackchalInfo.Items)
            console.log("낙찰직후status", nackchalInfo.BidStatus)
        })

        Socket.on('FinishGame', (finishInfo) => {
            setPlaying(finishInfo.Playing)
            console.log("게임결과", finishInfo.scores, finishInfo.playerName)
        })
    }, [])

    //player 업데이트
    useEffect(() => {
        if(Players != null){
            console.log('hostplayer',Players[0])
            setHost(Players[0])
        }
        for(var i = 0 ; i <= Players.length ; i++){
            if(Players[i]?._id == playerId){
                console.log("myindex",i);
                setMyIndex(i);
            }
        }
    }, [Players])

    useEffect(() => {
        if(playerId != null){
            console.log("before enterroom id",playerId)
            axios.post('/api/gameroom/findCurrentRoom', { user: playerId })
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
        }
        
    }, [user])

    useEffect(() => {
        if (Chips[myIndex] <= 0) {
            setDragable(false)
        }
        else{
            setDragable(true)
        }
        
    }, [Chips])
    useEffect(() => {
        if(curTurn == myIndex && Chips[myIndex]==0 ){
            alert("칩이 없어 강제 낙찰됨!")
            setTimeout(function(){
                NackChalClick();
            },3000)
        }
    },[curTurn])
    useEffect(() => {
        if(Items.length < 1){
            setPlaying(false)
            //alert("게임 종료")
            var scores= whoIsWinner()
            Socket.emit('FinishGame', false, scores, playerName )
            return;
        }
        
    }, [Items])

    const startClick = () => {
        var initChips = Players.map(player => 10)
        var initBids = Players.map(player => [])
        var temp = {totalBids: 0, activeIndex: []}
        var initTotal = Players.map(player => temp)
        var firstTurn = Ordering()
        console.log("firstTurn", firstTurn)
        Socket.emit('startClick', roomInfo, initChips, firstTurn, initBids, initTotal)
        //첫 칩 세팅
        console.log("initChips and Bids", initChips, initBids, initTotal)
        setChips(initChips);
    }

    
    const Ordering = () => {
        //var ResultOrder = Players.sort(() => Math.random() - 0.5);
        var FirstPlayer = Math.floor(Math.random() * Players.length)
        //첫 순서 보여주기
        console.log("start ordering", FirstPlayer);
        setCurTurn(FirstPlayer);
        return(FirstPlayer)
    }


    const Chip = () => {
        const [{ isDragging, canDrag }, drag] = useDrag({
            type: 'chip',
            item: { name: 'chip' },
            end: (item, monitor) => {
                const dropResult = monitor.getDropResult()
                if (dropResult && dropResult.name === 'table') {
                    //chip array 갱신
                    Chips.splice(myIndex, 1, Chips[myIndex] - 1);
                    
                    console.log(Chips)
                    setChips(Chips)
                    setBet(Bet + 1)
                    if(curTurn == (Players.length - 1)){
                        setCurTurn(0)
                        Socket.emit('turnInfo', {Chips: Chips, Bet: Bet+1, curTurn: 0})
                    }
                    else{
                        setCurTurn(curTurn+1)
                        Socket.emit('turnInfo', {Chips: Chips, Bet: Bet+1, curTurn: curTurn+1})
                    }
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
                {canDrag ? "베팅" : "베팅불가"}
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
  
    const NackChalClick = () => {
        /*다음턴으로 바뀜, Bet의 칩을 다가져가고 내 chip 오름, 상품도 가져감.
        */
        Chips.splice(myIndex, 1, Chips[myIndex] + Bet);
        setBet(0)
        setChips(Chips)
        if(Chips[myIndex]>0){
            setDragable(true)
        }
        setCurTurn(myIndex)
        Socket.emit('turnInfo', {Chips: Chips, Bet: 0, curTurn: myIndex})
        //낙찰 아이템 가져오기
        playerBids[myIndex].push(curBid)
        //array 정렬
        playerBids[myIndex].sort(function(a,b) {
            return b-a;
        })
        var tempBidStatus =DFA_Bids(playerBids[myIndex])
        //console.log("tempmyBids", playerBids[myIndex])
        console.log("낙찰상황배열", tempBidStatus)
        playerBids.splice(myIndex, 1, playerBids[myIndex])
        BidStatus.splice(myIndex, 1 , tempBidStatus)
        var tempItems = Items
        var nackchalItem = tempItems.pop()
        setCurBid(nackchalItem)
        //setItems(tempItems)
        
        Socket.emit('nackchal', {playerBids: playerBids, curBid: nackchalItem, Items: tempItems, BidStatus: BidStatus})

    }

    const DFA_Bids = (arr) => {
        //var arr = [-1,-3,-4,-5,-7,-9,-10, -12,-13,-14]
        var activeIndex = [];
        var inSequence = false;
        var i = 0;
        var result = 0;
        var prev = 1;
        while(i < arr.length){
            inSequence = ((prev - arr[i])==1); // 연속된 상태인지 체크
            if(inSequence == false){
                result += arr[i]
                activeIndex.push(i);
            }
            prev = arr[i]
            i++
        }
        console.log("DFA result",result, activeIndex)
        return {totalBids: result, activeIndex: activeIndex}
    }

    const whoIsWinner = () => {
        var scores = BidStatus.map((status, index) => (Chips[index] + status.totalBids))
        console.log("totalscore", scores)
        return scores
    }
    // const whoIsWinner

    const Table = () => {
        const [{ canDrop, isOver }, drop] = useDrop({
          accept: "chip",
          drop: () => ({ name: "table" }),
          collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
          }),
        });
    
        return (
          <div class="cardShow" ref={drop}>
            {/* <Hexagon className='hexTable' style={{stroke: '#000000'}} /> */}
            -3
          </div>
        );
      };



  

  return (
    <div class="mainbox">
      <DndProvider backend={HTML5Backend}>
        <div class="leftbox">
          {waiting.map((index) =>
            index % 2 == 0 ? (
              Players[index] != null ? (
                <div class="opo-player-left">
                  <Oppo_player 
                        player={Players[index]} host= {host} playerBids={playerBids}
                            BidStatus={BidStatus} Playing={Playing}
                            myIndex = {index}
                    />
                    {
                        (Players[index]?._id == playerId)
                            ? <div>
                                {Playing ? Chips[myIndex] : null}
                                {Playing && (curTurn==myIndex)
                                    ? Dragable ? <Chip /> : <FixedChip />
                                    : null}
                            </div>
                            : null
                    }
                </div>
              ) : (
                <div class="opo-player-left">waiting</div>
              )
            ) : null
          )}
        </div>

        <div class="middlebox">
            <div class="roomTitle"> {"방 번호: " + roomInfo?.roomIndex} </div>
            <button class="startBtn" onClick={startClick}>Game Start</button>
            {
                Playing ?
                <div>
                    <div>{"현재 입찰 상품: " + curBid}</div>
                    {
                        curTurn==myIndex ?
                        <button class="nackchalBtn" onClick={NackChalClick}>NackChalHagy</button> :
                        null
                    }
                </div> :
                null
            }
            <Table />
            <a href='/'>
                <button class="exitBtn">나가기</button>
            </a>
            <div>{"Bet: "+Bet}</div>
            {
                Playing ?
                <div>{"Current Turn: "+ Players[curTurn]?.name}</div> :
                null
            }
        </div>

        <div class="rightbox">
          {waiting.map((index) =>
            index % 2 == 1 ? (
              Players[index] != null ? (
                <div class="opo-player-right">
                  <Oppo_player 
                        player={Players[index]} host= {host} playerBids={playerBids}
                            BidStatus={BidStatus} Playing={Playing}
                            myIndex = {index}
                    />
                    {
                        (Players[index]?._id == playerId)
                            ? <div>
                                {Playing ? Chips[myIndex] : null}
                                {Playing && (curTurn==myIndex)
                                    ? Dragable ? <Chip /> : <FixedChip />
                                    : null}
                            </div>
                            : null
                    }
                </div>
              ) : (
                <div class="opo-player-right">waiting</div>
              )
            ) : null
          )}
        </div>
      </DndProvider>
    </div>
  );
}
export default withRouter(MG_GamePage);
