var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout	     = __path_views_frontend + 'frontend';
let Parser = require('rss-parser');
let parser = new Parser();
const fs = require('fs');
const newDate = require('new-date');

const mainName = "rss"
const folderView = __path_views_frontend + `pages/${mainName}/`;
const systemConfig  = require(__path_configs + 'system');
const notify  		= require(__path_configs + 'notify');
const modelRSS      = require(__path_model_frontend + 'rss');
const upRSS         = 'public/rssfile/'
const schemaArticle = require(__path_schemas_backend + 'article');
const schemaCategory = require(__path_schemas_backend + 'category');

/* GET home page. */
router.get('/(:id)?', async function(req, res, next) {
    let delay        = 3600000
    let dataFile     = ''
    let rss          = await modelRSS.getDataCategory()
    let category     = await schemaCategory.find({status:'active'})
    let menuNav      = await modelRSS.getDataMenuBar()
    const article    = await schemaArticle.find({status:'active'})
                                            .sort({ updatedAt: 'desc' })
                                            .select('-editordata')
    let rssData      = await modelRSS.getDataRSS(req.params.id);
    let feed;                                        
    let dataStore;
        if (rssData.id != undefined){
                try {
                        dataFile = await fs.readFileSync(`${upRSS}${rssData.id}`,'utf8',function(err, data) {
                                if(err){
                                    console.log(err) 
                                } else {
                                    return data;
                                }
                        })
                        dataFile = JSON.parse(dataFile)
                        let datePub = newDate(dataFile.pubDate)
                        let dateNow = newDate(Date.now())
                        if(dateNow-datePub > delay){
                                feed = await parser.parseURL(rssData.link);
                                dataStore  = await JSON.stringify(feed);
                                await fs.writeFile(`${upRSS}${rssData.id}`, dataStore, err => {
                                        if (err) throw err;
                                        console.log('File successfully written to disk');
                                }); 
                        } else {
                                feed = dataFile;
                        }
                } catch (error) {
                        feed = await parser.parseURL(rssData.link);
                        dataStore  = await JSON.stringify(feed);
                        await fs.writeFile(`${upRSS}${rssData.id}`, dataStore, err => {
                                if (err) throw err;
                                console.log('File successfully written to disk');
                        }); 
                }
        }
        
        res.render(`${folderView}rss`, {
                layout,
                menuNav,
                category,
                feed,
                article, 
                rss,
        })
});

module.exports = router;
