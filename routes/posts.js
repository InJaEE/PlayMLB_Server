const router = require('express').Router();
const PostModel = require('../models/PostModel');

// 포스트 전체 조회
router.get('/', (req, res) => {
    PostModel.find({ isDeleted: false }).populate('createdBy', 'userId nickname')
    .then(posts => {
        res.status(200).json({
            success: true,
            posts,
        });
    }).catch(err => {
        res.status(500).send('Lookup post error!');
        console.error(err);
    })
});

// 포스트 1개 조회
router.get('/:number', async (req, res) => {
    const { number } = req.params;
    try {
        const result = await PostModel.findOne({ number, isDeleted: false })
        .populate({ path: 'createdBy', select: 'userId nickname' })
        .populate({ path: 'comments.createdBy', select: 'nickname'})

        if(!result){
            res.status(403).send('Cannot find post!');
        return;
    }
        res.status(200).send({
            success: true,
            message: '포스트 조회 성공',
            post: result,
        });    
    } catch (err) {
        console.error(err);
        res.status(500).send('Lookup one post error!');
    }
});

// 포스트 생성
router.post('/', (req, res) => {
    const { title, contents } = req.body;
    const user = req.user._id;
    
    const newPost = new PostModel({
        title,
        contents,
        createdBy: user,
    });
    newPost.save((err, saved) => {
        if(err){
            console.error(err);
            res.status(409).send('Create post error!');
        } else{
            res.send(saved);
        }
    })
});

// 포스트 수정하기 위해 조회
router.put('/:number/edit', async(req, res) => {
    try {
        const post = await PostModel.findOne({ 
            number: req.params.number, 
            createdBy: req.user._id,
        });
        if(!post){
            res.status(403).send('Wrong approach');
            return;
        }
        res.status(200).send(post);
    } catch (err) {
        console.error(err);
        res.status(500).send('Lookup for edit post error!');
    }
})

// 포스트 수정
router.put('/:number', async (req, res) => {
    const { number } = req.params;
    const { title, contents } = req.body;
    try {
        const updatePost = await PostModel.findOneAndUpdate(
            { number, createdBy: req.user._id },
            { title, contents, updatedAt: Date.now() },
            { new: true },
        )
        if(!updatePost){
            res.status(401).send({
                success: false,
                message: '업데이트에 실패하였습니다.'
            })
        }
        res.status(200).send({
            success: true,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Update post error!');
        
    }
});

// 포스트 삭제
router.delete('/:number', async (req, res) => {
    const { number } = req.params;
    try {
        await PostModel.updateOne({ number }, { isDeleted: true })
        res.status(200).send('Delete post success');
    } catch (err) {
        res.status(500).send('Delete post error!');
        console.error(err);
    }
});

// 추천
router.put('/:number/recommend', async (req, res) => {
    const { number, userId } = req.body;

    try {
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
            await PostModel.updateOne({ number }, { $push: { recommend } })
        } else{
            // 추천 제거
            await PostModel.updateOne({ number }, { $pull: {
                recommend: { recommendBy: userId }
            }})
        }
        res.status(200).send('Successfully pressed recommende button');
    } catch (err) {
        console.error(err);
        res.status(500).send('Press recommend button error!');
        
    }
    
});

// 댓글
router.post('/:number/comments', async (req, res) => {
    const { number, contents } = req.body;
    const user = req.user;
    const comments = {
        contents,
        createdBy: user,
    };
    try {
        await PostModel.updateOne({ number }, { $push: { comments }})
        res.status(200).send('Comments completed successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Create comment error!');
    }
})

module.exports = router;