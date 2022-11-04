var express = require('express');
var router = express.Router();

const middleAuthentication = require(__path_middleware + 'auth');

router.use('/', middleAuthentication ,require('./dashboard'));
router.use('/dashboard', require('./dashboard'));
router.use('/category', require('./category'));
router.use('/article', require('./article'));
router.use('/menubar', require('./menubar'));
router.use('/rss', require('./rss'));
router.use('/setting', require('./setting'));
router.use('/wheather', require('./wheather'));
router.use('/contact', require('./contact'));
router.use('/manageuser', require('./manageuser'));
router.use('/managegroup', require('./managegroup'));

module.exports = router;