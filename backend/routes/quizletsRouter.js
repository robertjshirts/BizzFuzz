const express = require('express');
const router = express.Router();
const quizHandler = require('../BLL/quizHandler');
const { validateQuizletGet } = require('../validation/quizletValidation');


router.get('/', validateQuizletGet, (req, res) => {
    quizHandler.getNewQuizzes(req.body.userId, (result, err) => { //Named oddly, really gets new quizlets
        if (err) {
            return res.status(500).send("There was an internal error!");
        }
        // TODO: this
    });
});

module.exports = router;