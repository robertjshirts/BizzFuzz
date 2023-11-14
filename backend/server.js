const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

console.log("Blake");

app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

const exampleRouter = require('./routes/exampleRouter');

app.use('/example', exampleRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
