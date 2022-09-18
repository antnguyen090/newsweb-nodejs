var express = require('express');
var router = express.Router();

const mainName = "dashboard"
const pageTitle = `Dashboard Management`
const folderView = __path_views_backend + `/pages/${mainName}/`;

router.get('/(:status)?', function(req, res, next) {
  res.render(`${folderView}index`, {});
});

module.exports = router;
