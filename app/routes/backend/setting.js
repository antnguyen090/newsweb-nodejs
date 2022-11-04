var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const {body, validationResult} = require('express-validator');
const notify = require(__path_configs + 'notify');
const fs = require('fs');
var util = require('util')

const mainName = "setting"
const pageTitle = `Setting Management`
const folderView = __path_views_backend + `/pages/${mainName}/`;
const systemConfig = require(__path_configs + 'system');
const linkIndex = '/' + systemConfig.prefixAdmin + '/' + mainName;
const modelSetting = require(__path_model_backend + mainName);
const schemaSetting = require(__path_schemas_backend + mainName);
const schemaCategory = require(__path_schemas_backend + 'category');
const layout = __path_views_backend + 'backend';

const UtilsHelpers = require(__path_helpers + 'utils');
const ParamsHelpers = require(__path_helpers + 'params');
const FileHelpers = require(__path_helpers + 'file');
const uploadThumb = FileHelpers.uploadFileSetting([
  {
    name: 'logoLarge'
  }, {
    name: 'logoSmall'
  }, {
    name: 'logoTitle'
  },
	{
    name: 'logoBanner'
  }
], `${mainName}`);


// List items

// access FORM
router.get('/', async function (req, res, next) {
	try {
				let inform = req.flash()
				let settingObj = await schemaSetting.findOne({})
				let main = {
					inform: inform,
					pageTitle: pageTitle,
				}
				if (settingObj.id != undefined) { // document exists });
							res.render(`${folderView}form`, {
								pageTitle,
								main: main,
								settingObj,
								item: JSON.parse(settingObj.setting),
								layout
							});
					} else {
						res.render(`${folderView}form`, {
							pageTitle,
							main: main,
							item: [],
							layout
						});
					}
	} catch (error) {
		console.log(error)
	}
});


router.post('/save/(:id)?', 
	uploadThumb, 
	body('title')
		.not()
		.isEmpty()
		.withMessage(notify.ERROR_SETTING_TITLEPAGE), 
	body('coppyright')
		.not()
		.isEmpty()
		.withMessage(notify.ERROR_SETTING_COPPYRIGHT),
	body('address')
		.not()
		.isEmpty()
		.withMessage(notify.ERROR_SETTING_ADDRESS), 
	body('phonenumber')
		.isMobilePhone()
		.withMessage(notify.ERROR_SETTING_PHONENUMBER), 
	body('email')
		.isEmail()
		.normalizeEmail()
		.withMessage(notify.ERROR_SETTING_EMAIL), 
	body('linkfacebook')
		.isURL()
		.withMessage(notify.ERROR_SETTING_URLFACEBOOK), 
	body('linkTwitter')
		.isURL().withMessage(notify.ERROR_SETTING_URLTWITTER), 
	body('linkInstagram')
		.isURL()
		.withMessage(notify.ERROR_SETTING_URLINSTAGRAM), 
	body('linkYoutube')
		.isURL()
		.withMessage(notify.ERROR_SETTING_URLYOUTUBE), 
	body('linkLinkedIn')
		.isURL()
		.withMessage(notify.ERROR_SETTING_URLLINKEDIN), 
	body('logoSmall').custom((value, {req}) => {
			const {image_uploaded_small, image_old_small} = req.body;
			if (!image_uploaded_small && !image_old_small) {
				return Promise.reject(notify.ERROR_FILE_EMPTY);
			}
			if (!req.files.logoSmall && image_uploaded_small) {
				return Promise.reject(notify.ERROR_FILE_EXTENSION);
			}
			return true;
	}), 
	body('logoLarge').custom((value, {req}) => {
			const {image_uploaded_large, image_old_large} = req.body;
			if (!image_uploaded_large && !image_old_large) {
				return Promise.reject(notify.ERROR_FILE_EMPTY);
			}
			if (!req.files.logoLarge && image_uploaded_large) {
				return Promise.reject(notify.ERROR_FILE_EXTENSION);
			}
			return true;
	}), 
	body('logoTitle').custom((value, {req}) => {
			const {image_uploaded_title, image_old_title} = req.body;
			if (!image_uploaded_title && !image_old_title) {
				return Promise.reject(notify.ERROR_FILE_EMPTY);
			}
			if (!req.files.logoTitle && image_uploaded_title) {
				return Promise.reject(notify.ERROR_FILE_EXTENSION);
			}
			return true;
	}),
	body('logoBanner').custom((value, {req}) => {
		const {image_uploaded_banner, image_old_banner} = req.body;
		if (!image_uploaded_banner && !image_old_banner) {
			return Promise.reject(notify.ERROR_FILE_EMPTY);
		}
		if (!req.files.logoBanner && image_uploaded_banner) {
			return Promise.reject(notify.ERROR_FILE_EXTENSION);
		}
		return true;
	})
	, async function (req, res) { // Finds the validation errors in this request and wraps them in an object with handy functions
  try {
    let settingObj = await schemaSetting.findOne({})
    let settingData = JSON.parse(settingObj.setting)
    let item = req.body;
    let errors = validationResult(req)
		item.logosmall = (settingData.logosmall!=undefined) ? settingData.logosmall : undefined
		item.logolarge = (settingData.logolarge!=undefined) ? settingData.logolarge : undefined
		item.logotitle = (settingData.logotitle!=undefined) ? settingData.logotitle : undefined
		item.logobanner = (settingData.logobanner!=undefined) ? settingData.logobanner : undefined
    if (! errors.isEmpty()) {
      let main = {
        pageTitle: pageTitle,
        showError: errors.errors,
      }
      if (req.files != undefined) {
        for (const [key, value] of Object.entries(req.files)) {
          FileHelpers.remove(`public/uploads/${mainName}/`, value[0].filename)
        }
      }
      res.render(`${folderView}form`, {
				pageTitle,
        main: main,
        settingObj,
        item: settingData,
				layout
      });
      return
    } else {
					for (const [key, value] of Object.entries(req.files)) {
								let key = value[0].filename.split(".")[0]
								FileHelpers.remove(`public/uploads/${mainName}/`, `${settingData[key]}`)
					}
					for (const [key, value] of Object.entries(req.files)) {
						let key = value[0].filename
						item[key.split(".")[0]] = "uploaded" + key;
						fs.renameSync(`public/uploads/${mainName}/${key}`, `public/uploads/${mainName}/uploaded${
							value[0].filename
						}`);
					}
					item = JSON.stringify(item)
					let saveData = await modelSetting.editItem(settingObj.id, {setting: item})
					req.flash('success', notify.SUCCESS_SETTING_SAVE);
					res.redirect(linkIndex);
      }
  } catch (error) {
    console.log(error)
  }
});


module.exports = router;
