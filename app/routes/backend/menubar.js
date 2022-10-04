var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const {body, validationResult} = require('express-validator');
const notify = require(__path_configs + 'notify');
var util = require('util')

const mainName = "menubar"
const pageTitle = `Menu Bar Management`
const folderView = __path_views_backend + `/pages/${mainName}/`;
const systemConfig = require(__path_configs + 'system');
const linkIndex = '/' + systemConfig.prefixAdmin + '/' + mainName;
const modelMenuBar = require(__path_model_backend + mainName);
const schemaMenuBar = require(__path_schemas_backend + mainName);
const layout = __path_views_backend + 'backend';

const UtilsHelpers = require(__path_helpers + 'utils');
const ParamsHelpers = require(__path_helpers + 'params');
// List items
router.get('(/status/:status)?', async (req, res, next) => {
	try {
		let parentMenuList = await schemaMenuBar.find({parentMenu : "parentmenu"})
    let inform = req.flash()
    let objWhere = {};
    let keyword = ParamsHelpers.getParam(req.query, 'keyword', '');
    let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'all');
    let statusFilter = await UtilsHelpers.createFilterStatus(currentStatus, mainName);
    let pagination = {
        totalItems: 1,
        totalItemsPerPage: 10,
        currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
        pageRanges: 3
    };

    if (currentStatus !== 'all') objWhere.status = currentStatus;
    if (keyword !== '') objWhere.name = new RegExp(keyword, 'i');
    await schemaMenuBar.count(objWhere).then((data) => {
        pagination.totalItems = data;
    });
			let data = await modelMenuBar.listItems(objWhere, 
				pagination.currentPage,
				pagination.totalItemsPerPage,
				{updatedAt: 'desc'},
				)
			res.render(`${folderView}list`, {
				pageTitle: pageTitle,
				countItemsActive: data.filter(item => item.status === 'active'),
				items: data,
				statusFilter,
				pagination,
				currentStatus,
				keyword,
				inform: inform,
				parentMenuList,
				layout,
			})
	} catch (error) {
		console.log(error)
	}
})

// access FORM
router.get('/form/(:id)?',  async function (req, res, next) {
	try {
		let inform = req.flash()
		let parentMenuList = await schemaMenuBar.find({parentMenu : "parentmenu"})
		let main = {pageTitle: pageTitle,
			inform: inform,
			parentMenuList,}
		if (req.params.id != undefined) {
			schemaMenuBar.countDocuments({_id: req.params.id}, async function (err, count){ 
				if(count>0){
					let item = await modelMenuBar.getItemByID(req.params.id)
					//document exists });
					res.render(`${folderView}form`, {
						main: main,
						item: item[0],
						layout,
					});
				} else {
					res.redirect(linkIndex);
				}
			});   
			} else {
					res.render(`${folderView}form`, {
				main: main,
				item: [],
				layout,
					});
			}
	} catch (error) {
		consple.log(error)
	}
});


router.post('/save/(:id)?',
		body('name')
			.isLength({min: 5, max: 100})
			.withMessage(util.format(notify.ERROR_NAME,5,100))
			.custom(async (val, {req}) => {
			let paramId = (req.params.id != undefined) ? req.params.id : 0
			return await schemaMenuBar.find({name: val}).then(async user => {
				let length = user.length
				user.forEach((value, index) => {
					if (value.id == paramId) 
						length = length - 1;
					
				})
				if (length > 0) {
					return Promise.reject(notify.ERROR_NAME_DUPLICATED)
				}
				return
		})}),
	body('slug')
		.isSlug()
		.withMessage(notify.ERROR_SLUG)
		.custom(async (val, {req}) => {
			let paramId = (req.params.id != undefined) ? req.params.id : 0
			return await schemaMenuBar.find({slug: val}).then(async user => {
				let length = user.length
				user.forEach((value, index) => {
					if (value.id == paramId) 
						length = length - 1;
					
				})
				if (length > 0) {
					return Promise.reject(notify.ERROR_SLUG_DUPLICATED)
				}
				return
	})}),
	body('ordering')
		.isInt({min: 0, max: 99})
		.withMessage(util.format(notify.ERROR_ORDERING,0,99)),
	body('status').not().isIn(['novalue']).withMessage(notify.ERROR_STATUS),
	async function (req, res) { // Finds the validation errors in this request and wraps them in an object with handy functions
		try {
			let parentMenuList = await schemaMenuBar.find({parentMenu : "parentmenu"})
			let item = req.body;
			let itemData = [{}]
			if(req.params.id != undefined){
				itemData = await schemaMenuBar.find({_id: req.params.id})
			}
			let errors = validationResult(req)
			if(!errors.isEmpty()) {
				let main = {pageTitle: pageTitle,
							showError: errors.errors,
							parentMenuList,
				}

				if (req.params.id !== undefined){
						res.render(`${folderView}form`, {
							main: main,
							item: itemData[0],
							id: req.params.id,
							layout,
						})
				} else {
					res.render(`${folderView}form`, {
						main: main,
						item,
						layout,
					})
				}
				return
			}
				if (req.params.id !== undefined) {
					let data = await modelMenuBar.editItem(req.params.id, item)
					req.flash('success', notify.EDIT_SUCCESS);
					res.redirect(linkIndex);
				} else {
					let data = await modelMenuBar.saveItems(item);
					req.flash('success', notify.ADD_SUCCESS);
					res.redirect(linkIndex);
				}
			} catch (error) {
				console.log(error)
			}
});



// Delete
router.post('/delete/(:status)?', async (req, res, next) => {
	try {
		if (req.params.status === 'multi') {
			let arrId = req.body.id.split(",")
			let data = await modelMenuBar.deleteItemsMulti(arrId);
			res.send({success: true})
	} else {
			let id = req.body.id
			let data = await modelMenuBar.deleteItem(id);
			res.send({success: true})
	}
	} catch (error) {
		console.log(error)
		res.send({success: false})
	}
});

router.post('/change-status/(:status)?', async (req, res, next) => {
	try {
		if (req.params.status === 'multi') {
			let arrId = req.body.id.split(",")
			let status = req.body.status
			let data = await modelMenuBar.changeStatusItemsMulti(arrId, status);
			res.send({success: true})
	} else {
			let {status, id} = req.body
			status = (status == 'active') ? 'inactive' : 'active'
			let changeStatus = await modelMenuBar.changeStatus(id, status)
			res.send({success: true})
	}
	} catch (error) {
		 console.log(error)
		 res.send({success: false})
	}
});

router.post('/change-ordering', 
	body('ordering')
		.isInt({min: 0, max: 99})
		.withMessage(util.format(notify.ERROR_ORDERING,0,99)), 
	async (req, res, next) => {
		try {
			const errors = validationResult(req);
			if (! errors.isEmpty()) {
				res.send({success: false, errors: errors})
				return
			}
			let {ordering, id} = req.body
			let changeStatus = await modelMenuBar.changeOrdering(id, ordering)
			res.send({success: true})
		} catch (error) {
			console.log(error)
			res.send({success: false})
		}
});

router.post('/changeparentmenu',
	body('id')
				.custom(async (val, {req}) => {
				return await schemaMenuBar.findOne({_id: val}).then(async user => {
					console.log(user)
					if (!user) {
						return Promise.reject(notify.ERROR_NOT_EXITS)
					}
					return
				})}),
	body('newParent')
				.custom(async (val, {req}) => {
				if(val == 'parentmenu') return
				return await schemaMenuBar.findOne({_id: val}).then(async user => {
					console.log(user)
					if (!user) {
						return Promise.reject(notify.ERROR_NOT_EXITS)
					}
					return
				})}),
	async (req, res, next) => {
		try {
			const errors = validationResult(req);
			if (! errors.isEmpty()) {
				res.send({success: false, errors: errors})
				return
			} else{
				let {newParent, id} = req.body
				let changeStatus = await modelMenuBar.changeParent(id, newParent)
				res.send({success: true})
			}
		} catch (error) {
			console.log(error)
			res.send({success: false})
		}
});


module.exports = router;
