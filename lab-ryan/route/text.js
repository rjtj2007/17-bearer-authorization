'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');

const Text = require('../model/textMessage.js');
const User = require('../model/user.js')
const getAuth = require('../lib/authorization.js');
// const bearerMiddleWare = require('../lib/bearer-auth-middleware');

const router = express.Router();


router.get('/', (req, res) => {
    Text.find()
    .then(results => {
        res.send(results);
    })
    .catch(err => res.send(err.message));
});

router.get('/signin', (req, res) => {
    let [username, password] = getAuth(req, res); 

    User.findOne({
        username
    })
    .then(user => {
        user.checkPassword(password)
        .then(isValid => {
            if(isValid) {
                let payload = { userId: user._id};
                let token = jwt.sign(payload, process.env.SECRET);
                res.sendStatus(token);
            } else if (!isValid) {
                res.sendStatus(401);
            }
        })
        .catch((err) => {
            res.sendStatus(401)
        });
    })
    .catch((err) => res.send(err.message));
});


router.post('/text', express.json(), (req, res) => {
    Text.create(req.body)
    .save()
    .then((text) => {
        res.send(text);
    })
    .catch(err => res.sendStatus(400));
});

module.exports = router;
