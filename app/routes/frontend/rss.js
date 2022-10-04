var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout = __path_views_frontend + 'frontend';

const mainName = "rss"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const systemConfig = require(__path_configs + 'system');
const notify = require(__path_configs + 'notify');
const modelRSS = require(__path_model_frontend + 'rss');
const upRSS = 'public/rssfile/'
const schemaArticle = require(__path_schemas_backend + 'article');
const schemaCategory = require(__path_schemas_backend + 'category');
const schemaSetting = require(__path_schemas_backend + "setting");
const schemaWheather = require(__path_schemas_backend + 'wheather');
const WheatherHelpers = require(__path_helpers + 'wheather');
const ParamsHelpers = require(__path_helpers + 'params');
const RssHelpers = require(__path_helpers + 'rss')
const upWheather = 'public/wheatherfile/'

/* GET home page. */
router.get('/(:id)?', async function (req, res, next) {
    try {
        let rssData = (req.params.id != undefined) ? await modelRSS.getDataRSS(req.params.id) : undefined;
        if (rssData != undefined) {
            const wheather = await schemaWheather.find({status: 'active'}).sort({ordering: "asc"});
            let settingData = await schemaSetting.findOne({})
            settingData = JSON.parse(settingData.setting)
            let delay = 600000
            let lengthArr = 13
            let rss = await modelRSS.getDataCategory()
            let category = await schemaCategory.find({status: 'active'})
            let menuNav = await modelRSS.getDataMenuBar()
            const article = await schemaArticle.find({status: 'active'}).sort({updatedAt: 'desc'}).select('-editordata')
            let feedRSS        = await RssHelpers.getFeedRss(upRSS, rssData.id, rssData.link, delay, lengthArr)
            let dataWheather = await WheatherHelpers.getDataWheather(upWheather, wheather, delay)
            let pagination = {
                totalItems: feedRSS.totalRss,
                totalItemsPerPage: lengthArr,
                currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
                pageRanges: 3
            };
            res.render(`${folderView}rss`, {
                    layout,
                    pagination,
                    menuNav,
                    category,
                    feed: feedRSS,
                    article,
                    rss,
                    link: `rss/${rssData.id}`,
                    settingData,
                    dataWheather,
                })
    } else {
        res.redirect('/error')
    }
} catch (error) {
    console.log(error)
}});

module.exports = router;
