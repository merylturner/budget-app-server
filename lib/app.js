const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler');
const redirectHttp = require('./redirect-http')();
const ensureAuth = require('./auth/ensure-auth')();
const checkDB = require('./check-connection')();


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('./public'));

if(process.env.NODE_ENV === 'production') {
    app.use(redirectHttp);
}

const me = require('./routes/me');
const auth = require('./routes/auth');
const categories = require('./routes/categories');

if(process.env.NODE_ENV !== 'production') {
    app.use(checkDB);
}

app.use('/api/auth', auth);
app.use('/api/me', ensureAuth, me);
app.use('/api/categories', ensureAuth, categories);
app.use((req, res) => {
    res.sendFile('index.html', {
        root: './public/',
    });
});

app.use(errorHandler());

module.exports = app;