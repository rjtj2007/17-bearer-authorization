'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/user.js');
const jwt = require('jsonwebtoken');
const authRouter = express.Router();


authRouter.route('/signup')

.get((req, res) => {
    User.find()
    .then(user => res.status(200).json(user))
    .catch(err => res.sendStatus(400).send(err));
})

.post((req, res) => {
    new User(req.body)
    .save()
    .then(users => {
        console.log('user', users);
        res.status(200).json(users);
    })
    .catch(err => res.status(400).send(err.message));
});

authRouter.route('/signin')

.get((req, res) => {
    let authHeader = req.get('Authorization');
    console.log('header:', authHeader);
    if(!authHeader) {
        res.status(401);
        res.send('Incorrect username or password');
        return;
    }
    let payload = authHeader.split('Basic ')[1];
    let decoded = Buffer.from(payload, 'base64').toString();
    let [username, password] = decoded.split(':');
    
    User.findOne({
        username: username
    })
    .then(user => {
        if(user === null) {
            res.send('cannot find user');
        };
        user.checkPassword(password)
        .then(isValid => {
            let payload = { userId: user._id };
            let token = jwt.sign(payload, process.env.SECRET);
            res.send(token);
        })
        .catch(err => {
            res.send(err);
        });
///////////////////////////////
    // bcrypt.compare(password, user.password, (err, valid) => {
    //   if (err) {
    //     res.send(err);
    //   }
    //   if (!valid) {
    //     res.status(401).send('invalid password');
    //     return;
    //   }
    //   let payload = { userId: user._id };
    //   let token = jwt.sign(payload, process.env.SECRET);
    //   console.log('token', token);
    //   res.send(token);        
    // });
    });
});


module.exports = authRouter;
