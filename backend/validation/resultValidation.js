const Joi = require('joi');

const answerSchema = Joi.object({
    option: Joi.string().required(),
    result: Joi.number().integer().min(0).max(3).required(),
    weight: Joi.number().integer().min(1).required()
})

const postSchema = Joi.object({
    quizId: Joi.string().required(),
    answers: Joi.array().items(answerSchema).min(1).required()
})

const getSchema = Joi.object({
    quizId: Joi.string().required()
})

const deleteSchema = getSchema;

const validateResultPost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    req.body.userId = (req.session.signedIn) ? req.session.userId : -1
    next();
};

const validateResultGet = (req, res, next) => {
    const { error } = getSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}

const validateResultDelete = (req, res, next) => {
    const { error } = deleteSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}

module.exports = {
    validateResultPost,
    validateResultGet,
    validateResultDelete
}
