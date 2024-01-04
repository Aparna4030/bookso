const nodemailer = require('nodemailer')
require('dotenv').config()
const generateOtp = require("./otpGenerator")
const genEmailHtml = require("./emailGen")



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
});

const sendOTPemail = (email) => {
    return new Promise((resolve, reject) => {
        const otp = generateOtp();
        const mailOptions = {
            from: 'bookso42069@gmail.com',
            to: email,
            subject: 'OTP',
            html: genEmailHtml(otp),
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(otp);

            }
        });
    })
}



module.exports = sendOTPemail