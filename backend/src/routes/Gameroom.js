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

router.get('/getAllrooms', (req,res) => {
    db.getAllrooms((rooms) => {
        console.log("rooms",rooms)
        res.status(200).send(rooms);
    })
})

router.post('/addRoom', (req,res) => {
    console.log("here")
    db.addRoom(req.body, (id)=>{
        res.status(200).send(id);
    })
})

router.post('/findCurrentRoom', (req,res) => {
    //console.log("route user", req.body)

    db.findCurrentRoom(req.body.user, (_id) => {
        //console.log('find room', _id)
        res.status(200).send(_id);
    })
})

router.post('/joinRoom', (req,res) => {
    //console.log(req.body)
    db.joinRoom(req.body, ()=> {
        res.status(200).send();
    })
})

router.post('/exitRoom', (req,res) => {
    //console.log(req.body)
    db.exitRoom(req.body, (_id)=> {
        res.status(200).send(_id);
    })
})

router.post('/getPlayersInfo', (req,res) => {
    //console.log(req.body)
    db.getPlayersInfo(req.body, (infos) => {
        res.status(200).send(infos);
    })
})

module.exports = router;