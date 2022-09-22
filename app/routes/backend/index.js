var express = require('express');
var router = express.Router();

router.use('/dashboard', require('./dashboard'));
router.use('/sliders', require('./sliders'));
router.use('/category', require('./category'));
router.use('/article', require('./article'));
router.use('/menubar', require('./menubar'));
router.use('/rss', require('./rss'));
router.use('/', require('./dashboard'));



module.exports = router;
