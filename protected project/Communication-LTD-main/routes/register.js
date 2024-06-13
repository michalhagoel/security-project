const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require("../db-config");
const validator = require('validator');
const badPasswords = ["mypassword", "password1234", "1234567890", "0987654321"];

const minLength = process.env.PASSWORD_LENGTH || 10;
const complexity = process.env.PASSWORD_COMPLEXITY || 'uppercase,lowercase,numbers,special_characters';
const history = process.env.PASSWORD_HISTORY || 3;

// Add Morgan logging middleware
const morgan = require('morgan');
router.use(morgan('tiny'));

router.get('/', function (req, res) {
    const email = req.flash('email')[0];
    const firstname = req.flash('firstname')[0];
    const lastname = req.flash('lastname')[0];
    res.status(200).render('register.ejs', { messages: req.flash('error'), firstname: firstname, lastname: lastname, email: email });
});

// Create a new user with hashed password
router.post('/', async (req, res) => {
    // Get the user's input from the registration form
    const { firstname, lastname, email, password, confirmPassword } = req.body;
    // Check if the password is too weak
    if (badPasswords.includes(password)) {
        req.flash('error', 'Password is too weak. Please choose a stronger password.');
        return res.status(400).render('register.ejs', { messages: req.flash('error') });
    }

    // Validate strong password
    if (!validator.isStrongPassword(password, {
        minLength: minLength,
        complexity: true,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
        pointsPerUnique: 1,
        pointsPerRepeat: 0.5,
        pointsForContainingLower: 10,
        pointsForContainingUpper: 10,
        pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10,
        excludeSimilarCharacters: false,
        exclude: [],
    })) {
        req.flash('error', `'The password must be at least ${minLength} characters long and meet the following complexity requirements: ${complexity}.`)
        return res.status(400).render('register.ejs', { messages: req.flash('error'), ...req.body }
        )
    }
    // Check if the password and confirmPassword match
    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match.');
        return res.status(400).render('register.ejs', { messages: req.flash('error') });
    }

    // Check if the email is already registered using prepared statement
    const selectQuery = 'SELECT id FROM users WHERE email = ?';
    db.userDbConfig.query(selectQuery, [email], function (error, results, fields) {
        if (error) {
            console.log("database error:", error);
            req.flash('error', 'An error occurred while checking if the email is already registered. Please try again later.');
            res.render('register.ejs', { messages: req.flash('error') });
        } else if (results.length > 0) {
            console.log("user already exists");
            req.flash('error', 'This email is already registered. Please try a different email.');
            res.render('register.ejs', { messages: req.flash('error'), ...req.body });
        } else {
            // Hash the password using bcrypt
            bcrypt.hash(password, 10, function (err, hash) {
                if (err) {
                    console.log("password hashing error:", err);
                    req.flash('error', 'An error occurred while hashing the password. Please try again later.');
                    res.render('register.ejs', { messages: req.flash('error') });
                } else {
                    const fullname = `${firstname} ${lastname}`; 
                    // Set the password_history to an empty JSON object for the new user
                    const historyPassword = [];
                    // Insert the user with hashed password and empty password_history into the database using prepared statement
                    const insertQuery = 'INSERT INTO users (email, password, fullname, password_history) VALUES (?, ?, ?, ?)';
                    db.userDbConfig.query(insertQuery, [email, hash, fullname, JSON.stringify(historyPassword)], function (error, results, fields) {
                        if (error) {
                            console.log("database error:", error);
                            req.flash('error', 'An error occurred while creating the user. Please try again later.');
                            res.render('register.ejs', { messages: req.flash('error') });
                        } else {
                            // Handle successful registration
                            console.log("user created successfully");
                            req.flash('success', 'You have successfully registered. Please login to continue.');
                            res.status(200).redirect('/');
                        }
                    });
                }
            });
        }
    });
});

module.exports = router; 