const Joi = require('joi');

const userIdSchema = Joi.object({
    userId: Joi.string().required()
})
const validateQuizletGet = (req, res, next) => {
    const { error } = userIdSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}

module.exports = {
    validateQuizletGet
}