const express =require('express')
const router=express.Router()


//Welcome
router.get('/', (req, res) => {

    res.render('pages/home', {
         
    title: "Mr.Coffee's schedule management app"
    }
    )
  })
  


module.exports =router