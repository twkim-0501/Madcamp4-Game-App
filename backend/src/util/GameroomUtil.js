const GameroomModel = require("../models/Gameroom");
const UserModel = require("../models/User");
var current_num = 0;

//roomInfo라는 json에 roomtitle, 그리고
//userID에 개설자(User의 _id) 등을 넣어서 보냄
function addRoom(roomInfo,callback){
   //console.log(roomInfo)
    initplayers = [roomInfo.user._id, ]

    const newRoom = new GameroomModel({
        roomIndex: current_num++,
        roomTitle: roomInfo.roomName,
        players: initplayers
    })
    newRoom.save((err,res) => {
        //console.log("newroom id", newRoom._id)
        callback(newRoom._id);
    });
}

function getAll(callback){
    GameroomModel.find({}, (err, res) =>{
        callback(res)
    });
}

function getAllrooms(callback){
    const numArr=['A',2,3,4,5,6,7,8,9,10,'J','Q','K']
    GameroomModel.find({}, (err,res) => {
        var roomsInfo = res;
        var roomsView = []
        var index = 0;
        roomsInfo.map( async (room, index) =>  {
            var randomNum = Math.floor(Math.random()*13)
            //console.log("getAllroomsTest",room)
            //var playersInfo = await GameroomModel.findOne({_id: room._id}).populate('players')
            await GameroomModel.findOne({_id: room._id}, (err,res) => {
                //var playersInfo = res.populate('players')
                var playersInfo = res
                //console.log("getAllroomsTest2",playersInfo.players)
                UserModel.findOne({_id: playersInfo.players[0]}, (err,res) => {
                    
                    if(playersInfo.players.length == 0){
                        roomsView.push({name: "-Empty-", people: playersInfo.players.length, id: numArr[randomNum], _id: room._id})
                        if(roomsInfo.length-1 == index){
                            //console.log("roomsView",roomsView)
                            callback(roomsView)
                        }
                    }
                    else{
                        var hostname = res.name
                        roomsView.push({name: hostname, people: playersInfo.players.length, id: numArr[randomNum], _id: room._id})
                        if(roomsInfo.length-1 == index){
                            //console.log("roomsView",roomsView)
                            callback(roomsView)
                        }
                    }
                    //console.log("i want to watch roomsView", roomsView, index)
                })
            })
        })
        
    })
}
async function getAllrooms2(callback){
    const numArr=['A',2,3,4,5,6,7,8,9,10,'J','Q','K']
    var roomsArray = await GameroomModel.find({})
    //console.log("roomsArray",roomsArray)
    var UserArray = await UserModel.find({})
    //console.log("UserArray", UserArray)
    var roomsView = [];
    roomsArray.map((room,index) => {
        var randomNum = Math.floor(Math.random()*13)
        //console.log("players",room.players)
        if(room.players.length<1){
            roomsView.push({name: "-Empty-", people: room.players.length, id: numArr[randomNum], _id: room._id})
        }
        else{
            console.log("hostid", room.players[0])
            for(var i = 0 ; i < UserArray.length ; i++){
                //console.log("UserInfo",UserArray[i]._id)
                if(UserArray[i]._id.equals(room.players[0])){
                    //console.log("here?")
                    roomsView.push({name: UserArray[i].name, people: room.players.length, id: numArr[randomNum], _id: room._id})
                    console.log("roomsView",roomsView)
                }
            }
        }
    })
    callback(roomsView)
}

function joinRoom(joinInfo, callback){
    const {roomId, playerId} = joinInfo;

    console.log("joinInfo",joinInfo)
    GameroomModel.findOne({_id: roomId}, (err,res) => {
        if(res.players == null){
            callback();
        }
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
function findCurrentRoom(playerId, callback){
    //console.log("playerid", playerId)
    if(playerId){
        GameroomModel.find({}, (err,res) => {
            var currentRoom = res.filter(room => room.players.includes(playerId));
            console.log("currentRoom", currentRoom);
            callback(currentRoom[0]);
        })
    }
    else{
        callback()
    }
}
function exitRoom(exitInfo, callback){
    const {playerId, roomId} = exitInfo;
    console.log("exitInfo",exitInfo)
    if(roomId == null){
        callback();
    }
    GameroomModel.findOne({_id: roomId}, (err, res) => {
        if(res == null){
            callback()
        }
        var afterplayers = res.players.filter((player) => (player != playerId));
        console.log("afterplayers",afterplayers);
        if(res.players.includes(playerId)){
            GameroomModel.findOneAndUpdate({_id: roomId}, {
                players: afterplayers
            },
            (err, res) => {callback(res);});
        }
        else{
            console.log("현재 게임 방에 존재하지 않습니다.");
            callback();
        }
    })
}

async function getPlayersInfo(roomInfo, callback){
    const roomId = roomInfo._id;
    var playerList = await GameroomModel.findOne({_id: roomId}).populate('players')
    //console.log("playerlist",playerList.players);
    callback(playerList.players);
}

//다른 파일에서 require로 불러와서 .addRoom 이런식으로 붙여서 사용 가능
module.exports = {
    addRoom,
    getAll,
    getAllrooms,
    getAllrooms2,
    joinRoom,
    exitRoom,
    findCurrentRoom,
    getPlayersInfo
};