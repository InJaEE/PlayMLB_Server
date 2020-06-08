class Validate {
    passAuth(req, res) {
        if (req.method === 'GET') {
            return true;
        }
        return false;
    }
}
module.exports = Validate;