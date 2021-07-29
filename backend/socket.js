const GameroomModel = require("./src/models/Gameroom");

Array.prototype.shuffle = function () {
    var length = this.length;

    while (length) {
        var index = Math.floor((length--) * Math.random());
        var temp = this[length];
        this[length] = this[index];
        this[index] = temp;
    }
    return this;
};
const items = new Array()
for(var i = -3; i > -36; i--) {
    items.push(i)
}

// console.log(items)
var playerIdnSocket = [];
module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log("socket connect!", socket.id)
        socket.on('enterRoom', (roomInfo, usersInfo, playerId) => {
            if(playerId == null){
                return;
            }
            playerIdnSocket.push({"player": playerId, "socket": socket.id})
            console.log("thisissocketidarray",playerIdnSocket);
            console.log('enterRoom')
            socket.join(roomInfo._id)
            socket.broadcast.emit('playerCome', usersInfo)
        });
    
        socket.on('startClick', (roomInfo,initChips,firstTurn, initBids,initTotal) => {
            console.log('startClick')
            var randomBid = items.shuffle()
            socket.emit('startGame', {
                items: randomBid,
                Chips: initChips,
                curTurn: firstTurn,
                initBids: initBids,
                initTotal: initTotal
            })
            socket.broadcast.emit('startGame', {
                items: randomBid,
                Chips: initChips,
                curTurn: firstTurn,
                initBids: initBids,
                initTotal: initTotal
            })
        });

        socket.on('turnInfo', (turnInfo) => {
            console.log("turnInfo", turnInfo)
            socket.broadcast.emit('turnInfo', turnInfo)
        })

        socket.on('nackchal', (nackchalInfo) => {
            console.log("nackchalInfo", nackchalInfo)
            socket.broadcast.emit('nackchal', nackchalInfo)
            socket.emit('nackchal', nackchalInfo)
        })

        socket.on('FinishGame', (Playing, scores, playerName) => {
            socket.broadcast.emit('FinishGame', {
                Playing: Playing,
                scores: scores,
                playerName: playerName
            })
            socket.emit(
                'FinishGame', {
                    Playing: Playing,
                    scores: scores,
                    playerName: playerName
                }
            )
        })
    
        socket.on('disconnect', function () {
            var leavePlayer = null;
            for(var i=0 ; i<playerIdnSocket.length ; i++){
                if(playerIdnSocket[i].socket==socket.id){
                    console.log("leaveplayerId", playerIdnSocket[i].player)
                    leavePlayer= playerIdnSocket[i].player;
                    playerIdnSocket.splice(i,1);
                }
            }
            if(leavePlayer !=null){
                console.log("삭제됐나요?", leavePlayer)
                GameroomModel.find({}, (err,res) => {
                    var currentRoom = res.filter(room => room.players.includes(leavePlayer));
                    var leaveRoom = currentRoom[0];
                    if(leaveRoom.players.length<=1){
                        GameroomModel.deleteOne({_id: leaveRoom._id}, (err,res) => {

                        })
                    }
                    else{
                        deleteLeave(leavePlayer)
                        console.log("where is leaveRoom", leaveRoom)
                        socket.broadcast.emit('unexpectedLeave', leaveRoom);
                    }
                    
                
                })
                
            }
            console.log('user disconnected: ', socket.id);
        });
    });
}



async function deleteLeave(leavePlayer){
    var allRooms = await GameroomModel.find({})
    var currentRoom = allRooms.filter(room => room.players.includes(leavePlayer));
    var leaveRoom = currentRoom[0]
    var afterplayers = leaveRoom.players.filter((player) => (player != leavePlayer))
    var updateRooms = await GameroomModel.findOneAndUpdate({_id: leaveRoom._id}, {
        players: afterplayers
    })
    console.log("updateresult",afterplayers, updateRooms)
    //console.log("leaveRoom", leaveRoom);
    
}