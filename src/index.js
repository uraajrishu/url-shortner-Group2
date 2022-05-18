const express = require('express');
const bodyParser = require('body-parser');
const route = require('./route/route.js');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
mongoose.connect("mongodb+srv://urajrishu:aUHDB96UyJaq9SB@cluster0.1wief.mongodb.net/group2Database", {useNewUrlParser:true})
.then(() => console.log('Hey Yuvraj! Go Ahead MongoDB is connected'))
.catch(err => console.log(err))
app.use('/', route)

app.listen(process.env.PORT || 3000, function(){
    console.log('Express is running on port' +" "+ (process.env.PORT || 3000))
});