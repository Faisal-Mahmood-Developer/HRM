const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    empId: {
        type: String,
        required: true,
    },
    month: {
        type: String,
        required: true,
    },
    basicSalary: {
        type: Number,
        required: true,
    },
    bonus: {
        type: Number,
        required: true,
    },
    extraOvertime: {
        type: Number,
        required: true,
    },
    medicalAllowance: {
        type: Number,
        required: true,
    },
    conveyanceAllowance: {
        type: Number,
        required: true,
    },
    loanDeductions: {
        type: Number,
        required: true,
    },
    incomeTax: {
        type: Number,
        required: true,
    },
    maritalStatus: {
        type: String,
        enum: ['Single', 'Married'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Payroll', payrollSchema);
