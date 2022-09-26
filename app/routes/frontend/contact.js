var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const layout	     = __path_views_frontend + 'frontend';

const nodemailer = require("nodemailer");

const mainName = "contact"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const systemConfig  = require(__path_configs + 'system');
const notify  		= require(__path_configs + 'notify');
const schemaMenuBar = require(__path_schemas_backend + 'menubar');
const schemaCategory = require(__path_schemas_backend + 'category');
const schemaRSS = require(__path_schemas_backend + 'rss');
const schemaArticle = require(__path_schemas_backend + 'article');
const schemaSetting = require(__path_schemas_backend + "setting");

/* GET home page. */
router.get('/', async function(req, res, next) {
  const category     = await schemaCategory.find({status:'active'}).sort({ordering:"asc"})
  const menuNav      = await schemaMenuBar.find({status:'active'}).sort({ordering:"asc"})
  const rss          = await schemaRSS.find({status:'active'}).sort({ordering:"asc"})
  const article      = await schemaArticle.find({status:'active'})
                                            .sort({ updatedAt: 'desc' })
                                            .select('-editordata')
  let settingData = await schemaSetting.findOne({_id:'6331791e087d00adf830604d'})
  settingData = JSON.parse(settingData.setting)                                          
    res.render(`${folderView}contact`, {
        category,
        layout,
        menuNav,
        rss,
        article,
        settingData,
     });
});


router.post('/sendmail', async function(req, res, next) {
  let item = req.body
  let send = await modelItems.mainMail(item)
  let data = await modelItems.saveItems(item)
  res.send({success: true})
});


module.exports = router;

