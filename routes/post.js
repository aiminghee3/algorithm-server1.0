const express = require('express');
const {Member, Post, Hashtag} = require('../models');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();


// 회원별 게시글 조회
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

//전체 게시글 조회
router.get('/get/all', async(req, res) =>{
    try{
        const postList = await Post.findAll();
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
// 게시글 삭제
router.delete('/delete/:postId', async(req, res) =>{
    const postId = req.params.postId;

    try{
        const deletedPost = await Post.destroy({
            where: { id: postId },
        });
    if (deletedPost) {
        // 삭제 성공
        res.status(204).send();
        } else {
        // 삭제할 데이터가 없는 경우
        res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error('게시글 삭제 에러:', error);
        res.status(500).json({ error: '서버 에러' });
    }
})
//게시글 저장
router.post('/store', verifyToken, async (req, res) =>{
    const {title, problem_number, problem_link, rate, content, hashtags} = req.body;

    const memberId = req.decoded.memberId;
    try{
        const post = await Post.create({
            memberId,
            title,
            problem_number,
            problem_link,
            rate,
            content
        })

        if(hashtags){
            const result = await Promise.all(
                hashtags.map(tag =>{
                    return Hashtag.findOrCreate({
                        where : {name : tag}
                    });
                })
            );
            await post.addHashtags(result.map(r => r[0]));
        }

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