'use strict';

function getAuth(req, res) {
    let authHeader = req.get('Authorization');

    if (!authHeader) {
        res.status(401);
        res.send('Please provide username/password');
        return;
    }
    let payload = authHeader.split('Basic ')[1];
    let decoded = Buffer.from(payload, 'base64').toString();
    return decoded.split(':');
}

module.exports = getAuth;