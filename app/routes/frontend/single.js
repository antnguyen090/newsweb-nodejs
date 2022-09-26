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
const schemaSetting = require(__path_schemas_backend + "setting");
const schemaRSS = require(__path_schemas_backend + 'rss');
const schemaArticle = require(__path_schemas_backend + 'article');

/* GET home page. */
router.get('/(:slug)?', async function(req, res, next) {
    const category     = await schemaCategory.find({status:'active'}).sort({ordering:"asc"})

    const menuNav = await schemaMenuBar.find({status:'active'}).sort({ordering:"asc"})
    const rss          = await schemaRSS.find({status:'active'}).sort({ordering:"asc"})
    const article      = await schemaArticle.find({status:'active'})
                                            .sort({ updatedAt: 'desc' })
                                            .select('-editordata')
    let settingData = await schemaSetting.findOne({_id:'6331791e087d00adf830604d'})
    settingData = JSON.parse(settingData.setting)    
    if (req.params.slug != undefined){
        try {
            let data = await modelSingle.getArticle(req.params.slug)
            res.render(`${folderView}single`, {
                layout,
                article,
                menuNav,
                data,
                category,
                settingData,
                rss,
             });
        } catch (error) {
            console.log(error)
        }
       
    } else{
        res.render(`${folderView}single`, {
            layout,
            menuNav,
            settingData,
         });
    }   
});

module.exports = router;

  