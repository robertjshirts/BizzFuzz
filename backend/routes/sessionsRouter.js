const express = require('express');
const router = express.Router();

router.post('/:username', (req, res) => {
    const { password } = req.body;
    const username = req.params.username;
    if (!password) {
        res.status(400).send();
    }
    // If BLL responds with valid user/pass
    req.session.userId = username; // Likely replaced by the response from the BLL
    res.status(200).send();
    return;
    // If BLL responds with invalid user/pass
    res.status(403).send();
});

router.get('/:username', (req, res) => {
    if (req.session.userId && req.session.userId === req.params.username) {
        res.status(200).send();
    } else {
        res.status(404).send();
    }
});

router.delete('/:username', (req, res) => {
    if (req.session.userId && req.session.userId === req.params.username) {
        req.session.destroy();
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});


module.exports = router;