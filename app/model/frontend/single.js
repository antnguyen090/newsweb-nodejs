const schemaArticle = require(__path_schemas_backend + 'article');

module.exports = {
    getArticle: async (params) =>{
        let data = await schemaArticle.findOne({slug: params, status: 'active'})
        return data
        },
}