const router = require('express').Router();
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');
const { newToken } = require('../util/token');

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log("###", req.body);
    
    UserModel.findOne({
        username, provider:'local',
    })
    .then(user => {
        if(!user){
            res.status(401).send("존재하지 않는 아이디입니다.");
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if(err){
                res.status(500).send('Internal Server Error');
            }
            if(result){
                const token = newToken(user);
                const loggedInUser = {
                    username: user.username,
                    nickname: user.nickname,
                };
                res.status(200).json({
                    success: true,
                    user: loggedInUser,
                    message: 'Login Success',
                    token,
                });
            } else{
                res.status(401).json('잘못된 비밀번호입니다.');
            }
        })
    })
    .catch(err => {
        res.status(500).json('Internal Server Error');
        throw err;
    });
    
});

router.post('/signup', (req, res) => {
    const { username, password, nickname } = req.body;
    bcrypt.hash(password, 10, (err, hashedPwd) => {
        if(err){
            console.error(err);
            return res.status(500).json({ err });
        } else{
            const newUser = new UserModel({
                username,
                password: hashedPwd,
                nickname,
            });
            newUser.save((err, saved) => {
                if(err){
                    console.error(err);
                    res.status(409).send(err);
                } else{
                    console.log(saved);
                    res.send(saved);
                }
            })
        }
    });
});

router.post('/kakao', (req, res) => {
    const { username, nickname, snsId } = req.body;
    console.log("@@#", username ,nickname, snsId);
    

    UserModel.findOne({username, snsId, provider: 'kakao'})
    .then(user => {
        if(!user){
            const newUser = new UserModel({
                username,
                password: 'password',
                nickname,
                provider: 'kakao',
                snsId,
            });
            newUser.save((err, saved) => {
                if(err){
                    console.error(err);
                    res.status(409).send(err);
                } else{
                    console.log(saved);
                    res.send(saved);
                }
            })
        }
        const token = newToken(user);
        const loggedInUser = {
            username: user.username,
            nickname: user.nickname,
        }
        res.status(200).json({
            succes: true,
            user: loggedInUser,
            message: 'Kakao Login Success',
            token,
        })
        
    })

})

module.exports = router;