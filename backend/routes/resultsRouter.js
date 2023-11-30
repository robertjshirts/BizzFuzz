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
    if (req.session.userId != req.body.userId) {
        return res.status(403).send("Signed into wrong account!");
    }
    next();
}

router.post('', validateResultGet, authorize, (req, res) => {

})

router.get('', validateResultGet, authenticate, authorize, (req, res) => {
    
})

router.delete('', validateResultDelete, authenticate, authorize, (req, res) => {

})

module.exports = router;