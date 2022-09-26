var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const layout	     = __path_views_frontend + 'frontend';

const mainName = "category"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const systemConfig  = require(__path_configs + 'system');
const notify  		= require(__path_configs + 'notify');
const schemaMenuBar = require(__path_schemas_backend + 'menubar');
const schemaCategory = require(__path_schemas_backend + 'category');
const schemaRSS = require(__path_schemas_backend + 'rss');
const schemaArticle = require(__path_schemas_backend + 'article');
const linkIndex     = '/index'
/* GET home page. */
router.get('/(:category)?', async function(req, res, next) {
    const category     = await schemaCategory.find({status:'active'}).sort({ordering:"asc"})
    const menuNav = await schemaMenuBar.find({status:'active'}).sort({ordering:"asc"})
    const rss     = await schemaRSS.find({status:'active'}).sort({ordering:"asc"})

    if (req.params.category != undefined) {
                const objCategory = category.find(item => item.slug === req.params.category);
                if(objCategory != undefined){
                    //document exists });
                    const article      = await schemaArticle.find({status:'active', categoryId: `${objCategory.id}` })
                                                            .sort({ updatedAt: 'desc' })
                                                            .select('-editordata')
                    res.render(`${folderView}category`, {
                        layout,
                        menuNav,
                        category,
                        rss,
                        article,
                        objCategory,
                    });
                } else {
                    res.redirect(linkIndex);
                }
    } else {
        res.redirect(linkIndex);
     }
    
});

module.exports = router;
