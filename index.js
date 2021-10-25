// Express Project 3b using ejs
const express = require('express');// import express package

const app = new express();  //create instance of express . init app
const path =require('path');
//core modeule thats included with nodejs by default, no need to install ..path
const morgan = require('morgan');//HTTP request logger middleware for node.js

const db = require('./database');
const homeRouter =require('./routes/home')
const usersRouter = require('./routes/users')
const schedulesRouter = require('./routes/schedules')


//load view engine 
app.set('views',path.join(__dirname, 'views') );
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname +'/public')));


let alert = require('alert'); 

//body parser middleware
// its a middleware that interecepts the raw body and parses into a form that 
//application code can easily use

app.use(express.json());// allows to handle raw json.
app.use(express.urlencoded({ extended :true }));// to get req.body .. middleware
app.use(morgan('dev'));



//ROUTES

app.use('/users', usersRouter)
app.use('/schedules', schedulesRouter)
app.use('/',homeRouter)



//check when deploying  if the server is running other port  if not use port 3000.

const PORT = process.env.PORT || 3000;
app.listen(PORT , ()=> console.log(`Server started on port ${PORT}`));
