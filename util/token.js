const jwt = require('jsonwebtoken');
const newToken = user => {
    const payload = {
        username: user.username,
        _id: user._id,
    };
    return jwt.sign(payload, 'SECRET_KEY', {
        expiresIn: '100d',
    });
};

module.exports = {
    newToken,
}