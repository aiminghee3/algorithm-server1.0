const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const { sequelize } = require('./models');
// cors, proxy오류 해결
const cors = require('cors');

const app = express();

// TODO : Joi
app.set('port', process.env.PORT || 8080);

dotenv.config();

//sequelize 연결
sequelize.sync({ force: false }) // 디비 연결할 때마다 테이블 재생성할건지
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

// 특정 도메인에서의 요청만 허용
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // 인증 정보를 포함하려면 true로 설정
  Headers: ["Content-type", "Authorization"],
  optionsSuccessStatus: 204,
};

// app 환경설정
app.use(cors(corsOptions)); // cors문제 해결
app.use(morgan('dev'));
app.use(express.json()); // JSON 형식의 body 파싱
app.use(express.urlencoded({ extended: true })); // URL-encoded 형식의 body 파싱 -> 프론트에서 form형식으로 제출되면 express.json으로 해석불가해서 사용
app.use(cookieParser()) // 쿠키 확인

// 라우터 모음
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const tokenRouter = require('./routes/tokenTest');

// 라우터 등록
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/token', tokenRouter);

app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기 중');
});
