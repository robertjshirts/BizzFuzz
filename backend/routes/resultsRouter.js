const express = require('express');
const router = express.Router();
const resultHandler = require('../BLL/resultHandler');
const { validateResultPost, validateResultGet, validateResultDelete } = require('../validation/resultValidation');

const authenticate = (req, res, next) => {
    if (!req.session.signedIn) {
        return res.status(401).send("You are not logged in!");
    }

    next();
}

router.post('', validateResultPost, (req, res) => {
    resultHandler.postResult(
        (req.session.signedIn) ? req.session.userId : -1, 
        req.body.quizId, req.body.answers, (result, err) => {
        if (err) {
            return res.status(500).send("There was an internal error!");
        }

        return res.status(200).send(result);
    })
})

router.get('', validateResultGet, authenticate, (req, res) => {
    
})

router.delete('', validateResultDelete, authenticate, (req, res) => {

})

module.exports = router;