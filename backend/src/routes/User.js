const express = require("express");
//const db = require("../../database/Userdb");
const {auth} = require('../../middleware/auth');
const router = express.Router();

const User = require("../models/User");
router.post('/register', (req,res) => {
    //회원가입할 때 필요한 정보들
    const user = new User(req.body)
    user.save((err, userInfo) => {
        if(err) return res.json({ok: false, err})
        return res.status(200).json({
            ok: true
        })
    })
})

router.post('/login', (req,res) => {
  console.log(req.body)
    //요청된 이메일이 db에 있는지 확인
    User.findOne({email: req.body.email}, (err,user) => {
      if(!user){
        return res.json({
          ok: false,
          message: "제공된 이메일에 해당하는 유저가 없습니다."
        })
      }
  
      //요청된 이메일이 db에 있다면 비밀번호가 맞는지 확인
      user.comparePassword(req.body.password, (err, isMatch) => {
        if(!isMatch)
          return res.json({ok: false, message: "비밀번호가 틀렸습니다."})
        //비밀번호가 맞다면 토큰을 생성 
        user.generateToken((err, user)=> {
          if(err) return res.status(400).send(err);
  
          // 토큰을 저장한다. 쿠키에!
          res.cookie("x_auth", user.token)
          .status(200)
          .json({ok: true, userId: user._id})
        })
      })
    })
  })

router.get('/logout', auth, (req,res)=>{
    User.findOneAndUpdate({_id: req.user._id}, 
        {token: ""}
        , (err,user) => {
        if(err) return res.json({ok: false, err});
        console.log("logout success");
        return res.status(200).send({
            ok: true
        })
    })
})

router.get('/auth', auth , (req,res) => {
    //middleware auth를 통과했다면
    res.status(200).json({
        _id: req.user._id,
        //role이 0이면 일반유저
        isAuth: true,
        isAdmin: req.user.role === 0 ? false : true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

module.exports = router;