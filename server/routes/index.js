const express = require('express');
const router = express.Router();

router.use('/users', require('./user'));
router.use('/login', require('./login'));
router.use('/server', require('./server'));
router.use('/stations', require('./station'));

module.exports = router