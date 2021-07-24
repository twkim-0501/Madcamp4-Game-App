const GameroomModel = require("../models/Gameroom");
var current_num = 0;

//roomInfo라는 json에 roomtitle, 그리고
//userID에 개설자(User의 _id) 등을 넣어서 보냄
function addRoom(roomInfo){
    initplayers = [roomInfo.userID]

    const newRoom = new GameroomModel({
        roomindex: current_num++,
        roomtitle: roomInfo.roomtitle,
        players: initplayers
    })
    newRoom.save();
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