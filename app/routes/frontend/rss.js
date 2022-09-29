var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout = __path_views_frontend + 'frontend';
let Parser = require('rss-parser');
let parser = new Parser();
const fetch = (...args) => import ('node-fetch').then(({default: fetch}) => fetch(...args));
const newDate = require('new-date');
const fs = require('fs');


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
const upWheather = 'public/wheatherfile/'

/* GET home page. */
router.get('/(:id)?', async function (req, res, next) {
    try {
        const wheather = await schemaWheather.find({status: 'active'}).sort({ordering: "asc"});
        let settingData = await schemaSetting.findOne({_id: '6331791e087d00adf830604d'})
        settingData = JSON.parse(settingData.setting)
        let delay = 600000
        let dataFile = ''
        let rss = await modelRSS.getDataCategory()
        let category = await schemaCategory.find({status: 'active'})
        let menuNav = await modelRSS.getDataMenuBar()
        const article = await schemaArticle.find({status: 'active'}).sort({updatedAt: 'desc'}).select('-editordata')
        let rssData = (req.params.id != undefined) ? await modelRSS.getDataRSS(req.params.id) : undefined;
        let feedRSS;
        let dataStoreRSS;
        if (rssData != undefined) {
            try {
                dataFileRSS = fs.readFileSync(`${upRSS}${
                    rssData.id
                }`, 'utf8')
                dataFileRSS = JSON.parse(dataFileRSS)
                let datePub = newDate(dataFileRSS.pubDate)
                let dateNow = newDate(Date.now())
                if (dateNow - datePub > delay) {
                    feedRSS = await parser.parseURL(rssData.link);
                    dataStoreRSS = JSON.stringify(feedRSS);
                    fs.writeFile(`${upRSS}${
                        rssData.id
                    }`, dataStoreRSS, err => {
                        if (err) 
                            throw err;
                        
                        console.log('File successfully written to disk 1');
                    });
                } else {
                    feedRSS = dataFile;
                }
            } catch (error) {
                feedRSS = await parser.parseURL(rssData.link);
                dataStoreRSS = JSON.stringify(feedRSS);
                fs.writeFile(`${upRSS}${
                    rssData.id
                }`, dataStoreRSS, err => {
                    console.log('File successfully written to disk 2');
                });
            }
            let dataFile,
                dataStore,
                feed,
                result
            let dataWheather = [];
            let data = await wheather.forEach(async (item, index) => {
            try {
                dataFile = fs.readFileSync(`${upWheather}${
                    item.id
                }`, 'utf8')
                dataFile = JSON.parse(dataFile)
                let datePub = newDate(dataFile.pubDate)
                let dateNow = newDate(Date.now())
                if (dateNow - datePub > delay) { // change the endpoint with yours
                    result = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${
                        item.api
                    }%20viet%20nam?unitGroup=metric&key=ZTYE8BVSEZGU69YC62WFMKQLH&contentType=json`);
                    feed = await result.json();
                    feed.pubDate = newDate(Date.now())
                    feed.id = await item.id
                    dataStore = JSON.stringify(feed);
                    dataWheather.push(feed)
                    fs.writeFile(`${upWheather}${
                        item.id
                    }`, dataStore, err => {
                        console.log('File successfully written to disk ');
                    });

                } else {
                    feed = dataFile;
                    dataWheather.push(feed)
                }
            } catch (error) { // change the endpoint with yours
                result = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${
                    item.api
                }%20viet%20nam?unitGroup=metric&key=ZTYE8BVSEZGU69YC62WFMKQLH&contentType=json`);
                feed = await result.json();
                feed.pubDate = newDate(Date.now())
                feed.id = await item.id
                dataStore = JSON.stringify(feed);
                fs.writeFile(`${upWheather}${
                    item.id
                }`, dataStore, err => {
                    console.log('File successfully written to disk 3');
                });
                dataWheather.push(feed)
            }
            if (dataWheather.length == wheather.length) {
                res.render(`${folderView}rss`, {
                    layout,
                    menuNav,
                    category,
                    feed: feedRSS,
                    article,
                    rss,
                    settingData,
                    dataWheather,
                })
            }
        })

    } else {
        res.redirect('/error')
    }
} catch (error) {
    console.log(error)
}});

module.exports = router;
