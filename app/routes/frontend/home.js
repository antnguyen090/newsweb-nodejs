var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const layout	     = __path_views_frontend + 'frontend';

const mainName = "home"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const systemConfig  = require(__path_configs + 'system');
const notify  		= require(__path_configs + 'notify');
const modelHome = require(__path_model_frontend + 'home');
const schemaMenuBar = require(__path_schemas_backend + 'menubar');
const schemaCategory = require(__path_schemas_backend + 'category');
const schemaRSS = require(__path_schemas_backend + 'rss');
const ParamsHelpers = require(__path_helpers + 'params');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const menuNav      = await schemaMenuBar.find({status:'active'}).sort({ordering:"asc"})
    const category     = await schemaCategory.find({status:'active'}).sort({ordering:"asc"})
    const rss          = await schemaRSS.find({status:'active'})
    let keyword = ''
    let objWhereArticle = {status: "active",
                           slider: false, 
                           toppost: false, 
                           breakingnews:false, 
                           fearture: false}

    let objWhereHome = [{status: "active", slider: true}, 
                        {status: "active", toppost: true}, 
                        {status: "active", breakingnews:true}, 
                        {status: "active", fearture: true}]                    
    let pagination = {
        totalItems: 1,
        totalItemsPerPage: 13,
        currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
        pageRanges: 3
    };
    if (keyword !== '') objWhereArticle.name = new RegExp(keyword, 'i');
    pagination.totalItems = await modelHome.totalItems(objWhereArticle)
    console.log(pagination.totalItems)
    let articleHome = await modelHome.listItemsHome(objWhereHome, {updatedAt: 'desc'})
    let article = await modelHome.listItems(objWhereArticle, 
        pagination.currentPage,
        pagination.totalItemsPerPage,
        {updatedAt: 'desc'},
        )

    res.render(`${folderView}home`, {
        pagination,
        layout,
        menuNav,
        article,
        articleHome,
        category,
        rss,
        keyword,
     });
});

module.exports = router;
