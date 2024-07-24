const mongoose = require('mongoose')
const mailSender = require('../utils/mailSender')


const OTPschema = new mongoose.Schema({
    email: {
        type : String,
        required :true
    },
    otp: {
        type: String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        expires: 60 * 10
    }
})

// Function to send emails
const sendVerificationEmail = async(email,otp)=>{
    try {
        //email sending using custom mailSender funtion
        const emailResponse = await mailSender(
            email,
            "Verify your Email",
            `<html>
                <p><strong>Your OTP code is :${otp}</strong>.</p>
                </html>`
        
        )
        console.log("Email sent successfully:", emailResponse)
    }
    catch (error){
        console.error("Error occured while sending email:", error)
        throw error
    }
}

//pre-save middleware to send verification email
OTPschema.pre("save", async function(next){
    console.log('new document saved to database')

    //sends email only when new document is created
    if (this.isNew){
        await sendVerificationEmail(this.email, this.otp)
    }
    next()
})

const OTP = mongoose.model("OTP", OTPschema)
module.exports = OTP