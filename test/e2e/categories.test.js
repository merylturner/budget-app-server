const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = require('chai').assert;
const app = require('../../lib/app');
const request = chai.request(app);

process.env.MONGODB_URI = 'mongodb://localhost:27017/categories-test';
require('../../lib/connect');

const connection = require('mongoose').connection;

describe('categories api', () => {
    before(() => connection.dropDatabase());

    it('initial GET returns empty list', () => {
        return request.get('/api/categories')
            .then(req => {
                const categories = req.body;
                assert.deepEqual(categories, []);
            });
    });

    let home = { name: 'home', budget: 80, date: '5/23/2017', expenses: [] };
    let food = { name: 'food', budget: 800, date: '5/23/2017', expenses: [] };
    let entertainment = { name: 'entertainment', budget: 1000, date: '5/23/2017', expenses: [] };

    function saveCategory(category) {
        return request
            .post('/api/categories')
            .send(category)
            .then(res => res.body);
    }

    it('saves a category', () => {
        return saveCategory(home)
            .then(saved => {
                assert.ok(saved._id);
                home = saved;
            })
            .then(() => {
                return request.get(`/api/categories/${home._id}`);
            })
            .then(res => res.body)
            .then(got => {
                assert.deepEqual(got, home);
            });
    });


    it('gets all the categories', () => {
        return Promise.all([
            saveCategory(food),
            saveCategory(entertainment),
        ])
            .then(() => request.get('/api/categories'))
            .then(res => res.body)
            .then(categories => {
                assert.equal(categories.length, 3);
            });
    });

    describe('expenses api', () => {

        let expenses = [
            {
                name: 'kitchen',
                category: home._id,
                budget: 50,
                date: '12/03/2016'
            },
            {
                name: 'bathroom',
                category: home._id,
                budget: 800,
                date: '12/03/2016'
            },
            {
                name: 'living room',
                category: home._id,
                budget: 500,
                date: '12/03/2016'
            }
        ];

        let id = null;

        before(() => id = home._id);

        function saveExpense(expense) {
            return request.post(`/api/categories/${id}/expenses`)
                .send(expense)
                .then(req => req.body);
        }

        before(() => {
            return Promise.all(expenses.map(saveExpense))
                .then(([,,saved]) => {
                    expenses = saved;
                });
        });

        it('returns expenses for a category', () => {
            return request.get(`/api/categories/${id}`)
                .then(({ body: category }) => {
                    assert.deepEqual(category.expenses, expenses);
                });
        });
    });
});