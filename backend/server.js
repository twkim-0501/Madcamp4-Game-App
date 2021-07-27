var express = require('express');
const path = require("path");
const http = require('http');
const socketIO = require('socket.io');
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const app = express();
const port = 80;
const config = require('./config/key');
const {auth} = require('./middleware/auth');

const {User} = require("./src/models/User");

//server instance
const server = http.createServer(app);
app.use(cors());

// socketio 생성후 서버 인스턴스 사용
const io = socketIO(server, {
	cors: {
		origin: '*'
	}
});

require('./socket.js')(io);


//route
const UserRouter = require('./src/routes/User');
const GameroomRouter = require('./src/routes/Gameroom');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})

const db = mongoose.connection;
db.once("open", function() {
  console.log("DB connected!");
});

app.get('/', (req, res) => {
    res.status(418).send("Madcamp week 4");
});

app.post('/score', (req,res) => {
  console.log(req.body);
  res.status(200).send();
})

app.use('/api/user/', UserRouter);
app.use('/api/gameroom/', GameroomRouter);


server.listen(port, () => {
    console.log(port+"에서 express 실행 중");
})
