const assert = require('chai').assert;
const Category = require('../../lib/models/category');

const expectedValidation = () => {
    throw new Error('expected validation errors');
};

describe('category model', () => {

    it('validates the model', () => {
        const category = new Category({
            name: 'Home',
            budget: 500,
            date: '09/04/2017'
        });
        return category.validate();
    });

    it('fails validation with missing fields', () => {
        const category = new Category();

        return category.validate()
            .then(expectedValidation, err => {
                const errors = err.errors;
                assert.ok(errors.name && errors.name.kind === 'required');
                assert.ok(errors.budget && errors.budget.kind === 'required');
            });
    });
});