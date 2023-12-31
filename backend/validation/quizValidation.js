const Joi = require('joi');

// Ansers inside of each question6
const answerSchema = Joi.object({
    option: Joi.string().required(),
    result: Joi.number().integer().min(0).max(3).required(),
    weight: Joi.number().integer().min(1).required()
});

// Questions inside of quiz
const questionSchema = Joi.object({
    prompt: Joi.string().required(),
    answers: Joi.array().items(answerSchema).min(1).required()
});

// Results inside of quiz
const resultSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required()
});

// Full object
const quizSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    creator: Joi.string().required(),
    questions: Joi.array().items(questionSchema).min(1).required(),
    results: Joi.array().items(resultSchema).min(2).max(4).required()
});

const validateQuizPost = (req, res, next) => {
    const { error } = quizSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

const validateQuizGet = (req, res, next) => {
    const id = req.params.quizId.slice(1);
    const { error } = Joi.string().guid().validate(id);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}

const validateQuizDelete = (req, res, next) => {
    const id = req.params.quizId.slice(1);
    const { error } = Joi.string().guid().validate(id);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}

module.exports = {
    validateQuizPost,
    validateQuizGet,
    validateQuizDelete
}