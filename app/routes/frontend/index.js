var express = require('express');
var router = express.Router();

const middleGetRandomArticle = require(__path_middleware + 'get-random-article');

router.use('/',middleGetRandomArticle,require('./home'));
router.use('/error', require('./error'));
router.use('/auth', require('./auth'));
router.use('/category', require('./category'));
router.use('/contact', require('./contact'));
router.use('/single', require('./single'));
router.use('/rss', require('./rss'));
router.use('/search', require('./search'));

module.exports = router;
