const express = require('express');
const router = express.Router();
const quizHandler = require('../BLL/quizHandler');
const { validateQuizletGet } = require('../validation/quizletValidation');


router.post('/', validateQuizletGet, (req, res) => {
    if (!req.body.query) {
        quizHandler.getNewQuizzes(
            (req.session.signedIn) ? req.session.userId : -1, 
            req.body.page, (result, err) => {
            if (err) {
                return res.status(500).send("There was an internal error!");
            }

            return res.status(200).send(result);
        });
    } else {
        quizHandler.searchQuizlets(req.body.page, req.body.query, req.body.sort, (result, err) => {
            if (err) {
                return res.status(500).send("There was an internal error!");
            }

            return res.status(200).send(result);
        })
    }

});

module.exports = router;