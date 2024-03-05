const express = require('express');
const Post = require('../models/post');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/store', verifyToken, async (req, res) =>{
    const {title, sex, city, content, img_link} = req.body;
    const memberId = req.decoded.memberId;
    try{
        await Post.create({
            memberId,
            title,
            sex,
            city,
            content,
            img_link
        })
        return res.json({
            status : 200,
            message : '게시글을 작성하였습니다.',
        });
    }
    catch(error){
        console.error(error);
        res.status(500).send('서버 오류');
    }
})


module.exports = router;