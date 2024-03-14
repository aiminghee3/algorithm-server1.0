const express = require('express');
const {Member, Post, Hashtag} = require('../models');
const { verifyToken } = require('../middlewares/authMiddleware');
const { scheduleJob } = require('node-schedule');
const FCM = require('fcm-node');
const serverKey = process.env.FCM_KEY;

const router = express.Router();

const fcm = new FCM(serverKey);

// 회원별 게시글 조회
router.get('/:memberId', verifyToken, async(req, res) =>{
    const memberId = req.params.memberId;
    try{
        const postList = await Post.findAll({
            where : {
                memberId : memberId
            },
            include : [
                {
                    model : Hashtag,
                    attribute : ['name'],
                },
                {
                    model: Member, // Member 모델과의 연결
                    attributes: ['email'], // 가져오고자 하는 Member 모델의 속성 지정
                },
            ] 
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
        // TODO : pagination ?skip=1&take=15 
        const postList = await Post.findAll({
            include : [
                {
                    model : Hashtag,
                    attribute : ['name'],
                },
                {
                    model: Member, // Member 모델과의 연결
                    attributes: ['email'], // 가져오고자 하는 Member 모델의 속성 지정
                },
            ]
        });
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
        // TODO : soft delete 
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
    // store.dto.ts => export class StoreDto 
    // (req: StoreDto, res: Any) => {} construct
    const {title, problem_number, problem_link, rate, content, hashtags, alarm, token} = req.body;

    const memberId = req.decoded.memberId;
    try{
        const post = await Post.create({
            memberId,
            title,
            problem_number,
            problem_link,
            rate,
            content,
            alarm
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

        if(alarm){
            const [year, month, day] = alarm.split('-');
            var date = new Date(year, month, day, 7, 0, 0);
            console.log(date)
            
            
            scheduleJob(date, function(){
                const message = {
                    to: token,
                    notification: {
                      title: '문제 복습 알림',
                      body: `오늘은 ${problem_number}번 문제 복습하는 날입니다.`
                    }
                  };
                  
                fcm.send(message, (err, response) => {
                    if (err) {
                        console.log('Error: ', err);
                    } else {
                        console.log('Response: ', response);
                    }
                });
            })
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

//게시글 수정
router.put('/update/:postId', async(req, res) =>{
    const {title, problem_number, problem_link, rate, content, hashtags} = req.body;
    const postId = req.params.postId;

    try{
        const updatePost = await Post.findByPk(postId, {
            include: [Hashtag], // 테이블이름 : class Hashtag 임
        });

        const updateData = {
            title: title || updatePost.title, // 새로운 값이 주어진 경우에만 업데이트, 그렇지 않으면 현재 값 유지
            problem_number: problem_number || updatePost.problem_number,
            problem_link: problem_link || updatePost.problem_link, 
            rate: rate || updatePost.rate, 
            content: content || updatePost.content,
            hashtags: hashtags || updatePost.hashtags,
        }

        if(hashtags){ // 해시태그 업데이트
            const newHashtags = await Promise.all(
                hashtags.map((tag) => {
                  return Hashtag.findOrCreate({
                    where: { name: tag },
                  });
                })
              );
            
            // 기존 포스트의 모든 해시태그 가져오기
            const existingHashtags = await updatePost.getHashtags();
        
            // 기존 해시태그 중에서 새로운 해시태그에 없는 것들 삭제
            await Promise.all(
                existingHashtags.map(async (existingTag) => {
                    const tagToRemove = newHashtags.find((newTag) => newTag[0].name === existingTag.name);
                    if (!tagToRemove) {
                        await updatePost.removeHashtag(existingTag);
                    }
                })
            );

            await updatePost.addHashtags(newHashtags.map((newTag) => newTag[0]));
        }

        if (updatePost) {
            await updatePost.update(updateData); // 게시글 업데이트

            return res.status(200).json({ message: '정상적으로 업데이트되었습니다..' });
          } else {
            return res.status(404).json({ error: '해당 id에 해당하는 게시글을 찾을 수 없습니다.' });
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: '서버 에러' });
        }
})


module.exports = router;