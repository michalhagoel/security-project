const express = require('express');
const router = express.Router();
const requireAuth = require('../auth');

router.get('/', requireAuth, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router; 