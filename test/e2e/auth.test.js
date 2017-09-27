const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = require('chai').assert;
const app = require('../../lib/app');
const request = chai.request(app);

process.env.MONGODB_URI = 'mongodb://localhost:27017/categories-test';
require('../../lib/connect');

const connection = require('mongoose').connection;

describe.only('categories api', () => {
    before(() => connection.dropDatabase());

    const user = {
        name: 'meryl',
        email: 'meryl@iscool.com',
        password: 'cool'
    };

    describe('user management', () => {
        const badRequest = (url, data, code, error) =>
            request
                .post(url)
                .send(data)
                .then(() => {
                    throw new Error('status should not be ok');
                },
                res => {
                    assert.equal(res.status, code);
                    assert.equal(res.response.body.error, error);
                }
                );

        it('signup requires email', () =>
            badRequest('/api/auth/signup', { password: 'cool' }, 400, 'name, email, and password must be supplied')
        );
        it('signup requires password', () =>
            badRequest('/api/auth/signup', { email: 'meryl@iscool.com' }, 400, 'name, email, and password must be supplied')
        );

        let token = '';

        it('signup', () =>
            request
                .post('/api/auth/signup')
                .send(user)
                .then(res => assert.ok(token = res.body.token))
        );

        it('cannot use save email', () =>
            badRequest('/api/auth/signup', user, 400, 'email in use')
        );

        it('signin requires email', () =>
            badRequest('/api/auth/signin', { password: 'abc' }, 400, 'name, email, and password must be supplied')
        );

        it('signin requires password', () =>
            badRequest('/api/auth/signin', { email: 'abc@me.com' }, 400, 'name, email, and password must be supplied')
        );

        it('signin with wrong user', () =>
            badRequest('/api/auth/signin', { email: 'bad User', password: user.password }, 401, 'invalid login')
        );

        it('signin with wrong password', () =>
            badRequest('/api/auth/signin', { email: user.email, password: 'bad' }, 401, 'invalid login')
        );

        it('signin', () =>
            request
                .post('/api/auth/signin')
                .send(user)
                .then(res => assert.ok(res.body.token))
        );

        it('token is invalid', () =>
            request
                .get('/api/auth/verify')
                .send('Authorization', 'bad token')
                .then(
                    () => { throw new Error('success response not expected'); },
                    (res) => { assert.equal(res.status, 401); }
                )
        );

        it('token is valid', () =>
            request
                .get('/api/auth/verify')
                .set('Authorization', token)
                .then(res => assert.ok(res.body))
        );

    });
});