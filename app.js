const express = require('express');
const app = express();
const cors = require('cors');
const chalk = require('chalk');
const morgan = require('morgan');
const http = require('http');

const mongoose = require('mongoose');

const posts = require('./routes/posts');
const auth = require('./routes/auth');

mongoose.connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology : true,
    })
    .then(() => console.log('DataBase Connected!!!'))
    .catch(err => console.error(err));

app.set('port', process.env.PORT || 3000);

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/', auth);
app.use('/post', posts);

app.get('/', (req, res) => {
    res.send(`Please... ${process.env.PORT} ${process.env.MONGO_URI}`)
})

setInterval(() => {
    http.get('https://playmlb-server.herokuapp.com/');
}, 900000)

app.listen(app.get('port'), () => {
    console.log(`${chalk.blue
        .bgHex('000000')
        .bold(`http://127.0.0.1:${app.get('port')}
        `)}`);
});