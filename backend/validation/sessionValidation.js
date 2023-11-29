const Joi = require('joi');

postSchema = Joi.object({
    password: Joi.string().required()
})

const validateSessionPost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

const validateSessionGet = (req, res, next) => {
    next();
}

const validateSessionDelete = (req, res, next) => {
    next();
}

module.exports = {
    validateSessionPost,
    validateSessionGet,
    validateSessionDelete
}
