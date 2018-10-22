const express = require('express');
const router = express.Router();

router.use('/articles', require('./articles'));
router.use('/auth', require('./auth'));

module.exports = router;