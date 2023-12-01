const express = require('express');
const router = express.Router();
const resultHandler = require('../BLL/resultHandler');
const { validateResultPost, validateResultGet, validateResultDelete } = require('../validation/resultValidation');
const quizHandler = require('../BLL/quizHandler');

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

        return res.status(201).send(result);
    })
})

router.get('', validateResultGet, authenticate, (req, res) => {
    resultHandler.getResult(req.session.userId, req.body.quizId, (result, err) => {
        if (err) {
            return res.status(500).send("There was an internal error!");
        }

        if (!result) {
            return res.status(404).send("You have not taken this quiz!");
        }

        return res.status(200).send(result.completedQuizzes[0]); // Should offload this to the BLL
    })
})

router.delete('', validateResultDelete, authenticate, (req, res) => {
    resultHandler.deleteResult(req.session.userId, req.body.quizId, (result, err) => {
        if (err) {
            return res.status(500).send("There was an internal error!");
        }

        return res.status(204).send();
    })
})

module.exports = router;