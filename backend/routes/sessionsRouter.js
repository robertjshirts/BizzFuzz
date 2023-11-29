const express = require('express');
const router = express.Router();
const userHandler = require('../BLL/userHandler');
const { validateSessionPost, validateSessionGet, validateSessionDelete } = require('../validation/sessionValidation');

router.post('/:username', validateSessionPost, (req, res) => {
    const userData = {
        username: req.params.username,
        password: req.body.password
    }

    userHandler.logIn(userData, (result, err) => {
        if (err) {
            res.status(403).send("Wrong credentials!");
            return;
        }

        req.session.signedIn = true;
        req.session.userId = result.userId;
        req.session.username = result.username;
        req.session.password = userData.password;

        res.status(201).send("Session successfully created");
    })
});

router.get('/:username', validateSessionGet, (req, res) => {
    if (req.session.username === req.params.username) {
        res.status(200).send("Session exists");
    } else {
        res.status(404).send("No session found");
    }
});

router.delete('/:username', validateSessionDelete, (req, res) => {
    req.session.signedIn = false;
    req.session.userId = null;
    req.session.username = null;
    req.session.password = null;
    res.status(204).send();
});

module.exports = router;