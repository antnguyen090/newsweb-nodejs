var express = require('express');
var router = express.Router();
const folderView	 = __path_views + 'frontend/';
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(`${folderView}`, { pageTitle: 'Front-End' });
});

module.exports = router;
