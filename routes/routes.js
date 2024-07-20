const express = require('express')
const router = express.Router()
const {signup,login,sendOtp} = require('../controllers/auth')
const {auth, isStudent, isAdmin} = require('../middleware/auth-middleware')

// user registration
router.post('/signup', signup)

//user login
router.post('/login', login)

//verify email with otp
router.post('/sendOtp', sendOtp)



// protected routes
router.get('/student',auth, isStudent, (req,res)=>{
    res.json({
        success: true,
        message: "Validated Student"
    })
})

router.get('/admin', auth, isAdmin, (req,res)=>{
    res.json({
        success: true,
        message: "valid Admin 😎"
    })
})

module.exports = router

