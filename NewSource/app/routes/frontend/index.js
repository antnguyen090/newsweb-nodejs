var express = require('express');
var router = express.Router();
const folderView	 = __path_views + 'frontend/';

/* GET home page. */
router.get('/?(index)', function(req, res, next) {
  res.render(`${folderView}`, {layout: 'specific-layout',  });
});

router.get('/category', function(req, res, next) {
  res.render(`${folderView}category`, {layout: 'specific-layout',  });
});

router.get('/contact', function(req, res, next) {
  res.render(`${folderView}contact`, {layout: 'specific-layout', });
});

router.get('/single', function(req, res, next) {
  res.render(`${folderView}single`, {layout: 'specific-layout', });
});


module.exports = router;
