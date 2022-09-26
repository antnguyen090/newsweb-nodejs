var express = require('express');
var router = express.Router();

router.use('/', require('./home'));
router.use('/index', require('./home'));
router.use('/category', require('./category'));
router.use('/contact', require('./contact'));
router.use('/single', require('./single'));
router.use('/rss', require('./rss'));


module.exports = router;
