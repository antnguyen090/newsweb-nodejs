var express = require('express');
var router = express.Router();

router.use('/', require('./dashboard'));
router.use('/dashboard', require('./dashboard'));
router.use('/sliders', require('./sliders'));
router.use('/category', require('./category'));
router.use('/article', require('./article'));
router.use('/menubar', require('./menubar'));


module.exports = router;
