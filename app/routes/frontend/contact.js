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

/* GET home page. */
router.get('/', async function(req, res, next) {
  const menuNav       = await schemaSliders.find({status:'active'})
    res.render(`${folderView}contact`, {
        layout,
        menuNav,
     });
});


router.post('/sendmail', async function(req, res, next) {
  let item = req.body
  let send = await modelItems.mainMail(item)
  let data = await modelItems.saveItems(item)
  res.send({success: true})
});


module.exports = router;
