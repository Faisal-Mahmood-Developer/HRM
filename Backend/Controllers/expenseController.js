const Expense = require('../models/expnesemodel'); // make sure the filename is correct

const addExpense = async (req, res) => {
    try {
        const { date, product, quantity, amount } = req.body;

        const newExpense = new Expense({
            date,
            product,
            quantity,
            amount
        });

        const savedExpense = await newExpense.save();
        res.status(201).json({
            message: "Expense added successfully",
            expense: savedExpense
        });
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({
            message: "Failed to add expense",
            error: error.message
        });
    }
};


// Get all employees
const viewExpense = async (req, res) => {
    try {
        const { month } = req.query;

        // If month is not provided, return all expenses
        if (!month) {
            const allExpenses = await Expense.find().sort({ date: -1 });
            return res.json(allExpenses);
        }

        // Parse month like "2025-06"
        const [year, monthNum] = month.split('-');
        const startDate = new Date(`${year}-${monthNum}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const expenses = await Expense.find({
            date: {
                $gte: startDate,
                $lt: endDate
            }
        }).sort({ date: -1 });

        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};


const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ message: "Expense not found" });
        res.json(expense); // ✅ Return full expense object
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const updateExpense = async (req, res) => {
    try {
        const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Expense not found" });
        res.json({ message: "Expense updated", data: updated });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const deleted = await Expense.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Expense not found" });
        res.json({ message: "Expense deleted successfully", deleted });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    addExpense,
    viewExpense,
    deleteExpense,
    getExpenseById,
    updateExpense
};

