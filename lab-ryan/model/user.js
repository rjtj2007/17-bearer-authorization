'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//User Model
const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { //TODO: hash (pre-save using bcrypt).
        type: String,
        required: true
    }
});

schema.methods.checkPassword = function (rawPassword) {
    return bcrypt.compare(rawPassword, this.password);
}

schema.pre('save', function (next) {
    if (this.isNew) {

        bcrypt.hash(this.password, 10).then(hash => {
            this.password = hash;
            next();
        }).catch(err => console.error(err));

    } else {
        next();
    }
});

module.exports = mongoose.model('User', schema);