var express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const app = express();
const port = 80;
const config = require('./config/key');
const {auth} = require('./middleware/auth');

const {User} = require("./src/models/User");

//route
const UserRouter = require('./src/routes/User');


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

app.use('/api/user/', UserRouter);



app.listen(port, () => {
    console.log(port+"에서 express 실행 중");
})
