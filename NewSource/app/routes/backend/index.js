var express = require('express');
var router = express.Router();

router.use('/dashboard', require('./dashboard'));
router.use('/items', require('./items'));
router.use('/product', require('./product'));
router.use('/category', require('./category'));
router.use('/article', require('./article'));

module.exports = router;
