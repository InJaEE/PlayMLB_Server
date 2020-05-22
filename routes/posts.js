const router = require('express').Router();
const PostModel = require('../models/PostModel');

// TODO: 포스트 목록
router.get('/', (req, res) => {
    PostModel.find()
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
router.get('/:number', async (req, res) => {
    const { number } = req.params;
    await PostModel.findOne({number})
    res.status(200).send('SELECT Success');
    
    
});

// TODO: 포스트 수정
router.put('/:number', async (req, res) => {
    const { number } = req.params;
    await PostModel.findOneAndUpdate({})
    res.status(200).send('UPDATE Success');


});

// TODO: 포스트 삭제
router.delete('/:number', async (req, res) => {
    const { number } = req.params;
    await PostModel.remove({number})
    res.status(200).send('Delete Success');
});

// 포스트 전체 삭제
router.delete('/deleteAll', async (req, res) => {
    await PostModel.remove({});
    //console.log("###", data.deletedCount);
    res.status(200).send('Delete All!!!')
});

module.exports = router;