const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

const usersRouter = require('./routes/usersRouter');

app.use('/u', usersRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
