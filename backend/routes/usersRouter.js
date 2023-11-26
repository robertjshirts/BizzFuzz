const express = require('express');
const router = express.Router();
const userHandler = require('../BLL/userHandler');
const path = require('path');

const getWithSession = (req, res) => {
    userHandler.getUserData(req.session.userId, (result, err) => {
        if (err) {
            res.status(500).send({ err: err });
            return;
        }
        res.status(200).send(result);
        return;
    });
}

const getWithoutSession = (req, res) => {
    if (!req.body || !req.body.password) {
        res.status(400).send("Missing password field in requestBody!");
        return;
    }

    const userData = {
        username: req.params.username,
        password: req.body.password
    }

    userHandler.logIn(userData, (result, err) => {
        if (err) {
            res.status(403).send();
            return;
        }

        userHandler.getUserData(result.userId, (result, err) => {
            if (err) {
                res.status(500).send();
                return;
            }
            res.status(200).send(result);
        });
    })
}

router.get('/:username', (req, res) => {
    if (req.session.signedIn) {
        getWithSession(req, res);
    } else {
        getWithoutSession(req, res);
    }
});

const postWithoutSession = (req, res) => {
    if (!req.body || !req.body.password) {
        res.status(400).send("Missing password field in requestBody!");
        return;
    }

    const userData = {
        username: req.params.username,
        password: req.body.password
    };

    userHandler.signUp(userData, (result, err) => {
        if (err) {
            res.status(409).send("Username already in use!");
            return;
        }

        req.session.signedIn = true;
        req.session.userId = result.userId;
        req.session.username = result.username;
        req.session.password = userData.password;
        res.status(201).send("User successfully created");
    })
};

router.post('/:username', (req, res) => {
    postWithoutSession(req, res);
});

const deleteWithSession = (req, res) => {
    if (req.session.username !== req.params.username) {
        res.status(403).send("Not logged into correct account!");
        return;
    }

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
};

const deleteWithoutSession = (req, res) => {
    if (!req.body || !req.body.password) {
        res.status(400).send("Missing password field in requestBody!");
        return;
    }

    const userData = {
        username: req.params.username,
        password: req.body.password
    };

    userHandler.logIn(userData, (result, err) => {
        if (err) {
            res.status(403).send("Wrong credentials!");
            return;
        }

        userHandler.deleteUser(result.userId, (result, err) => {
            if (err) {
                res.status(500).send("There was an internal error");
                return;
            }

            res.status(204).send();
        })
    })
};

router.delete('/:username', (req, res) => {
    if (req.session.signedIn) {
        deleteWithSession(req, res);
    } else {
        deleteWithoutSession(req, res);
    }
})

const putWithSession = (req, res) => {
    if (req.params.username !== req.session.username) {
        res.status(403).send("Not logged into correct account!");
        return;
    }

    if (!req.body || req.body.newPassword) {
        res.status(400).send("Missing newPassword field in requestBody!");
        return;
    }

    const updateData = { password: req.body.newPassword };

    userHandler.updateUser(req.session.userId, updateData, (result, err) => {
        if (err) {
            res.status(500).send("There was an internal error!");
            return;
        }
        
        req.session.password = updateData.password;

        res.status(200).send("Password successfully updated");
    }) 
};

const putWithoutSession = (req, res) => {
    if (!req.body || !req.body.password || !req.body.newPassword) {
        res.status(400).send("Missing password field or newPassword field in requestBody!");
        return;
    }
    
    const userData = {
        username: req.params.username,
        password: req.body.password
    };

    const updateData = {
        password: req.body.newPassword
    };

    userHandler.logIn(userData, (result, err) => {
        if (err) {
            res.status(403).send("Wrong credentials!");
            return;
        }

        userHandler.updateUser(result.userId, updateData, (result, err) => {
            if (err) {
                res.status(500).send("There was an internal error!");
                return;
            }

            res.status(200).send("Password successfully updated!");
        });
    });
};

router.put('/:username', (req, res) => {
    if (req.session.signedIn) {
        putWithSession(req, res);
    } else {
        putWithoutSession(req, res);
    }
})

module.exports = router;