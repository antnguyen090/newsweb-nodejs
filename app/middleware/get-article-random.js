const ArticleModel 	= require(__path_model_backend + 'article');

module.exports = async(req, res, next) => {
    
    await ArticleModel
        .listItemsFrontend(null, {task: 'items-random'} )
        .then( (items) => { res.locals.itemsRandom = items; });
    next();
}