const express = require('express');
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) =>{
    try{
        // 요청헤더에 저장된 토큰(req.headers.authorization)을 사용함 -> 사용자가 쿠키처럼 헤더에 토큰을 넣어서 보내야함, jwt.verify메서드로 토큰을 검증할 수 있음
        const tokenFromHeader = req.headers.authorization; // 만약 토큰이 없으면 권한이 없는 사용자이므로 401에러
        if (!tokenFromHeader) {
            return res.status(401).json({ message: '권한이 없습니다.' });
        }
        // 토큰에서 Bearer부분 없애줌
        const token = tokenFromHeader.split(' ')[1];
        console.log(token)
        req.decoded  = jwt.verify(token, process.env.JWT_SECRET); // 첫 번째 인수로 토큰을, 두 번째 인수로 비밀키를 받음 -> 인증이 성공하면 토큰의 내용이 req.decoded에 저장됨

        return next();
    } catch(error){
        if(error.name === 'TokenExpiredError'){ // 유효기간 초과
            return res.status(419).json({
                code : 419,
                message : '토큰이 만료되었습니다.'
            })
        }
        console.log(req.decoded)
    }
    return res.status(401).json({
        code : 401,
        message : '유효하지 않은 토큰입니다.'
    })
}

/*
{
  memberId: 1,
  email: 'iopp3423@gmail.com',
  iat: 1709629054,
  exp: 1709629354,
  iss: 'jojunhee'
} 이렇게 옴
*/