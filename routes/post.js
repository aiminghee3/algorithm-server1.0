const express = require('express');
const {Member, Post} = require('../models/');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();


//게시글 조회
router.get('/:memberId', verifyToken, async(req, res) =>{
    const memberId = req.params.memberId;
    try{
        const postList = await Post.findAll({
            where : {
                memberId : memberId
            }
        })

        if(!postList){
            return res.status(404).json({error : '게시글을 찾을 수 없습니다.'});
        }
        else{
            return res.status(200).send(postList);
        }
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            error : '서버 에러'
        })
    }
})

//게시글 저장
router.post('/store', verifyToken, async (req, res) =>{
    const {title, problem_number, problem_link, rate, content} = req.body;
    const memberId = req.decoded.memberId;
    try{
        await Post.create({
            memberId,
            title,
            problem_number,
            problem_link,
            rate,
            content
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