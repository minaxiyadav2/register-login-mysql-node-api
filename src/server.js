require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const handleError = require('./utils/error-handle')

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(cors());
app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

// api routes
app.use('/users', require('./controllers/user.controller'));

// global error handler
app.use(handleError);

// server starts
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80): 4001;
app.listen(port, () => console.log('Server listening on port ' + port));
