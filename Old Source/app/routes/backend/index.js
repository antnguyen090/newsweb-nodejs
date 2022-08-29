
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');

//   // res.render('index', { title: 'Express' });
// });

var express = require('express');
var router = express.Router();

router.use('/', require('./home'));
router.use('/dashboard', require('./dashboard'));
router.use('/items', require('./items'));


module.exports = router;