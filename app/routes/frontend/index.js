var express = require('express');
var router = express.Router();

router.use('/',require('./home'));
router.use('/auth', require('./auth'));
router.use('/category', require('./category'));
router.use('/contact', require('./contact'));
router.use('/single', require('./single'));
router.use('/rss', require('./rss'));
router.use('/search', require('./search'));
router.use('/error', require('./error'));

module.exports = router;
