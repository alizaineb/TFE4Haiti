const express = require('express');
const router = express.Router();

router.use('/users', require('./user'));
router.use('/login', require('./login'));
router.use('/server', require('./server'));

module.exports = router