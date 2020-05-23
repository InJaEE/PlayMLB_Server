const express = require('express');
const app = express();
const cors = require('cors');
const chalk = require('chalk');
const morgan = require('morgan');
const http = require('http');
require('dotenv').config();

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

mongoose.connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology : true,
    })
    .then(() => {
        console.log('DataBase Connected!!!')
    })
    .catch(err => console.error(err));
const db = mongoose.connection;
autoIncrement.initialize(db);

const posts = require('./routes/posts');
const auth = require('./routes/auth');
const postAddon = require('./routes/postAddon');
    
app.set('port', process.env.PORT || 3000);

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/', auth);
app.use('/post', posts);
app.use('/postAddon', postAddon);

app.get('/', (req, res) => {
    res.send(`InJaEE's PlayMLB API Server`)
})
/*
setInterval(() => {
    http.get('https://playmlb-server.herokuapp.com/');
}, 900000)
*/
app.listen(app.get('port'), () => {
    console.log(`${chalk.blue
        .bgHex('000000')
        .bold(`Port number is ${app.get('port')}`)}`);
});