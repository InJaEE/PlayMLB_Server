const router = require('express').Router();
const PostModel = require('../models/PostModel');

// TODO: 포스트 목록
router.get('/', (req, res) => {
    PostModel.find({ isDeleted: false })
    .then(posts => {
        //console.log(posts);
        res.status(200).json({
            success: true,
            posts,
        });
    }).catch(err => {
        console.error(err);
    })
});

// TODO: 포스트 1개 조회
router.get('/:number', async (req, res) => {
    const { number } = req.params;
    const result = await PostModel.findOne({ number, isDeleted: false });    
    
    res.status(200).send({
        success: true,
        message: '포스트 조회 성공',
        post: result,
    });    
});

// TODO: 포스트 생성
router.post('/', (req, res) => {
    const { title, contents, createdBy } = req.body;
    const newPost = new PostModel({
        title,
        contents,
        createdBy,
    });
    newPost.save((err, saved) => {
        if(err){
            console.error(err);
            res.status(409).send(err);
        } else{
            console.log(saved);
            res.send(saved);
        }
    })
});

// TODO: 포스트 수정
router.put('/:number', async (req, res) => {
    const { number } = req.params;
    await PostModel.findOneAndUpdate({})
    res.status(200).send({
        success: true,
    });
});

// TODO: 포스트 삭제
router.delete('/:number', async (req, res) => {
    const { number } = req.params;
    // await PostModel.remove({number})
    await PostModel.updateOne({ number }, { isDeleted: true })
    res.status(200).send('Delete Success');
});

// 추천
router.put('/:number/recommend', async (req, res) => {
    const { number, userId } = req.body;
    const postData = await PostModel.findOne({ number });
    
    const findData = postData.recommend.find(v => {
        return v.recommendBy === userId;
    })
    if(!findData){
        // 추천을 처음 눌렀을때
        const recommend = {
            recommendBy: userId,
            value: true,
        }
        await PostModel.updateOne({number}, {$push: {recommend}})
    } else{
        // 추천 제거
        await PostModel.updateOne({number}, {$pull: {
            recommend: {recommendBy: userId}
        }})
    }
    res.status(200).send('success');
    
});

// 댓글
router.post('/:number/comments', async (req, res) => {
    const { number, contents, userId, nickname  } = req.body;
    // await PostModel.findOneAndUpdate({number}, 
    //     {$push: {comments: {contents, commentedBy}}}
    //     )
    const comments = {
        contents,
        userId,
        nickname,
    };
    // const postData = await PostModel.findOne({number});
    try {
        await PostModel.updateOne({ number }, { $push: { comments }})
        
    } catch (err) {
        console.error(err);
        
    }
    res.status(200).send('Success');
})

module.exports = router;