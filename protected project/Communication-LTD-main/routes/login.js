const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require("../db-config");
const loginLimiter = require("./loginLimiter");


router.get('/', function (req, res) {
    if (req.session.user) {
        console.log("fullName", req.session.user.fullName)
        res.render('home.ejs', { fullName: req.session.user.fullName, user: req.session.user });
    }
    else {
        res.status(200).render('login.ejs', { messages: req.flash('error') });
    }
});


router.post('/', loginLimiter, (req, res) => {
    const { email, password } = req.body;
    console.log(password);

    const selectQuery = 'SELECT * FROM users WHERE email = ?'; //Parameters - solution
    // Check if the email exists in the database
    db.userDbConfig.query(selectQuery, [email], function (error, results, fields) {
        if (error) {
            console.log("database error:", error);
            req.flash('error', 'An error occurred while querying the database. Please try again later.');
            res.render('login.ejs');
        } else if (results.length === 0) {
            console.log("user not found");
            req.flash('error', 'User not found. Please check your email or password and try again.');
            res.render('login.ejs', { messages: req.flash('error') });
        } else {
            // If the email exists, validate the password
            const user = results[0];
            console.log("password hash is:", user.password);
            bcrypt.compare(password, user.password, function (err, result) {
                if (err) {
                    console.log("password validation error:", err);
                    req.flash('error', 'User not found. Please check your email or password. try again later.');
                    res.render('login.ejs', { messages: req.flash('error') });
                } else if (!result) {
                    console.log("incorrect password");
                    req.flash('error', 'User not found. Please check your email or password. try again later.');
                    res.render('login.ejs', { messages: req.flash('error') });
                } else {
                    console.log("login successful");
                    req.session.user = {
                        userid: user.id,
                        fullName: user.fullName,
                        isLoggedIn: true
                    };
                    console.log("cookie name is: ", req.session.user.fullName)
                    res.render('home.ejs', { fullName: req.session.user.fullName });
                    console.log(results);
                }
            });
        }
    });
});

module.exports = router;

