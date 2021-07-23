/*Gameroom API의 라우터와 요청을 처리하는 로직 */
const mongoose = require("mongoose");
const User = require("./User");
const GameroomSchema = new mongoose.Schema({
    roomindex: Number,
    roomtitle: String,
    players: [{type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

const GameroomModel = mongoose.model("gameroom", GameroomSchema);
module.exports = GameroomModel;