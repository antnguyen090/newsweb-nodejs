var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const layout	     = __path_views_frontend + 'frontend';
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));
const newDate = require('new-date');
const fs = require('fs');
const e = require('express');

const mainName = "search"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const systemConfig  = require(__path_configs + 'system');
const notify  		= require(__path_configs + 'notify');
const schemaMenuBar = require(__path_schemas_backend + 'menubar');
const schemaCategory = require(__path_schemas_backend + 'category');
const schemaRSS = require(__path_schemas_backend + 'rss');
const schemaArticle = require(__path_schemas_backend + 'article');
const schemaSetting = require(__path_schemas_backend + "setting");
const schemaWheather = require(__path_schemas_backend + 'wheather');
const upWheather         = 'public/wheatherfile/'
const removeVietnameseTonesHelpers = require(__path_helpers + 'removeVietnameseTones');
/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    let keywordData = req.query.keyword
    let keyword = new RegExp(keywordData, 'i')
    let delay = 600000;
    const wheather     = await schemaWheather.find({status:'active'}).sort({ordering:"asc"});
    const category     = await schemaCategory.find({status:'active'}).sort({ordering:"asc"})
    const menuNav      = await schemaMenuBar.find({status:'active'}).sort({ordering:"asc"})
    const rss          = await schemaRSS.find({status:'active'}).sort({ordering:"asc"})
    const article      = await schemaArticle.find({status:'active', name: {$regex: keyword}})
                                              .sort({ updatedAt: 'desc' })
                                              .select('-editordata')
    let settingData = await schemaSetting.findOne({_id:'6331791e087d00adf830604d'})
    settingData = JSON.parse(settingData.setting)                                          

      let dataFile, dataStore, feed,result
      let dataWheather = [];
      let data = await wheather.forEach(async (item, index)=>{
           try {
               dataFile = fs.readFileSync(`${upWheather}${item.id}`,'utf8')
               dataFile = JSON.parse(dataFile)
               let datePub = newDate(dataFile.pubDate)
               let dateNow = newDate(Date.now())
               if(dateNow-datePub > delay){
                           // change the endpoint with yours
                           result = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${item.api}%20viet%20nam?unitGroup=metric&key=ZTYE8BVSEZGU69YC62WFMKQLH&contentType=json`);
                           feed = await result.json();
                           feed.pubDate = newDate(Date.now())
                           feed.id      = await item.id
                           dataStore  =  JSON.stringify(feed);
                           dataWheather.push(feed)
                           fs.writeFile(`${upWheather}${item.id}`, dataStore, err => {
                               console.log('File successfully written to disk ');
                           });
   
               } else {
                       feed = dataFile;
                       dataWheather.push(feed)
               }
           } catch (error) {
                   // change the endpoint with yours
                   result = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${item.api}%20viet%20nam?unitGroup=metric&key=ZTYE8BVSEZGU69YC62WFMKQLH&contentType=json`);
                   feed = await result.json();
                   feed.pubDate = newDate(Date.now())
                   feed.id      = await item.id
                   dataStore  =  JSON.stringify(feed);
                   fs.writeFile(`${upWheather}${item.id}`, dataStore, err => {
                       console.log('File successfully written to disk 3');
                   });
                   dataWheather.push(feed)
           }
       if (dataWheather.length == wheather.length){
          res.render(`${folderView}${mainName}`, {
            dataWheather,
            category,
            layout,
            menuNav,
            rss,
            article,
            settingData,
            dataWheather,
            keywordData
        });
       }
       })
  } catch (error) {
    console.log(error)
  }
});


module.exports = router;

