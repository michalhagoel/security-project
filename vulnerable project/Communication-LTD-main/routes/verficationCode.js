const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require("../db-config");
let tempcode;
router.get('/', function (req, res) {

    tempcode = req.session.tempcode; // retrieve code from session
    delete req.session.tempcode; // remove code from session
    // render reset password page with code
    //res.render('resetPassword', { errorMessage: null, errorMessage1: null });
    console.log(tempcode);
    return res.status(200).render('verficationCode.ejs', { errorMessage: null, errorMessage1: null })
});

router.post('/', async (req, res) => {
    let { code } = req.body;
    console.log(code);
    console.log(tempcode);
    if (code === tempcode) {
        console.log("Code is correct");
        return res.redirect('/choosePassword');
    }
    else { console.log("Code is not correct"); }

    return res.status(400).render('resetPassword.ejs', { errorMessage: "Code is incorrect", errorMessage1: null })
});

//console.log(`code: ${tempcode}`);


module.exports = router;

