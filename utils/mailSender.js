const nodemailer  = require('nodemailer')
require('dotenv').config()

const mailSender = async (email,title, body) =>{
    try {
        // Create a Transporter with SMTP details
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            secure: true,
            auth: {
                user : process.env.MAIL_USER, //SMTP user(email address)
                pass : process.env.MAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        // Send OTP to users email
        let mailOptions = {
            from : 'MySchool<no-reply@eddiebob007@gmail.com>',
            to: `${email}`,
            subject: "OTP Verification",
            html: body
            
        }
        return await transporter.sendMail(mailOptions)
        

    }catch (error){
        console.error("Error occurred while sending email",error)
        throw error
    }
}

module.exports = mailSender
