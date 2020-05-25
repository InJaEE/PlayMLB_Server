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


module.exports = router;