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
const WheatherHelpers = require(__path_helpers + 'wheather');
const upWheather = 'public/wheatherfile/'
const schemaSetting = require(__path_schemas_backend + "setting");
const schemaWheather = require(__path_schemas_backend + 'wheather');
const coinPriceHelpers = require(__path_helpers + 'getcoin');


/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        let limitArticleHome = 20
        let limitArticle     = 60
        let delay = 600000;
        let settingData = await schemaSetting.findOne({})
        let coinPrice     = await coinPriceHelpers.getCoinPrice()
        const wheather     = await schemaWheather.find({status:'active'}).sort({ordering:"asc"});
        const menuNav      = await schemaMenuBar.find({status:'active'}).sort({ordering:"asc"})
        const category     = await schemaCategory.find({status:'active'}).sort({ordering:"asc"})
        const rss          = await schemaRSS.find({status:'active'})
        settingData = JSON.parse(settingData.setting)
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
    let articleHome = await modelHome.listItemsHome(objWhereHome, 
                                                    {updatedAt: 'desc'},
                                                    limitArticleHome)
    let article = await modelHome.listItems(objWhereArticle, 
                                            limitArticle,
                                            {updatedAt: 'desc'},
                                            )
    let dataWheather = await WheatherHelpers.getDataWheather(upWheather, wheather, delay)
    res.render(`${folderView}home`, {
        layout,
        menuNav,
        article,
        articleHome,
        category,
        rss,
        keyword,
        settingData,
        dataWheather,
        coinPrice,
     });
     res.statusCode = 200;
    } catch (error) {
        console.log(error)
    }
    
});

module.exports = router;
