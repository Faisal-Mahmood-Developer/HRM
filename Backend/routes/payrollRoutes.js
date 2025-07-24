const express = require('express');
const router = express.Router();
const protect = require('../midldlewares/authMiddleware');
const {
    addPayroll,
    getPayrolls,
    deletePyroll,
    getPayrollById,
    getPayrollsByYear,
    updatePayroll
} = require('../Controllers/payrollController');

router.post('/addpayroll', addPayroll);
router.get('/viewpayroll', getPayrolls);
router.delete('/delpayroll/:id', deletePyroll);
router.get('/getpayroll/:id', getPayrollById);
router.put('/updatepayroll/:id', updatePayroll);
router.get('/by-year', protect, getPayrollsByYear);

module.exports = router;
