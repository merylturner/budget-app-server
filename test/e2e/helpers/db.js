const connection = require('mongoose').connection;
const request = require('./request');
process.env.MONGODB_URI = 'mongodb://localhost/budget-test';
require('../../../lib/connect');


module.exports = {
    drop() {
        return connection.dropDatabase();
    },
    getToken(user = { name: 'me', email: 'me@me.com', password: 'abc' }) {
        return request.post('/api/auth/signup')
            .send(user)
            .then(res => res.body.token);
    }
};