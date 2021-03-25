const express = require('express');
const app = express();
const api = require('./api');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');


app.set('port', (process.env.PORT || 8081));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors());
app.use('/api', api);
app.use(express.static('static'));

app.use(morgan('dev'));

app.use(((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404;
    res.json(err);
}))


mongoose.connect('mongodb://localhost:27017/globomantics', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('Connect to MongoDb')

    app.listen(app.get('port'), () => {
        console.log(`Api Server Listening on port ` + app.get('port'));
    })
})
