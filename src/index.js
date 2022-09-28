const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route');
const  mongoose  = require('mongoose');
const app = express();
const multer= require("multer");
const aws = require('aws-sdk');


app.use( multer().any())


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://rajeshkumar2233:9691501076Rj@cluster0.mrghs.mongodb.net/group71Database", {
        useNewUrlParser: true
    })
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


app.use('/', route)


app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});