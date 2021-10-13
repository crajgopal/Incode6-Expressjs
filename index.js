// Express Project 3b
const express = require('express');// import express package

const app = new express();  //create instance of express . init app
const path =require('path');
//core modeule thats included with nodejs by default, no need to install ..path


//load view engine 
app.set('views',path.join(__dirname, 'views') );
app.set('view engine', 'pug');


app.get('/', (req, res)=>
{
    res.render('index', { 
        title:"Mr.Coffee's schedule management app"
    });

});

app.get('/users', (req, res)=>
{
    res.render('users' , {
        title:'Display users'
    });
});



//check when deploying  if the server is running other port  if not use port 3000.

const PORT = process.env.PORT || 3000;
app.listen(PORT , ()=> console.log(`Server started on port ${PORT}`));









/************  Express project 3A***********
/*****
const express = require('express');
//create varialbe and set it to require express.. in ES6: import express from 'express';

//initialising variable app.
const app =express();

//importing the package/library to help hash paswords. 
const bcrypt = require('bcrypt');


//body parser middleware
// its a middleware that interecepts the raw body and parses into a form that 
//application code can easily use

app.use(express.json());// allows to handle raw json.

app.use(express.urlencoded({ extended :true }));


const users= require('./Data').users;
const schedules =require('./Data').schedules;



//🚩 Step 2 : Create the first routes to return all the information
//creating routes

app.get('/', (req, res) => {
    
    console.log("Welcome to our schedule website.");
    res.send('Welcome to our schedule website.');

});


// create a route... and return Json

app.get('/users', (req, res) =>{
    console.log(Object.values(users));
    res.json(users);
});

app.get('/schedules', (req, res) =>{
    console.log(Object.values(schedules));
    res.json(schedules);
    });


//part3 :🚩 Create parameterized routes

app.get('/users/:id', (req, res)=>{

    if(isNaN(req.params.id))
    {
        console.log( req.params.id +"  is not a number, enter a number to get right results  ");
        res.send(req.params.id +"  is not a number, enter a number to get right results  ")
    }
   
    else if((parseInt(req.params.id))>users.length  || (parseInt(req.params.id)<0)){

        console.log("No element found at this index  , enter number >= 0 &less than "+ users.length );
        res.send("No element found at this index  , enter number  >=0 & less than "+ users.length )
    

      }
    
    
        else {
                   console.log(users[parseInt(req.params.id)]);
                   //res.send(users[parseInt(req.params.id)]);
                   res.json(users[parseInt(req.params.id)]);
    }

} );

app.get('/users/:id/schedules', (req, res)=>{

//can use filter method to filter the array :
//res.json(schedules.filter(schedules=>schedules[parseInt(req.params.id)]['user_id'] ===parseInt(req.params.id)));
 //re.json(schedules.find((id)=>schedules.id===parseInt(req.params.id)));
let schedules1 =[];
for (let  i=0; i<schedules.length;i++)
{

    if(schedules[i]['user_id']==parseInt(req.params.id))
    {
        schedules1.push(schedules[i]);
    
    }

}
console.log((schedules1));
res.json(schedules1)
});


//🚩 Step 4 : Create routes to update data


app.post('/users', (req, res )=>{

    
  const password =req.body.password;
  const salt =bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(password, salt);
   req.body.password=hash;
   console.log(hash);
    users.push(req.body);
    console.log(users);
    res.send(users);


});
    
// Example --curl -d "user_id=1&day=2&start_at=2PM&end_at=4PM"-X POST localhost:3000/schedules,
//It will return the newly created schedule.


app.post('/schedules', (req, res) => {

    schedules.push(req.body);
    console.log(req.body);
    //res.send(schedules);
    res.send(req.body);


});









const PORT =process.env.PORT || 3000 ; //check when deploying  if the server is running other port  if nnodeot use port 5000.

app.listen(PORT ,() => console.log(`Server started on port  ${PORT}`));
//calling call back as second parameter ..and print the port 


*************/
