const express = require('express')
const router =express.Router()
const db = require('../database');


const days =['Monday','Tuesday','Wednesday','Thursday', 'Friday', 'Saturday' , 'Sunday']



//Get all schedules 
router.get('/', (req, res)=>{
    const firstname =[]
    db.any("SELECT *, TO_CHAR(start_at,'HH12:MI AM')start_at ,TO_CHAR(end_at,'HH12:MI AM')end_at FROM schedules;")
       .then((schedules) => {
    
        db.any('SELECT * FROM users;')
        .then((users)=>{
    
        res.render('pages/schedules' , {
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
    




  //Display form for adding new schedules 
  router.get('/add', (req, res) => {
    db.any('SELECT * FROM users;' )
    .then( (users)=>{
     
   
    res.render('pages/newschedule',
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



 
//create new schedules 

router.post('/', (req, res)=>{
const {user_id, day, start_at, end_at} =req.body



//add schedules to db

db.none('INSERT INTO schedules(user_id, day, start_at, end_at) VALUES($1, $2, $3, $4);',[user_id, day, start_at,end_at])

.then(() =>{

res.redirect('/schedules?message=Post+successfully+added') })

.catch((error)=>{

console.log(error)

res.redirect("/error?message=" + error.message)
})
})





module.exports=router