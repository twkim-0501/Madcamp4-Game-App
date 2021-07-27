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
            playerIdnSocket.push({"player": playerId, "socket": socket.id})
            //console.log("thisissocketidarray",playerIdnSocket);
            console.log('enterRoom')
            socket.join(roomInfo._id)
            socket.broadcast.emit('playerCome', usersInfo)
        });
    
        socket.on('startClick', (roomInfo,initChips,firstTurn, initBids) => {
            console.log('startClick')
            var randomBid = items.shuffle()
            socket.emit('startGame', {
                items: randomBid,
                Chips: initChips,
                curTurn: firstTurn,
                initBids: initBids
            })
            socket.broadcast.emit('startGame', {
                items: randomBid,
                Chips: initChips,
                curTurn: firstTurn,
                initBids: initBids
            })
        });

        socket.on('turnInfo', (turnInfo) => {
            console.log("turnInfo", turnInfo)
            socket.broadcast.emit('turnInfo', turnInfo)
        })

        socket.on('nackchal', (nackchalInfo) => {
            console.log("nackchalInfo", nackchalInfo)
            socket.broadcast.emit('nackchal', nackchalInfo)
        })
    
        socket.on('disconnect', function () {
            for(var i=0 ; i<playerIdnSocket.length ; i++){
                if(playerIdnSocket[i].socket==socket.id){
                    //console.log("leaveplayerId", playerIdnSocket[i].player)
                    socket.broadcast.emit('unexpectedLeave', playerIdnSocket[i].player);
                    playerIdnSocket.splice(i,1);
                }
            }
            console.log('user disconnected: ', socket.id);
        });
    });
}
    