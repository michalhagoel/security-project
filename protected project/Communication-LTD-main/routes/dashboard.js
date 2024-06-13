const express = require('express');
const router = express.Router();
const requireAuth = require('../auth');
const db = require("../db-config");


router.post('/search', requireAuth, function (req, res) {
    const { searchQuery } = req.body;
    if (searchQuery != null) {
        let selectQuery = ` WHERE firstname LIKE ? OR lastname LIKE ? OR email LIKE ? OR phoneNumber LIKE ? `;
        const searchQueryResult = `SELECT * FROM clients ${selectQuery}`;
        const searchTerm = `%${searchQuery}%`;
        db.clientDbConfig.query(searchQueryResult, [searchTerm, searchTerm, searchTerm, searchTerm], function (error, results, fields) {
            if (error) {
                console.log("database error:", error);
                req.flash('error', 'An error occurred while fetching clients. Please try again later.');
                res.render('home.ejs', { messages: req.flash('error'), fullName: req.session.user.fullName, user: req.session.user, searchQuery: searchQuery });
            } else {
                // Pass the search query results to the view template
                res.render('home.ejs', { fullName: req.session.user.fullName, user: req.session.user, searchQueryResult: results, searchQuery: searchQuery });
            }
        });
    } else {
        // Send empty array or null value for searchQueryResult to the view template
        res.render('home.ejs', { fullName: req.session.user.fullName, user: req.session.user, searchQueryResult: [], searchQuery: null });
    }
});


router.get('/', requireAuth, (req, res) => {
    if (req.session.user) {
        console.log("if (req.session.user)", req.session.user)
        // user is logged in, show homepage
        const fullName = req.session.user.fullName;
        res.render('home.ejs', { fullName, user: req.session.user, searchQueryResult: [], searchQuery: null });
    } else {
        // user is not logged in, redirect to login page
        res.redirect('/login');
    }
});

function renderHomePage(req, res, searchQuery) {
    const fullName = req.session.user.fullName;
    res.render('home.ejs', { fullName, user: req.session.user, searchQuery });
}

router.get('/', requireAuth, (req, res) => {
    if (res.locals.user) {
        console.log("if (res.locals.user)", res.locals.user)
        // user is logged in, show homepage
        renderHomePage(req, res, []);
    } else {
        // user is not logged in, redirect to login page
        res.redirect('/login');
    }
});

router.get('/addClient', requireAuth, (req, res) => {
    if (res.locals.user) {
        console.log("if (res.locals.user)", res.locals.user)
        // user is logged in, show add client page
        res.render('addclient.ejs', { fullName: req.session.user.fullName });
    } else {
        // user is not logged in, redirect to login page
        res.redirect('/login');
    }
});


router.get('/search', requireAuth, (req, res) => {
    if (res.locals.user) {
        console.log("if (res.locals.user)", res.locals.user)
        // user is logged in, perform search logic and show search results
        const searchQuery = req.query.q;
        // perform search logic here
        renderHomePage(req, res, searchQuery);
    } else {
        // user is not logged in, redirect to login page
        res.redirect('/login');
    }
});


router.post('/addClient', function (req, res) {
    if (req.session.user) {
        console.log("if req.session.user", req.session.user);
        const { firstname, lastname, email, phoneNumber } = req.body;
        console.log("firstname", firstname);
        console.log("lastname", lastname);
        console.log("email", email);
        console.log("phoneNumber", phoneNumber);
        if (!isValidPhoneNumber(phoneNumber)) {
            console.log("Invalid phone number. Please enter a valid international phone number.");
            req.flash('error', 'Invalid phone number. Please enter a valid international phone number.');
            res.render('home.ejs', { messages: req.flash('error'), fullName: req.session.user.fullName });
            return;
        }
        // Check if the email is already registered using prepared statement
        const selectQuery = 'SELECT * FROM clients WHERE email = ?';
        db.clientDbConfig.query(selectQuery, [email], function (error, results, fields) {
            if (error) {
                console.log("database error:", error);
                req.flash('error', 'An error occurred while checking if the email is already registered. Please try again later.');
                res.render('home.ejs', { messages: req.flash('error'), fullName: req.session.user.fullName });
                return;
            }
            else {
                console.log(results);
                console.log(selectQuery);
                if (results.length > 0) {
                    // Email already exists
                    console.log("Email already registered");
                    req.flash('error', 'Email already registered.');
                    res.render('home.ejs', { messages: req.flash('error'), fullName: req.session.user.fullName });
                    return;
                }
                else {
                    const insertQuery = 'INSERT INTO clients (firstname, lastname, email, phoneNumber) VALUES (?, ?, ?, ?)';
                    db.clientDbConfig.query(insertQuery, [firstname, lastname, email, phoneNumber], function (error, results, fields) {
                        if (error) {
                            console.log("database error:", error);
                            req.flash('error', 'An error occurred while adding the client. Please try again later.');
                            res.render('home.ejs', { messages: req.flash('error'), fullName: req.session.user.fullName });
                        } else {
                            // Handle successful client addition
                            console.log("client added successfully");
                            req.flash('success', `${firstname} added successfully.`);
                            res.status(200).render('home.ejs', { messages: req.flash('success'),fullName: req.session.user.fullName});
                        }
                    });
                }
            }
        });
    }
});




function isValidPhoneNumber(phoneNumber) {
    const phoneNumberRegex = /^\+972\d{8,9}$/;
    return phoneNumberRegex.test(phoneNumber);
}

module.exports = router;

