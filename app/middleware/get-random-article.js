const modelArticle = require(__path_model_backend + 'article');

module.exports = async(req, res, next) => {
    
    await modelArticle
        .listItemsRandom()
        .then( (items) => { res.locals.itemsRandom = items; });
    next();
}