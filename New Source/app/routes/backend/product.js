var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');


const systemConfig  = require(__path_configs + 'system');
const linkIndex		 = '/' + systemConfig.prefixAdmin + '/product/';
const modelItems  		= require(__path_model + 'product');
const itemsModel 	= require(__path_schemas + 'product');
const notify  		= require(__path_configs + 'notify');

const UtilsHelpers 	= require(__path_helpers + 'utils');
const ParamsHelpers = require(__path_helpers + 'params');

const folderView	 = __path_views + 'backend/pages/product/';
const { param } = require('express-validator');

// List items
router.get('(/status/:status)?', async (req, res, next) => {
 	let inform = req.flash()
  	let objWhere	 = {};
	let keyword		 = ParamsHelpers.getParam(req.query, 'keyword', '');
	let currentStatus= ParamsHelpers.getParam(req.params, 'status', 'all'); 
	let statusFilter = await UtilsHelpers.createFilterStatus(currentStatus);

	let pagination 	 = {
		totalItems		 : 1,
		totalItemsPerPage: 2,
		currentPage		 : parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
		pageRanges		 : 3
	};

	if(currentStatus !== 'all') objWhere.status = currentStatus;
	if(keyword !== '') objWhere.name = new RegExp(keyword, 'i');

	await itemsModel.count(objWhere).then( (data) => {
		pagination.totalItems = data;
	});
	itemsModel
		.find(objWhere)
		.sort({ordering: 'asc'})
		// .skip((pagination.currentPage-1) * pagination.totalItemsPerPage)
		// .limit(pagination.totalItemsPerPage)
		.then( (items) => {
			res.render(`${folderView}list`, { 
				pageTitle : "Items Management" ,
				countItemsActive: items.filter(item => item.status === 'active'),
				items,
				statusFilter,
				pagination,
				currentStatus,
				keyword,
        		showError: "",
        		showSuccess: "",
        		inform : modelItems.showSuccess(inform.success),
			});
		});
});

// access FORM
router.get('/form/(:id)?', async function(req, res, next) {
  if(req.params.id != undefined){
	let item = await modelItems.getItemByID(req.params.id)
	res.render(`${folderView}form`, { pageTitle : "Items Management",
									  showError:"",
									  showSuccess: "",
									  name: item[0].name,
									  status: item[0].status,
									  ordering: item[0].ordering,
									  price: item[0].price,
									  id: item[0].id
									});
  } else {
  res.render(`${folderView}form`, { pageTitle : "Items Management",
									showError:"",
									showSuccess: "",
									name: "",
									status: "",
									ordering: "",
									price: "",
									id: ""
									});
}
});

// save Items
router.post('/save/(:id)?', body('name').isLength({ min: 5 }).withMessage('Have 5 letters').custom( async (val ,{ req })=>{
						let paramId = await (req.params.id != undefined) ? req.params.id : 0
						return await itemsModel.find({name: val}).then(
                        async user=>{
						  let length = user.length
						  user.forEach((value, index)=>{
							if (value.id == paramId ) length = length-1;
						  }
						  )
                          if(length > 0){
                             return Promise.reject("Duplicated Name")
                          } 
						  return "true"
                       }
                      )
                      }),
                     body('ordering').isInt({ min: 0, max: 99}).withMessage('Ordering must be number from 0 to 99'),
                      async function (req, res) {
                            // Finds the validation errors in this request and wraps them in an object with handy functions
                            const errors = validationResult(req);
							console.log(errors)
                            if (!errors.isEmpty()) {
                            res.render(`${folderView}form`, {showError: modelItems.showError(errors.errors), 
																pageTitle : "Items Management",
																showSuccess: "",
																name: req.body.name,
																status: req.body.status,
																ordering: req.body.ordering,
																price: req.body.price,
																id: req.params.id,
							})
                            return 
                            }

                            try {
								if(req.params.id !== undefined){
									let data =  await modelItems.editItem(req.params.id, req.body)
									req.flash('success',"Edit Item Successfully");
									res.redirect(linkIndex);	
								} else {
									let data = await modelItems.saveItems(req.body);
									req.flash('success',"Add Item Successfully");
									res.redirect(linkIndex);	
								}
                            } catch (error){
                                console.log(error)
                            }
                    }
);

// Delete
router.post('/delete/(:status)?', async (req, res, next) => {
	console.log(req.params.status)
	if(req.params.status === 'multi'){
		let arrId = req.body.id.split(",")
		let data = await modelItems.deleteItemsMulti(arrId);
		res.send({success : true})
	} else {
	let id	= req.body.id
	let data = await modelItems.deleteItem(id);
	res.send({success : true})
	}
});

// Delete - Multi
// router.post('/delete', (req, res, next) => {
// 	// ItemsModel.remove({_id: {$in: req.body.cid }}, (err, result) => {
//     console.log(req.body.cid)
// 		req.flash('success', 'Delete Multi Successfull');
// 		res.redirect(linkIndex);
// });

router.post('/change-status/(:status)?', async (req, res, next) => {
	if(req.params.status === 'multi'){
		let arrId = req.body.id.split(",")
		let status = req.body.status
		console.log(status)
		let data = await modelItems.changeStatusItemsMulti(arrId, status);
		res.send({success : true})
	}else{
		let {status, id} = req.body
		status = (status == 'active')? 'inactive' : 'active'
		let changeStatus = await modelItems.changeStatus(id, status)
		res.send({success : true})	
	}
});

router.post('/change-ordering', 
		body('ordering').isInt({ min: 0, max: 99}).withMessage('Ordering must be number from 0 to 99'),
		async (req, res, next) => {
								const errors = validationResult(req);
								if ( !errors.isEmpty()){
									res.send({success : false, errors:errors })
									return
								}
								let {ordering, id} = req.body
								let changeStatus = await modelItems.changeOrdering(id, ordering)
								res.send({success : true})
});

router.post('/change-price', 
		body('ordering').isInt({ min: 0}).withMessage('Price must be number from 0'),
		async (req, res, next) => {
								const errors = validationResult(req);
								if ( !errors.isEmpty()){
									res.send({success : false, errors:errors })
									return
								}
								let {price, id} = req.body
								let changeStatus = await modelItems.changePrice(id, price)
								res.send({success : true})
});


module.exports = router;
