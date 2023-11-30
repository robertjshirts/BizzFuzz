const Joi = require('joi');

const searchRequestSchema = Joi.object({
    userId: Joi.string().required(),
    page: Joi.number().integer().min(1).required(),
    query: Joi.string().allow("").optional(),
    sort: Joi.string().valid('MOST POPULAR', 'LEAST POPULAR', 'NEWE[ST', 'OLDEST', 'MOST RELEVANT').required()
})

const validateQuizletGet = (req, res, next) => {
    const { error } = searchRequestSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}

module.exports = {
    validateQuizletGet
}