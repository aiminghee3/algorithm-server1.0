const bcrypt = require('bcrypt');
const Member = require('../models/member');

exports.signup = async(req, res) =>{
    const {email, password} = req.body;
    try{
        const exMember = await Member.findOne({where : {email}});
        if(exMember){
            res.status(404).send('이미 존재하는 이메일입니다.');
        }
        const hash = await bcrypt.hash(password, 12);
        await Member.create({
            email,
            password : hash,    
        })
        res.status(200).send('회원가입 성공!');
    }catch(error){
        console.error(error);
        res.status(500).send('서버 오류');
        //return next(error);
    }
}

