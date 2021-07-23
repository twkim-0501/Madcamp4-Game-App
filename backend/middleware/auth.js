const {User} = require("../src/models/User");

let auth = (req,res,next) => {
//인증처리

//클라이언트에서 쿠키를 가져온다.
    let token = req.cookies.x_auth;
//토큰을 복호화 해서 유저를 찾는다.
    User.findByToken(token, (err,user)=>{
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true})
        req.token = token;
        req.user = user;
        next();
    })
//유저가 있으면 인증 오케

//유저가 없으면 인증 ㄴㄴ
}

module.exports= {auth};