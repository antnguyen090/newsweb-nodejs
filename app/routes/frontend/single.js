var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const layout	     = __path_views_frontend + 'frontend';

const mainName = "single"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const systemConfig  = require(__path_configs + 'system');
const notify  		= require(__path_configs + 'notify');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render(`${folderView}single`, {
        layout,
     });
});

module.exports = router;

  