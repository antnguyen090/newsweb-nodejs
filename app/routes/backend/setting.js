var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const {body, validationResult} = require('express-validator');
const notify = require(__path_configs + 'notify');

const mainName = "setting"
const pageTitle = `Setting Management`
const folderView = __path_views_backend + `/pages/${mainName}/`;
const systemConfig = require(__path_configs + 'system');
const linkIndex = '/' + systemConfig.prefixAdmin + '/' + mainName;
const modelSetting = require(__path_model_backend + mainName);
const schemaSetting = require(__path_schemas_backend + mainName);
const schemaCategory = require(__path_schemas_backend + 'category');

const UtilsHelpers = require(__path_helpers + 'utils');
const ParamsHelpers = require(__path_helpers + 'params');
const FileHelpers = require(__path_helpers + 'file');
const uploadThumb	 = FileHelpers.upload('thumb', `${mainName}`);
// List items

// access FORM
router.get('/', async function (req, res, next) {
	let category = await schemaCategory.find({status:'active'})
	let settingData = await schemaSetting.findOne({_id:'6331791e087d00adf830604d'})
	console.log(settingData)
	let main = {pageTitle: pageTitle,
	showError: "",
	showSuccess: "",
	categoryList: category,
	}
	if (settingData.id != undefined) {
				let item = await modelSetting.getItemByID(req.params.id)
				//document exists });
				res.render(`${folderView}form`, {
					main: main,
					item: JSON.parse(settingData.setting),
				});
    } else {
        res.render(`${folderView}form`, {
			main: main,
			item: [],
        });
    }
});


router.post('/save/(:id)?',
	uploadThumb,
	async function (req, res) { // Finds the validation errors in this request and wraps them in an object with handy functions
			let item = req.body;
			item = JSON.stringify(item)
			try {
				if (req.params.id !== undefined) {
					await modelSetting.editItem(req.params.id, {setting: item})
					req.flash('success', "Save Item Successfully");
					res.redirect(linkIndex);
				} else {
					let data = await modelSetting.saveItems({setting: item})
					req.flash('success', "Save Successfully");
					res.redirect(linkIndex);
				}
			} catch (error) {
				console.log(error)
			}
});




module.exports = router;
