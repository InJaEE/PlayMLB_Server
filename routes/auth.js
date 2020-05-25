const router = require('express').Router();
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');
const { newToken } = require('../util/token');

router.post('/login', (req, res) => {
    const { userId, password } = req.body;
    
    UserModel.findOne({
        userId, provider:'local',
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
                    userId: user.userId,
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
    const { userId, password, nickname } = req.body;
    
    bcrypt.hash(password, 10, (err, hashedPwd) => {
        if(err){
            console.error(err);
            return res.status(500).json({ err });
        } else{
            const newUser = new UserModel({
                userId,
                password: hashedPwd,
                nickname,
            });
            newUser.save((err, saved) => {
                if(err){
                    let errLog = { msg:'알 수 없는 에러가 발생하였습니다.' };
                    if(err.name === 'MongoError' && err.keyPattern.nickname){
                        errLog.msg = 'used nickname'
                    } else if(err.name === 'MongoError' && err.keyPattern.userId){
                        errLog.msg = 'used id'
                    }
                    res.status(409).json(errLog);
                } else{
                    console.log(saved);
                    res.send(saved);
                }
            })
        }
    });
});

router.post('/kakao', (req, res) => {
    const { userId, nickname, snsId } = req.body;
    
    UserModel.findOne({ userId, snsId, provider: 'kakao' })
    .then(user => {
        if(!user){
            const newUser = new UserModel({
                userId,
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
        res.status(200).json({
            succes: true,
            message: 'Kakao Login Success',
            userId: user.userId,
            nickname: user.nickname,
            token,
        })
    })
})

module.exports = router;