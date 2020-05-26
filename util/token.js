const jwt = require('jsonwebtoken');
const tokenKey = 'SECRET_KEY';
const UserModel = require('../models/UserModel');
const PostValidate = require('./PostValidate');

const newToken = user => {
    const payload = {
        username: user.username,
        _id: user._id,
    };
    return jwt.sign(payload, tokenKey, {
        expiresIn: '100d',
    });
};

const verifyToken = token => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, tokenKey, (err, payload) => {
            if(err){
                return reject(err);
            }
            resolve(payload);
        });
    });
};

const urlValidate = {
    "/post": new PostValidate(),
}

const authenticateUser = async(req, res, next) => {
    let urlChk = urlValidate[req.baseUrl];
    if (urlChk.enabled(req, res)){
        next();
        return;
    }
    
    if(!req.headers.authorization){
        return res.status(401).json({ message: 'token must be included' });
    }
    const token = req.headers.authorization;
    let payload;
    try {
        payload = await verifyToken(token);
    } catch (err) {
        return res.status(401).json({ message: 'token is invalid' });
    }
    const user = await UserModel.findById(payload._id)
        .select('-password')
        .lean()
        .exec()
        
    if(!user){
        return res.status(401).json({ message: 'user not found '})
    }
    req.user = user;
    next();


}


module.exports = {
    newToken, authenticateUser,
}