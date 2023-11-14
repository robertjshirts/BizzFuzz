const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    console.log("This is inside of the request");
    res.sendStatus(200);
})