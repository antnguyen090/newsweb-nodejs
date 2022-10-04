var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const layout	     = __path_views_frontend + 'frontend';

const mainName = "search"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const systemConfig  = require(__path_configs + 'system');
const notify  		= require(__path_configs + 'notify');
const schemaMenuBar = require(__path_schemas_backend + 'menubar');
const schemaCategory = require(__path_schemas_backend + 'category');
const schemaRSS = require(__path_schemas_backend + 'rss');
const schemaArticle = require(__path_schemas_backend + 'article');
const schemaSetting = require(__path_schemas_backend + "setting");
const schemaWheather = require(__path_schemas_backend + 'wheather');
const WheatherHelpers = require(__path_helpers + 'wheather');
const upWheather = 'public/wheatherfile/'

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    let keywordData = req.query.keyword
    let keyword = new RegExp(keywordData, 'i')
    let delay = 600000;
    const wheather     = await schemaWheather.find({status:'active'}).sort({ordering:"asc"});
    const category     = await schemaCategory.find({status:'active'}).sort({ordering:"asc"})
    const menuNav      = await schemaMenuBar.find({status:'active'}).sort({ordering:"asc"})
    const rss          = await schemaRSS.find({status:'active'}).sort({ordering:"asc"})
    const article      = await schemaArticle.find({status:'active', name: {$regex: keyword}})
                                              .sort({ updatedAt: 'desc' })
                                              .select('-editordata')
    let settingData = await schemaSetting.findOne({})
    settingData = JSON.parse(settingData.setting)                                          
    let dataWheather = await WheatherHelpers.getDataWheather(upWheather, wheather, delay)
          res.render(`${folderView}${mainName}`, {
            dataWheather,
            category,
            layout,
            menuNav,
            rss,
            article,
            settingData,
            dataWheather,
            keywordData
        });
  } catch (error) {
    console.log(error)
  }
});


module.exports = router;

