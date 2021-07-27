import React, { useEffect, useState } from "react";
import "./MG_GamePage.css";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Oppo_player from "./Oppo_player";
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

function MG_GamePage() {
  const history = useHistory();
  // const location = useLocation();
  // const [RoomId, setRoomId] = useState(location.state?.roomId)
  const user = useSelector((state) => state.user);
  const playerId = user.userData?._id;
  const playerName = user.userData?.name;
  const [Socket, setSocket] = useState();
  const [roomInfo, setRoomInfo] = useState();
  const [Items, setItems] = useState("Wait...");
  const [Players, setPlayers] = useState(["waiting"]);
  const [MyChips, setMyChips] = useState(10);
  const [Bet, setBet] = useState(0);
  const [Dragable, setDragable] = useState(true);
  const [Playing, setPlaying] = useState(false);

  const waiting = [0, 1, 2, 3, 4, 5];

  useEffect(() => {
    // setSocket(io('http://192.249.18.179:80'))
    setSocket(io("http://192.249.18.171:80"));
  }, []);

  useEffect(() => {
    if (Socket) {
      Socket.on("playerCome", (newPlayers) => {
        console.log("new player come");
        if (newPlayers) {
          setPlayers(newPlayers);
        }
      });

      Socket.on("playerLeave", (newPlayers) => {
        console.log("player leave");
        if (newPlayers) {
          setPlayers(newPlayers);
        }
      });

      Socket.on("startGame", (data) => {
        // 알람창 잠깐 뜨기
        console.log("Start Game!!!", data.items);
        setPlaying(true);
        setItems(data.items);
      });
    }
  });

  useEffect(() => {
    axios
      .post("/api/gameroom/findCurrentRoom", { user: playerId })
      .then((response) => {
        var tempRoomInfo = response.data;
        console.log("i found room Info", response.data);
        if (response.data) {
          axios
            .post("/api/gameroom/getPlayersInfo", response.data)
            .then((response) => {
              console.log("detail playersInfo", response.data);
              if (response.data) {
                setPlayers(response.data);
                Socket.emit("enterRoom", tempRoomInfo, response.data);
              }
            });
          setRoomInfo(response.data);
        }
      });
  }, [user]);

  useEffect(() => {
    if (MyChips <= 0) {
      setDragable(false);
    }
  }, [MyChips]);

  const exitRoom = (e) => {
    console.log("before exitRoom", playerId, roomInfo._id);
    axios
      .post("/api/gameroom/exitRoom", {
        playerId: playerId,
        roomId: roomInfo._id,
      })
      .then((response) => {
        var tempRoomInfo = response.data;
        console.log("exitRoom");
        if (response.data) {
          axios
            .post("/api/gameroom/getPlayersInfo", response.data)
            .then((response) => {
              console.log("detail playersInfo", response.data);
              if (response.data) {
                Socket.emit("exitRoom", tempRoomInfo, response.data);
              }
              history.push("/");
            });
        }
      });
  };

  const startClick = () => {
    Socket.emit("startClick", roomInfo);
  };

  const Chip = () => {
    const [{ isDragging, canDrag }, drag] = useDrag({
      type: "chip",
      item: { name: "chip" },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult();
        if (dropResult && dropResult.name === "table") {
          setMyChips(MyChips - 1);
          setBet(Bet + 1);
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        canDrag: monitor.canDrag(),
      }),
    });

    const opacity = isDragging ? 0.4 : 1;

    return (
      <div className="chip" ref={drag} style={{ opacity }}>
        {canDrag ? "true" : "false"}
      </div>
    );
  };

  const FixedChip = () => {
    return <div className="chip">fix</div>;
  };

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

  const box = () => {
      
  }

  return (
    <div class="mainbox">
      <DndProvider backend={HTML5Backend}>
        <div class="leftbox">
          {waiting.map((index) =>
            index % 2 == 0 ? (
              Players[index] != null ? (
                <div class="opo-player-left">
                  <Oppo_player player={Players[index]} />
                  {Players[index]?._id == playerId ? (
                    <div>
                      {Playing ? MyChips : null}
                      {Playing ? Dragable ? <Chip /> : <FixedChip /> : null}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div class="opo-player-left">waiting</div>
              )
            ) : null
          )}
        </div>

        <div class="middlebox">
          <div class="roomTitle"> {"방 번호: " + roomInfo?.roomIndex} </div>
          <button class="startBtn" onClick={startClick}>
            Game Start
          </button>
          
          <Table />
          <button class="exitBtn" onClick={exitRoom}>
            나가기
          </button>
        </div>

        <div class="rightbox">
          {waiting.map((index) =>
            index % 2 == 1 ? (
              Players[index] != null ? (
                <div class="opo-player-right">
                  <Oppo_player player={Players[index]} />
                  {Players[index]?._id == playerId ? (
                    <div>
                      {Playing ? MyChips : null}
                      {Playing ? Dragable ? <Chip /> : <FixedChip /> : null}
                    </div>
                  ) : null}
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
