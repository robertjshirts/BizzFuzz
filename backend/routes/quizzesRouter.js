const express = require('express');
const router = express.Router();
const quizHandler = require('../BLL/quizHandler');
const { validateQuizPost, validateQuizGet } = require('../validation/quizValidation');


router.post('/', validateQuizPost, (req, res) => {
    //TODO: this (BLL integration)
});

const deleteWithSession = (req, res) => {
    quizHandler.deleteUserQuiz(req.session.userId, req.body.quizId, (result, err) => {
        if (err) {
            return res.status(403).send("Wrong credentials!"); // Kind of vague but it means that your userId and the userId on the quizId passed in don't match. Basically the client doesn't have access to delete the quiz
        }

        return res.status(204).send();
    })
};

const deleteWithoutSession = (req, res) => {
    return res.status(401).send("You are not logged in!")
};

router.delete('/', (req, res) => {
    if (req.session.signedIn) {
        deleteWithSession(req, res);
    } else {
        deleteWithoutSession(req, res);
    }
});

router.get('/', validateQuizGet, (req, res) => {
    //TODO: this (BLL integration)
})

module.exports = router;