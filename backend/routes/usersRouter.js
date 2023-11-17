const express = require('express');
const router = express.Router();
const path = require('path');


const validateFields = (data, requiredFields) => {
    let sterilized = {}
    for (let field of requiredFields) {
        if (!data.hasOwnProperty(field)) {
            throw new Error(`Field ${field} is required.`);
        } else {
            sterilized[field] = data[field];
        }
    }
    return sterilized;
}

router.get('/{id}', (req, res) => {

});

router.post('/', (req, res) => {
    const requiredFields = ['username', 'password'];
    let requestJson = req.body;
    let sterilizedJson;
    try {
        sterilizedJson = validateFields(requestJson, requiredFields);
    } catch (e) {
        res.status(400).send({ error: e.message});
        return;
    }
    // TODO: add BLL function here (not yet implemented in BLL)
    res.status(200).send({ // Return object subject to change
        success: true,
        message: "User created successfully"
    });
});

module.exports = router;