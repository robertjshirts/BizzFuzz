const express = require('express');
const router = express.Router();
const userHandler = require('../BLL/userHandler');
const { validateUserPost, validateUserGet, validateUserPut, validateUserDelete } = require('../validation/userValidation');

// checks for session, creates if doesn't exist
const authenticate = (req, res, next) => {
    if (req.session.signedIn) {
        next();
    } else {
        const userData = {
            username: req.params.username,
            password: req.body.password
        };

        userHandler.logIn(userData, (result, err) => {
            if (err) {
                return res.status(403).send("Wrong credentials!");
            }
            req.session.signedIn = true;
            req.session.userId = result.userId;
            req.session.username = result.username;
            next();
        });
    }
};

// checks for correct username
const authorize = (req, res, next) => {
    if (req.session.username !== req.params.username) {
        return res.status(403).send("Signed into wrong account!");
    }
    next();
}

router.get('/:username', validateUserGet, authenticate, authorize, (req, res) => {
    userHandler.getUserData(req.session.userId, (result, err) => {
        if (err) {
            res.status(500).send("There was an internal error!");
            return;
        }
        res.status(200).send(result);
        return;
    });
});

router.post('/:username', validateUserPost, (req, res) => {
    const userData = {
        username: req.params.username,
        password: req.body.password
    };

    userHandler.signUp(userData, (result, err) => {
        if (err) {
            return res.status(409).send("Username already in use!");
        }

        req.session.signedIn = true;
        req.session.userId = result.userId;
        req.session.username = result.username;
        req.session.password = userData.password;
        res.status(201).send("User successfully created");
    })
});

router.delete('/:username', validateUserDelete, authenticate, authorize, (req, res) => {
    userHandler.deleteUser(req.session.userId, (result, err) => {
        if (err) {
            res.status(500).send("There was an internal error");
            return;
        }

        req.session.signedIn = false;
        req.session.userId = null;
        req.session.username = null;
        req.session.password = null;

        res.status(204).send();
    });
})

router.put('/:username', validateUserPut, authenticate, authorize, (req, res) => {
    userHandler.updateUser(req.session.userId, { password: req.body.newPassword }, (result, err) => {
        if (err) {
            res.status(500).send("There was an internal error!");
            return;
        }

        res.status(200).send("Password successfully updated!");
    });
})

router.get('/uuid/:id', (req, res) => {
    userHandler.getUserData(req.params.id, (result, err) => {
        if (err) {
            return res.status(500).send("There was an internal error!");
        }

        if (!result) {
            return res.status(404).send("There is no user with that ID!");
        }

        return res.status(200).send(result.username)
    })
})

module.exports = router;