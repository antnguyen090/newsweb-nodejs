var express = require('express');
var router = express.Router();

const folderView	 = __path_views + 'backend/pages/dashboard/';

router.get('/(:status)?', function(req, res, next) {
  res.render(`${folderView}index`, {});
});

module.exports = router;
