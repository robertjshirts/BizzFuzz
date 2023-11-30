const express = require('express');
const router = express.Router();
// const quizHandler = require('../BLL/quizHandler');
const { validateResultPost, validateResultGet, validateResultDelete } = require('../validation/resultValidation');

const authenticate = (req, res, next) => {
    if (!req.session.signedIn) {
        return res.status(401).send("You are not logged in!");
    }

    next();
}

const authorize = (req, res, next) => {
    if (!req.session.signedIn && req.body.userId !== -1) {
        res.status(403).send("")
    }

    next();
}

router.post('', validateResultGet, (req, res) => {

})

router.get('', validateResultGet, authenticate, authorize, (req, res) => {
    
})

router.delete('', validateResultDelete, authenticate, authorize, (req, res) => {

})

module.exports = router;