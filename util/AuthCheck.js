class PassGetRequest {
    passAuth(req, res) {
        if (req.method === 'GET') {
            return true;
        }
        return false;
    }
}

class PostAuthCheck extends PassGetRequest {}

exports.PostAuthCheck = PostAuthCheck;