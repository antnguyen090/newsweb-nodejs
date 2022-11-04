var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
var util = require('util')
var passport = require('passport');

const StringHelpers 	= require(__path_helpers + 'string');
const systemConfig = require(__path_configs + 'system');
const mainName = "auth"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const notify = require(__path_configs + 'notify');
const modelUser = require(__path_model_backend + 'manageuser');

const linkIndex		= StringHelpers.formatLink('/' + systemConfig.prefixAdmin + '/'); 
const linkLogin		= StringHelpers.formatLink('/auth/login'); 

router.get('/logout', function(req, res, next) {
	req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


router.get('/login',
 function(req, res, next) {
	try {
		if(req.isAuthenticated()) res.redirect(linkIndex);
		let item	= {email: '', password: ''};
		let errors   = (req.flash().hasOwnProperty('error')) ? req.flash() : undefined
		res.render(`${folderView}login`, { layout: false, errors, item, success: undefined });
	} catch (error) {
		console.log(error)
	}
})

router.get('/forgotpassword',
 function(req, res, next) {
	try {
		if(req.isAuthenticated()) res.redirect(linkIndex);
		let item	= {email: ''};
		let errors = null
		res.render(`${folderView}forgotpassword`, { layout: false ,errors});
	} catch (error) {
		console.log(error)
	}
})

router.post('/resetpassword',
 async function(req, res, next) {
	try {
		if(req.isAuthenticated()) res.redirect(linkIndex);
		let {username, otp, password, passwordagain} = req.body
		let resetPassword = {user: {username: username}}
		let errors = undefined
		if (password === passwordagain){
			let reset = await modelUser.finalResetPassword(username, otp, password)
			if(reset.hasOwnProperty('error')){
				errors = reset
				res.render(`${folderView}resetpassword`, {layout: false,resetPassword, errors});
			} else {
				success = reset
				res.render(`${folderView}login`, { layout: false ,errors, success});
			}
		} else{
			errors = {error: 'Password and Re-Password not same'}
			res.render(`${folderView}resetpassword`, {layout: false, resetPassword, errors});
		}
	} catch (error) {
		console.log(error)
	}
})

router.post('/forgotpassword',
 	async function(req, res, next) {
	try {
		if(req.isAuthenticated()) res.redirect(linkIndex);
		let errors = undefined
		let resetPassword = await modelUser.resetPassword(req.body.username)
		resetPassword = (!resetPassword) ? {} : resetPassword
		if(resetPassword.hasOwnProperty('success')){
			res.render(`${folderView}resetpassword`, {layout: false, resetPassword, errors});
		} else {
			errors = resetPassword.hasOwnProperty('error') ? resetPassword : null
			res.render(`${folderView}forgotpassword`, {layout: false, errors});
		}
	} catch (error) {
		console.log(error)
	}
})

router.post('/login',
			body('username')
						.isEmail()
						.normalizeEmail()
						.withMessage(notify.ERROR_EMAIL),
			body('password')
						.isLength({min: 5, max: 20})
						.withMessage(util.format(notify.ERROR_PASSWORD,5,20)), 
			async function(req, res, next){
				try {
					if(req.isAuthenticated()) res.redirect(linkIndex);
					req.body = JSON.parse(JSON.stringify(req.body));
					let item 	= Object.assign(req.body);
					let errors = await validationResult(req)
					if(!errors.isEmpty()) { 
						res.render(`${folderView}login`, {  layout: false, item, errors: errors.errors, success: undefined });
					}else {
						passport.authenticate('local', { 
							successRedirect: linkIndex,
							failureRedirect: linkLogin,
							failureFlash: true
								})(req, res, next)
								return
					}
				} catch (error) {
					console.log(error)
				}
})


module.exports = router;
