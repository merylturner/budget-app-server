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
    });
});