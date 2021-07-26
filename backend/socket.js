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
            console.log("thisissocketidarray",playerIdnSocket);
            console.log('enterRoom')
            socket.join(roomInfo._id)
            socket.broadcast.emit('playerCome', usersInfo)
        });
    
        socket.on('exitRoom', (roomInfo, usersInfo) => {
            console.log("exit!")
            socket.broadcast.emit('playerLeave', usersInfo)
            socket.leave(roomInfo._id)
        });
    
        socket.on('startClick', (roomInfo) => {
            console.log('startClick')
            io.to(roomInfo._id).emit('startGame', {
                items: items

            })
        });
    
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
    