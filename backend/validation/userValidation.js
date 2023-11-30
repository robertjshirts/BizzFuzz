const Joi = require('joi');

const passwordSchema = Joi.object({
    password: Joi.string().required()
})

const updateSchema = Joi.object({
    password: Joi.string().required(),
    newPassword: Joi.string().required()
})

const validateUserPost = (req, res, next) => {
    const { error } = passwordSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

const validateUserPut = (req, res, next) => {
    const { error } = updateSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}

const validateUserGet = (req, res, next) => {
    if (req.session.signedIn) {
        return next();
    }
    const { error } = passwordSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

const validateUserDelete = (req, res, next) => {
    if (req.session.signedIn) {
        return next();
    }
    const { error } = passwordSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

module.exports = {
    validateUserPost,
    validateUserGet,
    validateUserPut,
    validateUserDelete
}