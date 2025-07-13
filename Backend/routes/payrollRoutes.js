const express = require('express');
const router = express.Router();
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
router.get('/getpayroll/:id', getPayrollById); // ✅ New
router.put('/updatepayroll/:id', updatePayroll); // ✅ New
router.get('/by-year/:id', getPayrollsByYear);


module.exports = router;
