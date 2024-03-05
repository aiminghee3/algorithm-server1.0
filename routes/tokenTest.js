const express = require('express');
const jwt = require('jsonwebtoken');
const {verifyToken} = require('../middlewares/authMiddleware');
const {Member} = require('../models');

const router = express.Router();

router.post('/', async(req, res) =>{
    const {email} = req.body;
    console.log(email)
    try{
        const exMember = await Member.findOne({
            where : {email},
        });
        if(!exMember){
            return res.status(401).json({
                code : 401,
                message : '등록되지 않은 회원입니다.',
            })
        }
        const token = jwt.sign({
            email : exMember.email,
            password : exMember.password,
        }, process.env.JWT_SECRET,{
            expiresIn : '5m', // 유효기간
            issuer : 'jojunhee', // 발급자
        });
        return res.json({
            code : 200,
            message : '토큰이 발급되었습니다.',
            token,
        })
    } catch (error){
        console.error(error);
        return res.status(500).json({
            code : 500,
            message : '서버 에러',
        });
    }
});

router.get('/test', verifyToken, (req, res) =>{
    res.json(req.decoded);
});

module.exports = router;