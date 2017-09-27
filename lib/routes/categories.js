const Router = require('express').Router;
const router = Router();
const Category = require('../models/category');

router
    .get('/', (req, res, next) => {
        Category.find()
            .lean()
            .then(categories => res.send(categories))
            .catch(next);
    })
    .post('/', (req, res, next) => {
        new Category(req.body)
            .save()
            .then(category => res.send(category))
            .catch(next);
    })
    .put('/:id', (req, res, next) => {
        Category.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(category => res.send(category))
            .catch(next);
    })
    .put('/:id/expenses/:id', (req, res, next) => {
        const catId = req.url.split('/')[1];
        Category.findOneAndUpdate({_id: catId}, {expenses: {_id: req.params.id}}, {$set: {"expenses.expense" : req.body}})
            .then(expense => res.send(expense))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        const id = req.params.id;
        Category.findById(id)
            .lean()
            .then(category => {
                if (!category) throw { code: 400, error: `${id} not found` };
                else res.send(category);
            })
            .catch(next);
    })
    .post('/:id/expenses', (req, res, next) => {
        Category.findByIdAndUpdate(req.params.id, {
            $push: { expenses: req.body },
        }, { new: true })
            .then(category => res.send(category))
            .catch(next);
    })
    .delete('/:id/expenses/:id', (req, res, next) => {
        const catId = req.url.split('/')[1];
        Category.findOneAndUpdate({_id: catId}, {$pull: {expenses: {_id: req.params.id}}}, {new: true})
            .then(response => res.send(response))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        Category.findByIdAndRemove(req.params.id)
            .then(response => {
                res.send({ removed: !!response });
            })
            .catch(next);
    });

module.exports = router;