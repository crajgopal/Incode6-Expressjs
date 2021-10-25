const express = require('express')
const router =express.Router()
const db = require('../database');

//importing the package/library to help hash paswords. 
const bcrypt = require('bcrypt');


const days =['Monday','Tuesday','Wednesday','Thursday', 'Friday', 'Saturday' , 'Sunday']


//Get new users
router.get('/add', (req, res) => {
    res.render('pages/new-user')
  })
//Get all users
router.get('/', (req, res)=>
{
  db.any('SELECT * FROM users;' )
  .then( (users)=>{


    res.render('pages/users' , {
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



//Get user at index 
router.get('/:id', (req, res)=>{

  db.any('SELECT * FROM users;')
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
   
    
        res.render('pages/user', {
            title:'Schedule management website',
            id:req.params.id,
            users:users,
        })
    console.log(users)
      }
  })
  
  .catch((error)=>{
 
    console.log(error)
    
    res.redirect("/error?message=" + error.message)
        })
       
  
  });



     //get user schedules  at index

 router.get('/:id/schedules', (req, res)=>{

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

   db.any("SELECT *, TO_CHAR(start_at,'HH12:MI AM')start_at ,TO_CHAR(end_at,'HH12:MI AM')end_at FROM schedules;")
 .then((schedules)=>{
   let schedules1 =[];
   for (let  i=0; i<schedules.length;i++)
   {
   
       if(schedules[i]['user_id']==parseInt(req.params.id))
       {
           schedules1.push(schedules[i]);
       
       }
       }
res.render('pages/userschedules',{
        
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
router.post('/', (req, res)=>{

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




module.exports =router