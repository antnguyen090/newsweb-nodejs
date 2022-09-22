var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const layout	     = __path_views_frontend + 'frontend';

const mainName = "home"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const systemConfig  = require(__path_configs + 'system');
const notify  		= require(__path_configs + 'notify');
const schemaMenuBar = require(__path_schemas_backend + 'menubar');
const schemaArticle = require(__path_schemas_backend + 'article');
const schemaCategory = require(__path_schemas_backend + 'category');
const schemaRSS = require(__path_schemas_backend + 'rss');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const menuNav      = await schemaMenuBar.find({status:'active'})
    const category     = await schemaCategory.find({status:'active'})
    const rss          = await schemaRSS.find({status:'active'})
    const article      = await schemaArticle.find({status:'active'})
                                            .sort({ updatedAt: 'desc' })
                                            .select('-editordata')
    res.render(`${folderView}home`, {
        layout,
        menuNav,
        article,
        category,
        rss,
     });
});

module.exports = router;
