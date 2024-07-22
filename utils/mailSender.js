const nodemailer  = require('nodemailer')

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

        // Send emails to users
        let info = await transporter.sendMail({
            from : 'MR-EDD <no-reply@eddiebob007@gmail.com>',
            to: `${email}`,
            subject : "OTP Verification",
            html:`${body}`
        })

        console.log('Info is here:', info)
        return info

    }catch (error){
        console.error(error.message)
    }
}

module.exports = mailSender
