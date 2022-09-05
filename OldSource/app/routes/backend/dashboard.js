var express = require('express');
var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource dashboard');
// });

const folderView	 = __path_views + 'backend/pages/dashboard/';

router.get('/(:status)?', function(req, res, next) {
  res.render(`${folderView}index`, { });
});

module.exports = router;
