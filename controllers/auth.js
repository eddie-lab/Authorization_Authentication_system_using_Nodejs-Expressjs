const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')
const OTP = require('../models/OTP')
const otpGenerator = require('otp-generator')
const User = require('../models/user')
require('dotenv').config()

// Signup handle
exports.signup = async (req,res) =>{
    try {
        //get input data
        const {name, email, password, role, otp} = req.body
        
        // Check if all records are filled or not
        if (!name || 
            !email ||
            !password ||
            !otp
        ) {
            return res.status(403).json({
                error : true,
                message :'All fields are required'
            });
        }
        // check if user exists already in database

        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({
                error : true,
                message: 'User already Exists'
            })
        }

        // Finding the most recent OTP generated for the Email
        const recentOTP = await otp.find({email
        })
        .sort({createdAt: -1}) //sorts result in descending order based on createdAt, so the most recent otp appear first
        .limit(1); // limits the result to only return the first document:most recent
        console.log(recentOTP)
        
         //handles case where no OTP is found
        if (recentOTP.length === 0) {
            return res.status(404).json({
                error: 'OTP not found',
                message : 'No OTP found for the provided email'
            });

        //handles case where otp provided by user does not match
        }else if (otp !== recentOTP[0].otp){
            return res.status(400).json({
                error: 'Invalid OTP',
                message: 'The OTP provided is incorrect'
            });

        }


        // secure password
        let hashedPassword
        try {
            hashedPassword = await bcrypt.hash(password,10)
        }
        catch(error) {
            return res.status(500).json({
                success: false,
                message: `Hashing password error for ${password}:` + error.message
            })
        }   

        // create new user document if hashing is successful
        const newUser = await User.create({
            name, 
            email, 
            password:hashedPassword, 
            role
        })
        return res.status(200).json({
            success: true,
            message: 'User created successfully ✅'
        })
    
    } catch (error){
        console.error(error)
        return res.status(500).json({
            success: false,
            message : 'user registration failed'
        })
    }
}


// Login handle
exports.login = async(req, res)=>{
    try {
        //fetching data from request body
        const {email,password} = req.body

        //validation of email and password for correctness
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: 'Password and email required for login'

            })
        }
        //Checks whether user is registered
        let registeredUser= await User.findOne({email})
        if(!User){
            return res.status(401).json({
                success: false,
                message: 'Unauthorized!! You have to Signup first'
            })

        }
        //Defines payload for JWT Token
        const payload = {
            email: User.email,
            id: User._id,
            role: User.role
        }
        //verify password using bcrypt 
        if(await bcrypt.compare(password,User.password)){
            //if password matches, generate JWT token
            let token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {expiresIn: '2h'});
            
            // convert user object to plain js object and attach jwt token
            User = User.toObject()
            User.token = token
            User.password = undefined     // removes password before sending response
            
            //Cookie options for storing JWT token
            const cookieOptions = {
                expires: new Date(Date.now()+ 3*24*60*60*1000),  //3hrs
                httpOnly: true  //Makes cookie unaccessible in client side
            }
            //setting  HTTP-only cookie with JWT token and response
            res.cookie("token", token, options).
            status(200).json({
                success: true,
                token,User,
                message: 'Logged in Successfully'
            })
        }else {
            return res.status({
                success: false,
                message: 'Incorrect Password Try Again'
            })
        }
    }catch (error){
        console.error(error)
        res.status(500).json({
            success: false,
            message :"Failed to Login:" + error
        })
    }
}

// handle Sending OTP for Email Verification
exports.sendOtp = async (req,res) =>{
    try {
        const {email} = req.body
        //checks if a user is found with provided email
        const checkUser = await User.findOne({email})
        //if existing user found return error message
        if (checkUser) {
            return res.status(401).json({
                error: true,
                message : "User is Already Registered"
            })           
        }
        //Generate 6digit OTP
        let otp = otpGenerator.generate(6,{
            upperCaseAlphabets : false,
            lowerCaseAlphabets: false,
            specialChars: false
        })
        //Ensure otp is unique
        let existingOtp = await OTP.findOne({otp})
        console.log('Generated OTP:', otp)
        console.log('Existing OTP:',existingOtp)

        //if the generated OTP exists(notnull), regenerate until it is unique
        while(existingOtp) {
            otp =  otpGenerator.generate(6,{
                upperCaseAlphabets : false,
                lowerCaseAlphabets: false,
                specialChars: false
        })
            existingOtp = await findOne({otp})
        }
        // Create OTP payload and store it in database

        const otpPayload = {email,otp}
        const otpBody = await OTP.create(otpPayload)
        console.log("OTP Body", otpBody)
        res.status(200).json({
            otp,
            success: true,
            message : "OTP Sent Successfully"
        })

    }catch (error) {
        console.error(error.message)
        return res.status(500).json({
            success: false,
            error : error.message
        })
    }
}


