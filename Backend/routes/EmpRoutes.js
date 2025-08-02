const express = require('express');
const router = express.Router();
const employeeController = require('../Controllers/AddEmpControllers');
const { uploadFields } = require('../midldlewares/multer');
const protect = require('../midldlewares/authMiddleware');

router.post('/sendData', uploadFields, employeeController.createEmployee);
router.get('/view', employeeController.getAllEmployees);
router.delete('/delete/:id', employeeController.deleteEmp);
router.put('/update/:id', uploadFields, employeeController.updateEmployee);
router.get('/editEmp/:id', employeeController.getEmployeeById);
// 👇 Secure endpoint to view own profile
router.get('/view-token', protect, employeeController.getUniq_Emp);


module.exports = router;
