var express = require('express');
var router = express.Router();

const folderView	 = __path_views + 'backend/pages/home/';

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.render(`${folderView}home`, {  });
// });

router.get('/', function(req, res, next) {
  console.log(folderView+"index")
  res.render(`${folderView}index`, { pageTitle: "Home" });
});



module.exports = router;
