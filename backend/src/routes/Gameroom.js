const express = require("express");
const router = express.Router();
const {Gameroom} = require("../models/Gameroom");
const db = require("../util/GameroomUtil");//db관련 함수 처리 모아놓은 파일

//room json들의 배열을 send함
router.get('/getAll', (req,res) => {
    db.getAll((rooms) => {
        res.status(200).send(rooms);
    })
})
router.post('addroom', (req,res) => {
    db.addRoom(req.body, ()=>{
        res.status(200).send();
    })
})

module.exports = router;