const express = require('express');
const {signup, login} = require('../controller/auth');
const jwt = require('jsonwebtoken');
const Member = require('../models/member');
const bcrypt = require('bcrypt');

const router = express.Router();

// 로그인 /auth/login
//router.post('/login', login);

// 회원가입 /auth/signup
//router.post('/signup', signup);

router.post('/signup', async (req, res) => {
    const {email, password} = req.body;
    try{
        const exMember = await Member.findOne({where : {email}});
        if(exMember){
            res.status(404).send('이미 존재하는 이메일입니다.');
        }
        else{
            const hash = await bcrypt.hash(password, 12);
            await Member.create({
                email,
                password : hash,
            })
            res.status(200).send('회원가입 성공!');
        }
    }catch(error){
        console.error(error);
        res.status(500).send('서버 오류');
        //return next(error);
    }
})

router.post('/login', async(req, res) =>{
    const{email, password} = req.body;
    try{
        const exMember = await Member.findOne({where : {email}});
        if(exMember){
            const checkPassword = await bcrypt.compare(password, exMember.password);
            if(checkPassword){
                const token = jwt.sign({
                    email : exMember.email,
                }, process.env.JWT_SECRET,{
                    expiresIn : '5m', // 유효기간
                    issuer : 'jojunhee', // 발급자
                });
                // 응답 헤더에 토큰 추가
                res.header('Authorization', `Bearer ${token}`);
                return res.json({
                    status : 200,
                    message : '로그인에 성공하셨습니다.',
                })
            } 
            else{
                res.status(400).send('로그인에 실패하셨습니다.');
            }
    }
    }
    catch(error){
        console.error('로그인 중 오류발생 :', error);
    }
})

module.exports = router;