const GameroomModel = require("../models/Gameroom");
var current_num = 0;

//roomInfo라는 json에 roomtitle, 그리고
//userID에 개설자(User의 _id) 등을 넣어서 보냄
function addRoom(roomInfo,callback){
    console.log(roomInfo)
    initplayers = [roomInfo.user._id]

    const newRoom = new GameroomModel({
        roomIndex: current_num++,
        roomTitle: roomInfo.roomName,
        players: initplayers
    })
    newRoom.save((err,res) => {
        console.log("newroom id", newRoom._id)
        callback(newRoom._id);
    });
}

function getAll(callback){
    GameroomModel.find({}, (err, res) =>{
        callback(res)
    });
}

function joinRoom(joinInfo, callback){
    const {roomId, playerId} = joinInfo;
    GameroomModel.findOne({_id: roomId}, (err,res) => {
        if(res.players.includes(playerId)){
            callback();
        }
        else{
            GameroomModel.findOneAndUpdate({_id: roomId}, {
                players: [...res.players, playerId]
            },
            (error) => {callback();});
        }
    })
}

//다른 파일에서 require로 불러와서 .addRoom 이런식으로 붙여서 사용 가능
module.exports = {
    addRoom,
    getAll,
    joinRoom
};