const router = require('express').Router();
const PostModel = require('../models/PostModel');

// 추천
router.put('/recommend', async (req, res) => {
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

router.post('/test', async (req, res) => {
    const test = await PostModel.findOne({number: 13});
    const re = test.recommend.find(v => {
        return v.recommendBy = 'in11202@naver.com';
    });
    console.log("@@@", re.value);
    
    
    const recommend = {
        recommendBy: 'bbb@naver.com',
        value: true,
    };
    const data = await PostModel.updateOne({number: 13}, {$push: {recommend}})
    .lean().exec();
    res.send(data)
})

router.get('/test', async (req, res) => {
    


    const data = await PostModel.findOne({number: 13})
    res.send(data);
})
module.exports = router;