const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require("../db-config");
const crypto = require('crypto');
const nodemailer = require('nodemailer');

router.get('/', function (req, res) {
    return res.status(200).render('password-reset.ejs', { errorMessage: null, errorMessage1: null })
});

function sha1(message) {
    const hash = crypto.createHash('sha1');
    hash.update(message);
    return hash.digest('hex');
}

router.post('/', async (req, res) => {
    const { email } = req.body;
    db.userDbConfig.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields) {
        if (error) {
            console.log("database error:", error);
            req.flash('error', 'An error occurred. Please try again later.');
            res.render('password-reset.ejs');
        }
        else if (results.length === 0) {
            console.log("user not found");
            req.flash('error', 'User not found. Please check your email or password and try again.');
            res.render('password-reset.ejs', { messages: req.flash('error') });
        }
        else {
            let randomNumber = Math.random() * 90000 + 10000;
            let code = sha1(randomNumber.toString());
            //console.log(code);
            req.session.tempcode = code; // store code in session
            req.session.email = email; // store email in session

            // create a transporter object
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'communicationltddonotreply@gmail.com',
                    pass: 'jeukclvkuvsxulns'
                }
            });

            // create an email message
            let mailOptions = {
                from: 'communicationltddonotreply@gmail.com',
                to: email,
                subject: 'Reset Password',
                text: `Your verification code is: ${code}`
            };

            // send the email
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.render('password-reset.ejs', { messages: req.flash('error') });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.redirect('/', { messages: req.flash('error') });
                }
            });
        }
    });
});



module.exports = router; 