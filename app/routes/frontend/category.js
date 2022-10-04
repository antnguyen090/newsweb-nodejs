var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const {body, validationResult} = require('express-validator');
const layout	     = __path_views_frontend + 'frontend';

const mainName = "category"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const systemConfig = require(__path_configs + 'system');
const notify = require(__path_configs + 'notify');
const schemaMenuBar = require(__path_schemas_backend + 'menubar');
const schemaCategory = require(__path_schemas_backend + 'category');
const schemaRSS = require(__path_schemas_backend + 'rss');
const schemaArticle = require(__path_schemas_backend + 'article');
const linkIndex = '/index'
const schemaSetting = require(__path_schemas_backend + "setting");
const schemaWheather = require(__path_schemas_backend + 'wheather');
const WheatherHelpers = require(__path_helpers + 'wheather');
const upWheather = 'public/wheatherfile/'

/* GET home page. */
router.get('/(:category)?', async function (req, res, next) {
    try {
        if (req.params.category != undefined) {
            const category = await schemaCategory.find({status: 'active'}).sort({ordering: "asc"})
            const objCategory = category.find(item => item.slug === req.params.category);
            if (objCategory != undefined) { // document exists });
                let delay = 600000;
                const wheather = await schemaWheather.find({status: 'active'}).sort({ordering: "asc"});
                const category = await schemaCategory.find({status: 'active'}).sort({ordering: "asc"})
                const menuNav = await schemaMenuBar.find({status: 'active'}).sort({ordering: "asc"})
                const rss = await schemaRSS.find({status: 'active'}).sort({ordering: "asc"})
                let settingData = await schemaSetting.findOne({})
                settingData = JSON.parse(settingData.setting)
                const article = await schemaArticle.find({status: 'active', categoryId: `${objCategory.id}`}).sort({updatedAt: 'desc'}).select('-editordata')
                let dataWheather = await WheatherHelpers.getDataWheather(upWheather, wheather, delay)
                        res.render(`${folderView}category`, {
                            layout,
                            menuNav,
                            category,
                            rss,
                            article,
                            objCategory,
                            settingData,
                            dataWheather
                        });
            } else {
                res.redirect(linkIndex);
            }
        } else {
            res.redirect(linkIndex);
        }
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;
