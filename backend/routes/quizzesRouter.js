const express = require('express');
const router = express.Router();
const quizHandler = require('../BLL/quizHandler');
const { validateQuizPost, validateQuizGet, validateQuizDelete } = require('../validation/quizValidation');

const authenticate = (req, res, next) => {
    if (!req.signedIn) {
        return res.status(401).send("You are not logged in!")
    }
    next();
}

const authorize = (req, res, next) => {
    quizHandler.getQuiz(req.session.userId, (result, err) => {
        if (err) {
            if (err === "No entity with that identifier exists!") {
                return res.status(404).send("There is no quiz with that id!")
            }

            return res.status(500).send("There was an internal error!");
        }

        if (result.userId !== req.session.userId) {
            return res.status(403).send("You do not have permission to edit this quiz!");
        }

        next();
    })
}

router.post('/', validateQuizPost, authenticate, (req, res) => {
    quizHandler.createQuiz(req.body.creator, req.body, (result, err) => {
        if (err) {
            return res.status(500).send("There was an internal error!");
        }

        return res.status(201).send("Quiz successfully created!");
    });
});

router.delete('/:quizId', validateQuizDelete, authenticate, authorize, (req, res) => {
    quizHandler.deleteUserQuiz(req.session.userId, req.params.quizId, (result, err) => {
        if (err) {
            return res.status(500).send("There was an internal error!");
        }

        return res.status(204).send();
    });
});

router.get('/:quizId', validateQuizGet, (req, res) => {
    quizHandler.getQuiz(req.params.quizId, (result, err) => {
        if (err) {
            if (err === "No entity with that identifier exists!") {
                return res.status(404).send("There is no quiz with that id!")
            }
            return res.status(500).send("There was an internal error");
        }

        return res.status(200).send(result);
    })
})

module.exports = router;