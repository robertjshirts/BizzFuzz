const express = require('express');
const router = express.Router();
const quizHandler = require('../BLL/quizHandler');
const { validateQuizPost, validateQuizGet, validateQuizDelete } = require('../validation/quizValidation');

const postWithSession = (req, res) => {
    quizHandler.createQuiz(req.body.creator, req.body, (result, err) => {
        if (err) {
            return res.status(500).send("There was an internal error!");
        }

        return res.status(201).send("Quiz successfully created!");
    });
};

const postWithoutSession = (req, res) => {
    return res.status(401).send("You are not logged in!");
};


router.post('/', validateQuizPost, (req, res) => {
    if (req.session.signedIn) {
        postWithSession(req, res);
    } else {
        postWithoutSession(req, res);
    }
});

const deleteWithSession = (req, res) => {
    quizHandler.deleteUserQuiz(req.session.userId, req.body.quizId, (result, err) => {
        if (err) {
            return res.status(403).send("Wrong credentials!");
        }

        return res.status(204).send();
    });
};

const deleteWithoutSession = (req, res) => {
    return res.status(401).send("You are not logged in!")
};

router.delete('/', validateQuizDelete, (req, res) => {
    if (req.session.signedIn) {
        deleteWithSession(req, res);
    } else {
        deleteWithoutSession(req, res);
    }
});

router.get('/', validateQuizGet, (req, res) => {
    quizHandler.getQuiz(req.body.quizId, (result, err) => {
        if (err) {
            return res.status(404).send("No quiz with that id!");
        }

        return res.status(200).send(result);
    })
})

module.exports = router;