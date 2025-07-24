const express = require('express');

const router = express.Router();
const { loginUser } = require('../Controllers/loginController');

router.post('/login', loginUser);

module.exports = router;
