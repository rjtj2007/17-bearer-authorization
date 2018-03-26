'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../model/user');
const getAuth = require('../lib/authorization');




router.get('/', (req, res) => {
    User.find()
    .then(results => {
        res.send(results);
    });
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


router.post('/signup', express.json(), (req, res) => {
    User.create(req.body)
    .then(user => {
        res.sendStatus(200);
    })
    .catch(err => res.sendStatus(400));
});

module.exports = router;
