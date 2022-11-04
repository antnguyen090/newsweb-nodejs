var express = require('express');
var router = express.Router();
var util = require('util')
const mainName = "dashboard"
const pageTitle = `Dashboard Management`
const folderView = __path_views_backend + `/pages/${mainName}/`;
const layout = __path_views_backend + 'backend';
const modelCategory = require(__path_model_backend + 'category');
const modelContact = require(__path_model_backend + 'contact');
const modelRss = require(__path_model_backend + 'rss');



router.get('/', async function(req, res, next) {
  let category = await modelCategory.getForDashboard()
  let contactCount = await modelContact.getForDashboard()
  let rssCount = await modelRss.getForDashboard()

  let categoryCount = category.length
  let articleCount = category
                          .map((item)=>{
                              return item.articles.length
                              })
                          .reduce(
                               (previousValue, currentValue) => previousValue + currentValue,
                              );
  category = [{
    name: "Category",
    count: categoryCount,
    slug: "category",
  },
  {
    name: "Article",
    count: articleCount,
    slug: "article",
  },
  {
    name: "Contact",
    count: contactCount,
    slug: "contact",
  },
  {
    name: "RSS",
    count: rssCount,
    slug: "rss",
  }
]
  res.render(`${folderView}index`, {
    pageTitle,
    category,
    layout,
  });
});

module.exports = router;
