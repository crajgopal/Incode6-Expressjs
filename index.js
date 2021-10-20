// Express Project 3b
const express = require('express');// import express package

const app = new express();  //create instance of express . init app
const path =require('path');
//core modeule thats included with nodejs by default, no need to install ..path
const morgan = require('morgan');//HTTP request logger middleware for node.js

const db = require('./database');

const days =['Monday','Tuesday','Wednesday','Thursday', 'Friday', 'Saturday' , 'Sunday']


//load view engine 
app.set('views',path.join(__dirname, 'views') );
app.set('view engine', 'pug');

app.use(express.static('public'))


app.use(express.static(path.join(__dirname ,'/public')));

//importing the package/library to help hash paswords. 
const bcrypt = require('bcrypt');

let alert = require('alert'); 


app.use(express.json());// allows to handle raw json.
app.use(express.urlencoded({ extended :true }));// to get req.body .. middleware
app.use(morgan('dev'));




app.get('/', (req, res)=>
{
    console.log(__dirname);
    res.render('index', { 
        title:"Mr.Coffee's schedule management app",
        });

});



//Get all users
app.get('/users', (req, res)=>
{
  db.any('SELECT * FROM users;' )
  .then( (users)=>{


    res.render('users' , {
      title:'Schedule User website',
      users,
      message: req.query.message
  });
  })

  .catch((error) =>{

    console.log(error)
    res.redirect("/error?message ="+ error.message)
  })
  

});




//Get all schedules 
app.get('/schedules', (req, res)=>{
    const firstname =[]
    db.any('SELECT * FROM schedules;')
       .then((schedules) => {
    
        db.any('SELECT * FROM users;')
        .then((users)=>{
    
        res.render('schedules' , {
            title:'Schedule website',
            schedules,
            days,
            users,
            message: req.query.message
    
        });
     })
    
      .catch((error) =>{
    
        console.log(error)
        res.redirect("/error?message ="+ error.message)
      })
      
    
    })
    .catch((error) =>{
    
      console.log(error)
      res.redirect("/error?message ="+ error.message)
    })
    
    })
    


app.get('/users/add', (req, res) => {
    res.render('newuser')
  })


    //Display form for adding new schedules 
    app.get('/schedules/add', (req, res) => {
        db.any('SELECT * FROM users;' )
        .then( (users)=>{
         
       
        res.render('newschedule',
        {
           length: users.length,
           users
        })
      })
        .catch((error) =>{
    
          console.log(error)
          res.redirect("/error?message ="+ error.message)
        })
        
      
        
      })
    


//Get user at index 
app.get('/users/:id', (req, res)=>{

  db.any('SELECT * FROM users;' )
    .then((users)=>{  
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
   
    
        res.render('userid', {
            title:'Schedule management website',
            id:req.params.id,
            users 
        })
    }
    console.log("Users "+users)
  })
  
  .catch((error)=>{
 
    console.log(error)
    
    res.redirect("/error?message=" + error.message)
        })   
  
  });

  
  //get user schedules  at index

      app.get('/users/:id/schedules', (req, res)=>{

        db.any('SELECT * FROM users;' )
       
           .then((users)=>{  
     
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
     
         db.any('SELECT * FROM schedules;')
       .then((schedules)=>{
         let schedules1 =[];
         for (let  i=0; i<schedules.length;i++)
         {
         
             if(schedules[i]['user_id']==parseInt(req.params.id))
             {
                 schedules1.push(schedules[i]);
             
             }
             }
        res.render('userschedules',{
              
                         title:'User Schedules',
                         id:req.params.id,
                         name:users[parseInt(req.params.id)].firstname ,
                         days,
                         schedules:schedules1   
     
            })
           })
            .catch((error)=>{
      
             console.log(error)
             
             res.redirect("/error?message=" + error.message)
                 })
              
         
                
           }//end of else 
       
           })
     
       .catch((error)=>{
      
         console.log(error)
         
         res.redirect("/error?message=" + error.message)
             })
           
     
     });

    

//Create new user
app.post('/users', (req, res)=>{

    const {firstname, lastname, email, password,password1} =req.body
 

   if (req.body.password!==req.body.password1){
  
     alert("Password doesnt match")
     
     res.redirect('/users/add')



   }
   else
   {
      //const password =req.body.password;
      const salt =bcrypt.genSaltSync(12);
      const hash = bcrypt.hashSync(password, salt);

      //add users to db
     db.none('INSERT INTO users(firstname, lastname,email, password) VALUES($1,$2,$3,$4);' ,[firstname,lastname, email, hash])
     .then((users)=> {

      res.redirect('/users?message=Post+successfully+added')

     })       
          
     .catch((error)=>{

      console.log(error)
      
      res.redirect("/error?message=" + error.message)
          })
       

    }
  });


  //create new schedules 

  app.post('/schedules', (req, res)=>{
  const {user_id, day, start_at, end_at} =req.body

   //add schedules to db

   db.none('INSERT INTO schedules(user_id, day, start_at, end_at) VALUES($1, $2, $3, $4);',[user_id, day, start_at, end_at])

   .then(() =>{

  res.redirect('/schedules?message=Post+successfully+added') })
 
 .catch((error)=>{
 
  console.log(error)

  res.redirect("/error?message=" + error.message)
    })
  })

//check when deploying  if the server is running other port  if not use port 3000.

const PORT = process.env.PORT || 3000;
app.listen(PORT , ()=> console.log(`Server started on port ${PORT}`));



