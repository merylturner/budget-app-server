// const assert = require('chai').assert;
// const Expense = require('../../lib/models/expense');
// const Category = require('../../lib/models/category');

// const expectedValidation = () => {
//     throw new Error('expected validation errors');
// };

// describe('expense model', () => {

//     it('validates the model', () => {
//         const category = new Category({name: 'Home', budget: 40, date: '12/1/2008'});
//         const expense = new Expense({
//             name: 'Kitchen Cabinets',
//             category: category._id,
//             budget: 5000,
//             date: '09/04/2017'
//         });
//         return expense.validate();
//     });

//     it('fails validation with missing fields', () => {
//         const expense = new Expense();

//         return expense.validate()
//             .then(expectedValidation, err => {
//                 const errors = err.errors;
//                 assert.ok(errors.name && errors.name.kind === 'required');
//                 assert.ok(errors.category && errors.category.kind === 'required');
//                 assert.ok(errors.budget && errors.budget.kind === 'required');
//                 assert.ok(errors.date && errors.date.kind === 'required');
//             });
//     });
// });