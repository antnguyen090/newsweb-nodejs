var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const {body, validationResult} = require('express-validator');
var util = require('util')

const mainName = "article"
const pageTitle = `Article Management`
const systemConfig = require(__path_configs + 'system');
const linkIndex = '/' + systemConfig.prefixAdmin + '/' + mainName;
const modelArticle = require(__path_model_backend + mainName);
const schemaArticle = require(__path_schemas_backend + mainName);
const schemaCategory = require(__path_schemas_backend + 'category');
const notify = require(__path_configs + 'notify');
const layout = __path_views_backend + 'backend';

const UtilsHelpers = require(__path_helpers + 'utils');
const ParamsHelpers = require(__path_helpers + 'params');
const folderView = __path_views_backend + `/pages/${mainName}/`;
const {param} = require('express-validator');
const FileHelpers = require(__path_helpers + 'file');
const uploadThumb	 = FileHelpers.upload('thumb', `${mainName}`);
// List items
router.get('(/status/:status)?', async (req, res, next) => {
	try {
		let category = await schemaCategory.find({status: 'active'})
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
    await schemaArticle.count(objWhere).then((data) => {
        pagination.totalItems = data;
    });

	let data = await modelArticle.listItems(objWhere, 
											pagination.currentPage,
											pagination.totalItemsPerPage,
											{updatedAt: 'desc'},
											)
	res.render(`${folderView}list`, {
				layout,
				pageTitle: pageTitle,
				countItemsActive: data.filter(item => item.status === 'active'),
				items: data,
				statusFilter,
				pagination,
				currentStatus,
				category: category,
				keyword,
				inform: inform
			})
	} catch (error) {
		console.log(error)
	}
})

router.post('(/option)', async (req, res, next) => {
	try {
		let {id, field, isCheck} = req.body
		let data = await modelArticle.changeOption(id, field, isCheck)
		res.send({success: true})
	} catch (error) {
		console.log(error)
	}
})

// access FORM
router.get('/form/(:id)?', async function (req, res, next) {
	try {
		let inform = req.flash()
		let category = await schemaCategory.find({status:'active'})
		let main = {pageTitle: pageTitle,
								categoryList: category,
								inform: inform
								}
		if (req.params.id != undefined) {
			schemaArticle.countDocuments({_id: req.params.id}, async function (err, count){ 
				if(count>0){
					let item = await modelArticle.getItemByID(req.params.id)
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
		console.log(error)
	}
});


router.post('/save/(:id)?',
	uploadThumb,
	body('name')
			.isLength({min: 5, max: 100})
			.withMessage(util.format(notify.ERROR_NAME,5,100))
			.custom(async (val, {req}) => {
			let paramId = (req.params.id != undefined) ? req.params.id : 0
			return await schemaArticle.find({name: val}).then(async user => {
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
			return await schemaArticle.find({slug: val}).then(async user => {
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
	body('editordata')
		.not()
		.isEmpty()
		.withMessage(notify.ERROR_DESCRIPTION),
	body('categoryId')
		.custom(async (val, {req}) => {
			if ( val == undefined) {
				return Promise.reject(notify.ERROR_CATEGORY)
			} else {
				try {
					let data = await schemaCategory.findOne({_id: val, status:'active'});
					return data;
				} catch (error) {
					return Promise.reject(notify.ERROR_CATEGORY_INVALID)
				}
			}
		}),
	body('ordering')
		.isInt({min: 0, max: 99})
		.withMessage(util.format(notify.ERROR_ORDERING,0,99)),
	body('status').not().isIn(['novalue']).withMessage(notify.ERROR_STATUS),
	body('thumb').custom((value,{req}) => {
		const {image_uploaded , image_old} = req.body;
		if(!image_uploaded && !image_old) {
			return Promise.reject(notify.ERROR_FILE_EMPTY);
		}
		if(!req.file && image_uploaded) {
				return Promise.reject(notify.ERROR_FILE_EXTENSION);
		}
		return true;
	}),
	async function (req, res) { // Finds the validation errors in this request and wraps them in an object with handy functions
		try {
			let item = req.body;
			let itemData = [{}]
			if(req.params.id != undefined){
				itemData = await schemaArticle.find({_id: req.params.id})
			}
			let errors = validationResult(req)
			if(!errors.isEmpty()) {
				let category = await schemaCategory.find({status:'active'})
				let main = {pageTitle: pageTitle,
							showError: errors.errors,
							categoryList: category,
						}
				if(req.file != undefined) FileHelpers.remove(`public/uploads/${mainName}/`, req.file.filename); // xóa tấm hình khi form không hợp lệ
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
						item: req.body,
						layout,
					})
				}
				return
			} else {
				if(req.file == undefined){ //không có upload lại hình
					item.thumb = itemData[0].thumb;
				}else {
					item.thumb = req.file.filename;
					if(req.params.id !== undefined){
						FileHelpers.remove(`public/uploads/${mainName}/`, `${itemData[0].thumb}`);
					} 
				}
			}
				if (req.params.id !== undefined) {
					await modelArticle.editItem(req.params.id, item)
					req.flash('success', notify.EDIT_SUCCESS);
					res.redirect(linkIndex);
				} else {
					item.category = req.body.categoryId
					let data = await modelArticle.saveItems(item)
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
			let arrPhoto = req.body.img.split(",")
			let deletePhoto = await arrPhoto.forEach((value)=>{
				FileHelpers.remove(`public/uploads/${mainName}/`, value)
			})
			let data = await modelArticle.deleteItemsMulti(arrId);
			res.send({success: true})
	} else {
			let id = req.body.id
			let thumb = req.body.thumb
			let removePhoto = await FileHelpers.remove(`public/uploads/${mainName}/`, thumb)
			let data = await modelArticle.deleteItem(id);
			res.send({success: true})
	}
	} catch (error) {
		console.log(error)
	}
});

router.post('/change-status/(:status)?', async (req, res, next) => {
	try {
				if (req.params.status === 'multi') {
						let arrId = req.body.id.split(",")
						let status = req.body.status
						let data = await modelArticle.changeStatusItemsMulti(arrId, status);
						res.send({success: true})
				} else {
						let {status, id} = req.body
						status = (status == 'active') ? 'inactive' : 'active'
						let changeStatus = await modelArticle.changeStatus(id, status)
						res.send({success: true})
				}
	} catch (error) {
		console.log(error)
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
		let changeStatus = await modelArticle.changeOrdering(id, ordering)
		res.send({success: true})
		} catch (error) {
			console.log(error)
		}
});

router.post('/changecategory',
		body('id')
				.custom(async (val, {req}) => {
				return await schemaArticle.findOne({_id: val}).then(async user => {
					console.log(user)
					if (!user) {
						return Promise.reject(notify.ERROR_NOT_EXITS)
					}
					return
				})}),
		body('newCategory')
				.custom(async (val, {req}) => {
				return await schemaCategory.findOne({_id: val}).then(async user => {
					if (!user) {
						return Promise.reject(notify.ERROR_NOT_EXITS)
					}
					return
			})}),
	async (req, res, next) => {
		try {
			let {id, newCategory} = req.body
			let errors = validationResult(req)
			if(!errors.isEmpty()) {
				res.send({success: false})
			}else{
				let updateCategory = await modelArticle.changeCategory(id, newCategory)
				res.send({success: true})
			}
	} catch (error) {
		console.log(error)
	}
		// try {
		// 	const errors = validationResult(req);
		// 	if (! errors.isEmpty()) {
		// 		res.send({success: false, errors: errors})
		// 		return
		// 	}
		// 	let {newParent, id} = req.body
		// 	let changeStatus = await modelMenuBar.changeParent(id, newParent)
		// 	res.send({success: true})
		// } catch (error) {
		// 	console.log(error)
		// }
});

module.exports = router;
