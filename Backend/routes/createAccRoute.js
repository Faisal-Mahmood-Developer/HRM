const express = require('express');
const router = express.Router();
const { CreateAcc, GetAllUsers, ChangePassword } = require('../Controllers/createAcc');

router.post('/create-account', CreateAcc);
router.get('/users', GetAllUsers);
router.put('/change-password/:id', ChangePassword);

module.exports = router;
