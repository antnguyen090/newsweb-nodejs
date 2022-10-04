var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
var util = require('util')

const layout	     = __path_views_frontend + 'frontend';
const StringHelpers 	= require(__path_helpers + 'string');
const systemConfig = require(__path_configs + 'system');
const mainName = "auth"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const notify = require(__path_configs + 'notify');

const linkIndex		= StringHelpers.formatLink('/' + systemConfig.prefixAdmin + '/'); 
const linkLogin		= StringHelpers.formatLink('/' + systemConfig.prefixAdmin + '/auth/login/'); 

router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect(linkLogin);
});


router.get('/login',
 function(req, res, next) {
  res.render(`${folderView}login`,{
    layout: false
  })
})

router.post('/login',
body('email')
			.isEmail()
			.normalizeEmail()
			.withMessage(notify.ERROR_SETTING_EMAIL),
body('password')
			.isLength({min: 10, max: 20})
			.withMessage(util.format(notify.ERROR_PASSWORD,10,20)), function(req, res, next){
	
})

module.exports = router;
