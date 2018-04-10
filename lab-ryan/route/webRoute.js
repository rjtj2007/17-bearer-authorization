'use strict';

const express = require('express');
const Web = require('../model/webModel');
const barerAuth = require('../lib/bearer-auth-middleware.js');

// const router = express.Router();

webRouter.route('/web')

.get(barerAuth, (req, res) => {
    console.log('UserId:', req.user);
    Web.find({userId: req.user})
    .then(web => res.sendStatus(200).json(web))
    .catch(err => res.sendStatus(404).send(err));
})

.post(barerAuth, (req, res) => {
    req.body.userId = req.user._id;
    new Web(req.body)
    .save()
    .then( web => {
        console.log('web', web);
        res.status(200).json(web);
    })
    .catch(err => res.status(404).send(err.message));
});

webRouther.route('web/:id')

.get(barerAuth, (req, res) => {
    if(req.params.id) {
        return Web.findById(req.params.id)
        .then((web) => res.status(200).json(web))
        .catch(err => res.status(404).send(err.message));
    }
})

.put(barerAuth, (req, res) => {
    let id = req.params.id;
    Web.findByIdAndUpdate(id, req.body, {
        new: true
    })
    .then(web => res.status(204).json(web))
    .catch(err => res.status(400).send(err.message));
})

.delete(barerAuth, (req, res) => {
    Web.findByIdAndRemove(req.params.id)
    .then(web => {
        if(web.userId.toString() === req.user.id.toString()) {
           return web.remove();
        }
    })
    .then(() => res.status(200))
    .catch(err => res.status(500).send(err.message));
});

module.exports = webRouter;