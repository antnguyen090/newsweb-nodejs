var express = require('express');
var router = express.Router();

const mainName = "dashboard"
const pageTitle = `Dashboard Management`
const folderView = __path_views_backend + `/pages/${mainName}/`;
const schemaCategory = require(__path_schemas_backend + 'category');
const schemaArticle = require(__path_schemas_backend + 'article');

router.get('/(:status)?', async function(req, res, next) {
  let category = await schemaCategory.find().select('articles')
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
  }]
  res.render(`${folderView}index`, {
    pageTitle,
    category,
  });
});

module.exports = router;
