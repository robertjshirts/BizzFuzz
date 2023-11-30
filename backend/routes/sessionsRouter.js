const express = require('express');
const router = express.Router();
const userHandler = require('../BLL/userHandler');

router.post('/:username', (req, res) => {
    if (!req.body || !req.body.password) {
        res.status(400).send("Missing password field in requestBody!");
        return;
    }

    const userData = {
        username: req.params.username,
        password: req.body.password
    }

    userHandler.logIn(userData, (result, err) => {
        if (err) {
            res.status(403).send();
            return;
        }

        req.session.signedIn = true;
        req.session.userId = result.userId;
        req.session.username = result.username;
        req.session.password = userData.password;

        res.status(201).send();
    })
});

router.get('/:username', (req, res) => {
    if (req.session.username && req.session.username === req.params.username) {
        res.status(200).send();
    } else {
        res.status(404).send();
    }
});

router.delete('/:username', (req, res) => {
    req.session.signedIn = false;
    req.session.userId = null;
    req.session.username = null;
    req.session.password = null;
    res.status(204).send();
});

module.exports = router;