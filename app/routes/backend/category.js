var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const {body, validationResult} = require('express-validator');

const mainName = "category"
const pageTitle = `Category Management`
const systemConfig = require(__path_configs + 'system');
const linkIndex = '/' + systemConfig.prefixAdmin + '/' + mainName;
const modelCategory = require(__path_model_backend + mainName);
const schemaCategory = require(__path_schemas_backend + mainName);
const notify = require(__path_configs + 'notify');

const ValidateProduct	= require(__path_validates_backend + mainName);
const UtilsHelpers = require(__path_helpers + 'utils');
const ParamsHelpers = require(__path_helpers + 'params');
const folderView = __path_views_backend + `/pages/${mainName}/`;
const FileHelpers = require(__path_helpers + 'file');
const uploadThumb	 = FileHelpers.upload('thumb', `${mainName}`);
// List items
router.get('(/status/:status)?', async (req, res, next) => {
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
    await schemaCategory.count(objWhere).then((data) => {
        pagination.totalItems = data;
    });
			let data = await modelCategory.listItems(objWhere, 
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
				showError: "",
				showSuccess: "",
				inform: modelCategory.showSuccess(inform.success)
			})
})

// access FORM
router.get('/form/(:id)?',  function (req, res, next) {
	let main = {pageTitle: pageTitle,
	showError: "",
	showSuccess: "",}
	if (req.params.id != undefined) {
		schemaCategory.countDocuments({_id: req.params.id}, async function (err, count){ 
			if(count>0){
				let item = await modelCategory.getItemByID(req.params.id)
				//document exists });
				res.render(`${folderView}form`, {
					main: main,
					item: item[0],
				});
			} else {
				res.redirect(linkIndex);
			}
		});   
    } else {
        res.render(`${folderView}form`, {
			main: main,
			item: [],
        });
    }
});


router.post('/save/(:id)?',
	body('name').isLength({min: 5})
		.withMessage('Have 5 letters')
		.custom(async (val, {req}) => {
			let paramId = await(req.params.id != undefined) ? req.params.id : 0
			return await schemaCategory.find({name: val}).then(async user => {
				let length = user.length
				user.forEach((value, index) => {
					if (value.id == paramId) 
						length = length - 1;
					
				})
				if (length > 0) {
					return Promise.reject("Duplicated Name")
				}
				return "true"
		})}), 
	body('ordering')
		.isInt({min: 0, max: 99})
		.withMessage('Ordering must be number from 0 to 99'),
	body('status').not().isIn(['novalue']).withMessage(notify.ERROR_STATUS),
	async function (req, res) { // Finds the validation errors in this request and wraps them in an object with handy functions
			console.log(req.body)
			let item = req.body;
			let itemData = [{}]
			if(req.params.id != undefined){
				itemData = await schemaCategory.find({_id: req.params.id})
			}
			let errors = await validationResult(req)
			console.log(errors)
			if(!errors.isEmpty()) {
				let main = {pageTitle: pageTitle,
							showError: modelCategory.showError(errors.errors),
							showSuccess: "",}
				if (req.params.id !== undefined){
						res.render(`${folderView}form`, {
							main: main,
							item: itemData[0],
							id: req.params.id
						})
				} else {
					res.render(`${folderView}form`, {
						main: main,
						item: req.body,
					})
				}
				return
			}

			try {
				if (req.params.id !== undefined) {
					let data = await modelCategory.editItem(req.params.id, item)
					req.flash('success', "Edit Item Successfully");
					res.redirect(linkIndex);
				} else {
					let data = await modelCategory.saveItems(item);
					req.flash('success', "Add Item Successfully");
					res.redirect(linkIndex);
				}
			} catch (error) {
				console.log(error)
			}
});



// Delete
router.post('/delete/(:status)?', async (req, res, next) => {
    console.log(req.params.status)
    if (req.params.status === 'multi') {
        let arrId = req.body.id.split(",")
        let data = await modelCategory.deleteItemsMulti(arrId);
        res.send({success: true})
    } else {
        let id = req.body.id
        let data = await modelCategory.deleteItem(id);
        res.send({success: true})
    }
});

router.post('/change-status/(:status)?', async (req, res, next) => {
    if (req.params.status === 'multi') {
        let arrId = req.body.id.split(",")
        let status = req.body.status
        console.log(status)
        let data = await modelCategory.changeStatusItemsMulti(arrId, status);
        res.send({success: true})
    } else {
        let {status, id} = req.body
        status = (status == 'active') ? 'inactive' : 'active'
        let changeStatus = await modelCategory.changeStatus(id, status)
        res.send({success: true})
    }
});

router.post('/change-ordering', 
	body('ordering')
		.isInt({min: 0, max: 99})
		.withMessage('Ordering must be number from 0 to 99'), 
	async (req, res, next) => {
		const errors = validationResult(req);
		if (! errors.isEmpty()) {
			res.send({success: false, errors: errors})
			return
		}
		let {ordering, id} = req.body
		let changeStatus = await modelCategory.changeOrdering(id, ordering)
		res.send({success: true})
});

router.post('/change-price', 
	body('price')
		.isInt({min: 0})
		.withMessage('Price must be number from 0'), 
	async (req, res, next) => {
		const errors = validationResult(req);
		if (! errors.isEmpty()) {
			res.send({success: false, errors: errors})
			return
		}
		let {price, id} = req.body
		let changeStatus = await modelCategory.changePrice(id, price)
		res.send({success: true})
});


module.exports = router;