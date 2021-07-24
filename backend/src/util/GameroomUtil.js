const GameroomModel = require("../models/Gameroom");
var current_num = 0;

//roomInfo라는 json에 roomtitle, 그리고
//userID에 개설자(User의 _id) 등을 넣어서 보냄
function addRoom(roomInfo,callback){
    initplayers = [roomInfo.user._id]

    const newRoom = new GameroomModel({
        roomIndex: current_num++,
        roomTitle: roomInfo.roomName,
        players: initplayers
    })
    newRoom.save((err,res) => {
        callback(res);
    });
}

function getAll(callback){
    GameroomModel.find({}, (err, res) =>{
        callback(res)
    });
}

//다른 파일에서 require로 불러와서 .addRoom 이런식으로 붙여서 사용 가능
module.exports = {
    addRoom,
    getAll
};