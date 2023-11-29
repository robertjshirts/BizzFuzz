const Joi = require('joi');

const quizletRequestSchema = Joi.object({
    userId: Joi.string().required(),
    page: Joi.number().integer().min(1)
})
const validateQuizletGet = (req, res, next) => {
    const { error } = quizletRequestSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}

module.exports = {
    validateQuizletGet
}