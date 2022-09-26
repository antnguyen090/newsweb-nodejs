var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const layout	     = __path_views_frontend + 'frontend';

const mainName = "single"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const systemConfig  = require(__path_configs + 'system');
const notify  		= require(__path_configs + 'notify');
const schemaMenuBar = require(__path_schemas_backend + 'menubar');
const modelSingle   = require(__path_model_frontend + 'single');
const schemaCategory = require(__path_schemas_backend + 'category');


/* GET home page. */
router.get('/(:slug)?', async function(req, res, next) {
    const category     = await schemaCategory.find({status:'active'}).sort({ordering:"asc"})
    const menuNav = await schemaMenuBar.find({status:'active'}).sort({ordering:"asc"})
    if (req.params.slug != undefined){
        try {
            let data = await modelSingle.getArticle(req.params.slug)
            res.render(`${folderView}single`, {
                layout,
                menuNav,
                data,
                category,
             });
        } catch (error) {
            console.log(error)
        }
       
    } else{
        res.render(`${folderView}single`, {
            layout,
            menuNav,
            
         });
    }   
});

module.exports = router;

  