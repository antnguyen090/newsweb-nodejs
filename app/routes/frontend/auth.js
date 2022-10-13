var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
var util = require('util')

var passport = require('passport');

const layout	     = __path_views_frontend + 'frontend';
const StringHelpers 	= require(__path_helpers + 'string');
const systemConfig = require(__path_configs + 'system');
const mainName = "auth"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const notify = require(__path_configs + 'notify');


// const middleGetUserInfo         = require(__path_middleware + 'get-user-info');
// const middleGetCategoryForMenu  = require(__path_middleware + 'get-category-for-menu');
// const middleArticleRandom       = require(__path_middleware + 'get-article-random');


const linkIndex		= StringHelpers.formatLink('/' + systemConfig.prefixAdmin + '/'); 
const linkLogin		= StringHelpers.formatLink('/auth/login/'); 

console.log(linkIndex)
console.log(linkLogin)

router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect(linkLogin);
});


router.get('/login',
 function(req, res, next) {
	if(req.isAuthenticated()) res.redirect(linkIndex);
	let item	= {email: '', 'password': ''};
	let errors   = null;
	res.render(`${folderView}login`, { layout: false, errors, item });
	
})
//middleGetUserInfo, middleGetCategoryForMenu, middleArticleRandom,
router.get('/no-permission',  function(req, res, next) {
	res.render(`${folderView}index`, { layout: layoutBlog,  top_post: false});
});
  
router.post('/login',
body('email')
			.isEmail()
			.normalizeEmail()
			.withMessage(notify.ERROR_SETTING_EMAIL),
body('password')
			.isLength({min: 5, max: 20})
			.withMessage(util.format(notify.ERROR_PASSWORD,10,20)), async function(req, res, next){
				if(req.isAuthenticated()) res.redirect(linkIndex);
				req.body = JSON.parse(JSON.stringify(req.body));
				let item 	= Object.assign(req.body);
				let errors = await validationResult(req)
				if(!errors.isEmpty()) { 
					res.render(`${folderView}login`, {  layout: false, item, errors });
				}else {
					passport.authenticate('local', { 
						successRedirect: linkIndex,
						failureRedirect: linkLogin,
						failureFlash: true
							})(req, res, next);
				}
})


module.exports = router;
