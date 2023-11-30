const express = require('express');
const router = express.Router();
const quizHandler = require('../BLL/quizHandler');
const { validateQuizletGet } = require('../validation/quizletValidation');


router.get('/', validateQuizletGet, (req, res) => {
    quizHandler.getNewQuizzes(req.body.userId, (result, err) => {
        if (err) {
            return res.status(500).send("There was an internal error!");
        }

        return res.status(200).send(result);
    });
});

module.exports = router;