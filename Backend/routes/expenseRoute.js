const express = require('express');
const router = express.Router();
const {
    addExpense,
    viewExpense,
    getExpenseById,
    deleteExpense,
    updateExpense
} = require('../Controllers/expenseController');

router.post('/addExpense', addExpense);
router.get('/viewExpense', viewExpense);
router.delete('/deleteExpense/:id', deleteExpense);
router.get('/getExpense/:id', getExpenseById);
router.put('/updateExpense/:id', updateExpense);


module.exports = router;
