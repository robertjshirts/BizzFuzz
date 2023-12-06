const express = require('express');
const app = express();
const port = 3001;
const session = require('express-session');
const cors = require('cors');
const path = require('path');

app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(session({
    secret: 'ridiculously-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

const resultsRouter = require('./routes/resultsRouter');
const quizletsRouter = require('./routes/quizletsRouter');
const quizzesRouter = require('./routes/quizzesRouter');
const sessionsRouter = require('./routes/sessionsRouter');
const usersRouter = require('./routes/usersRouter');

app.use('/results', resultsRouter)
app.use('/quizlets', quizletsRouter);
app.use('/quizzes', quizzesRouter);
app.use('/sessions', sessionsRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
