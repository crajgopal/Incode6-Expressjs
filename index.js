// Express Project 3b using ejs
const express = require('express');// import express package

const app = new express();  //create instance of express . init app
const path =require('path');
//core modeule thats included with nodejs by default, no need to install ..path
const morgan = require('morgan');//HTTP request logger middleware for node.js


const users = require('./Data').users;
const schedules =require('./Data').schedules;

//load view engine 
app.set('views',path.join(__dirname, 'views') );
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname +'/public')));
//importing the package/library to help hash paswords. 
const bcrypt = require('bcrypt');

let alert = require('alert'); 

//body parser middleware
// its a middleware that interecepts the raw body and parses into a form that 
//application code can easily use

app.use(express.json());// allows to handle raw json.
app.use(express.urlencoded({ extended :true }));// to get req.body .. middleware
app.use(morgan('dev'));

app.get('/', (req, res) => {

    res.render('pages/home', {
         
    title: "Mr.Coffee's schedule management app"
    }
    )
  })
  
  
app.get('/users/add', (req, res) => {
    res.render('pages/new-user')
  })

  app.get('/schedules/add', (req, res) => {
    res.render('pages/newschedule',
    {
       length: users.length,
       users :users
    })
    
    
  })


app.get('/users', (req, res)=>
{
    res.render('pages/users' , {
        title:'Schedule User website',
        users:users
    });
});


app.get('/schedules', (req, res)=>
{
    res.render('pages/schedules' , {
        title:'Schedule website',
        schedules:schedules
    });
});


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
   
    
        res.render('pages/user', {
            title:'Schedule management website',
            id:req.params.id,
          
             users:users   
        })
    }

      });


app.get('/users/:id/schedules', (req, res)=>{

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
   

    let schedules1 =[];
    for (let  i=0; i<schedules.length;i++)
    {
    
        if(schedules[i]['user_id']==parseInt(req.params.id))
        {
            schedules1.push(schedules[i]);
        
        }
    
    }
    console.log(schedules1);
 res.render('pages/userschedules',{
         
                    title:'User Schedules',
                    id:req.params.id,
                    name:users[parseInt(req.params.id)].firstname ,
                    schedules:schedules1    

       })

        }

    });
    


    app.post('/users', (req, res)=>{

     if (req.body.password!==req.body.password1){
    
       alert("Password doesnt match")
       
       res.redirect('/users/add')



     }
     else
     {
        const password =req.body.password;
        const salt =bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(password, salt);
        
        users.push({
                    firstname:req.body.firstname,
                    lastname:req.body.lastname,
                    email:req.body.email,
                    password:hash

        })
         res.redirect('/users')
      
      
      }
    });
 app.post('/schedules', (req, res)=>{

   
  schedules.push( {
    user_id:req.body.user_id,
    day:req.body.day,
    start_at:req.body.starttime,
    end_at:req.body.endtime

})

    res.redirect('/schedules')
 })



//check when deploying  if the server is running other port  if not use port 3000.

const PORT = process.env.PORT || 3000;
app.listen(PORT , ()=> console.log(`Server started on port ${PORT}`));
