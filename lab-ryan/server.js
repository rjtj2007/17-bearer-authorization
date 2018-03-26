'use strict';

const express = require('express');
const PORT = process.env.PORT || 3000;

const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/lab-16-user'); 

const userRouter = require('./route/user');

app.use('/api', userRouter); 


app.listen(PORT, () => console.log('listening on: http://localhost', PORT));
