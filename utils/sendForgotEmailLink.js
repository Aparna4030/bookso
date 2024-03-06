const nodemailer = require('nodemailer')
require('dotenv').config()
const otpGenerator = require('../utils/otpGenerator')


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
});

const sendForgotPasswordLink = (email) => {
    return new Promise((resolve, reject) => {
        const secret = `${otpGenerator()}${otpGenerator()}`
        const mailOptions = {
            from: 'bookso42069@gmail.com',
            to: email,
            subject: 'OTP',
            html: `http://${process.env.DOMAIN_NAME}/resetPassword/${secret}`,
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(secret);

            }
        });
    })
}



module.exports = sendForgotPasswordLink