const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require("../db-config");
const validator = require('validator');
const badPasswords = ["mypassword", "password1234", "1234567890", "0987654321"];
const history = process.env.PASSWORD_HISTORY || 3;
const minLength = process.env.PASSWORD_LENGTH || 10;

router.get('/', function (req, res) {
    return res.status(200).render('choosePassword.ejs', { messages: null })
});

function query(sql, args) {
    return new Promise((resolve, reject) => {
        db.userDbConfig.query(sql, args, (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve([rows]);
        });
    });
}

router.post('/', async function (req, res) {
    if (!req.session || !req.session.email) {
        return res.redirect('/login');
    }
    const email = req.session.email;
    console.log("im here");
    console.log('email:', email);

    const { newPassword, newPasswordConfirm } = req.body;


    console.log('New Password:', newPassword);
    console.log('New Password Confirmation:', newPasswordConfirm);

    // Check if the newPassword is too weak
    if (badPasswords.includes(newPassword)) {
        return res.status(400).render('choosePassword.ejs', { messages: 'Password is too weak!' });
    }

    // Validate the new password
    if (!validator.isStrongPassword(newPassword, { 
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
        return res.status(400).render('newPassword', { messages: 'The password must be at least 10 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.' });
    }

    // Check if the password and confirmPassword match
    if (newPassword !== newPasswordConfirm) {
        return res.status(400).render('choosePassword.ejs', { messages: 'Passwords do not match!' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Get the user's password history from the database
    const getUserPasswordHistoryQuery = `SELECT password_history FROM users WHERE email = ?`;
    const [historyRows] = await query(getUserPasswordHistoryQuery, [email]);
    const passwordHistory = historyRows[0]?.password_history ? JSON.parse(historyRows[0].password_history) : [];

    console.log('User password history:', passwordHistory);

    // Check if the new password matches any of the last three passwords
    const previousPasswords = passwordHistory.slice(0, history).map((password) => bcrypt.compareSync(newPassword, password));
    if (previousPasswords.some((match) => match)) {
        return res.status(400).render('choosePassword', { messages: 'The new password must not match any of the last three passwords.' });
    }

    // Hash the previous passwords and add the current password to the user's password history
    const previousPasswordHashes = passwordHistory.slice(0, history - 1).map((password) => bcrypt.hashSync(password, 10));
    const currentPasswordHashed = bcrypt.hashSync(newPassword, 10);
    const updatedPasswordHistory = [currentPasswordHashed, ...previousPasswordHashes];

    console.log('Updated password history:', updatedPasswordHistory);

    // Update the user's password history in the database
    const updatePasswordHistoryQuery = `UPDATE users SET password_history = ? WHERE email = ?`;
    await query(updatePasswordHistoryQuery, [JSON.stringify(updatedPasswordHistory), email]);

    console.log('Password history updated in the database.');

    // Update the user's password in the database
    const updatePasswordQuery = `UPDATE users SET password = ? WHERE email = ?`;
    await query(updatePasswordQuery, [hashedPassword, email]);

    console.log('Password updated in the database.');

    res.redirect('/');
});

module.exports = router; 