var express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();
const port = 80;
const config = require('./config/key');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const {User} = require("./src/models/User");

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

app.post('/register', (req,res) => {
    //회원가입할 때 필요한 정보들
    const user = new User(req.body)
    user.save((err, userInfo) => {
        if(err) return res.json({success:false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(port, () => {
    console.log(port+"에서 express 실행 중");
})
