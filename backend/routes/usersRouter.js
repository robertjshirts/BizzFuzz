const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/:username', (req, res) => {
    if (req.session.userId === req.params.username) {
        res.status(200).send( req.session.userId ) // replace with data from DAL
    } else {
        const { password } = req.body;
        const username = req.params.username;
        if (!password) {
            res.status(400).send();
            return;
        }
        // If login works
        res.status(200).send( username ); // Add some json with the user data instead of username
        return;
        // If login doesn't work (wrong user/pass)
        res.status(401).send();
    }
});

router.post('/:username', (req, res) => {
    const { password } = req.body;
    const username = req.params.username;
    if (!password) {
        res.status(400).send();
        return;
    }
    // If username not taken and user created successfully
    req.session.userId = username // Replace with bllResponse.username
    res.status(201).send( {username: username, password: password} ); // Replace with full user object
    return;
    // If username taken
    res.status(409).send();
});

router.delete('/:username', (req, res) => {
    const { password } = req.body;
    const username = req.params.username;
    if (!password) {
        res.status(400).send();
        return;
    }
    // If credentials match
    req.session.destroy();
    res.status(204).send();
    return;
    // If credentials don't match
    res.status(403).send();
})

router.put('/:username', (req, res) => {
    const { password, newPassword } = req.body;
    const username = req.params.username;
    if (!password || !newPassword) {
        res.status(400).send();
        return;
    }
    // If credentials match and update was successful
    res.status(200).send();
    return;
    // If credentials don't match
    res.status(403).send();
})

module.exports = router;