const router = require('express').Router();
const PostModel = require('../models/PostModel');

// TODO: 포스트 목록
router.get('/', (req, res) => {
    PostModel.find()
    .then(posts => {
        console.log(posts);
        res.status(200).json({
            success: true,
            posts,
        });
    }).catch(err => {
        console.error(err);
    })
});

// TODO: 포스트 생성
router.post('/', (req, res) => {
    const { title, contents, writer } = req.body;
    const newPost = new PostModel({
        title,
        contents,
        writer,
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

// TODO: 포스트 1개 조회
router.get('/:id', (req, res) => {

});

// TODO: 포스트 수정
router.put('/:id', (req, res) => {

});

// TODO: 포스트 삭제
router.delete('/:id', (req, res) => {

});

module.exports = router;