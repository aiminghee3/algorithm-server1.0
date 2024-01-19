const express = require('express');
const dotenv = require('dotenv');
const app = express();

// 라우터 모음
const authRouter = require('./routes/auth');


// 라우터 등록
app.use('/auth', authRouter);