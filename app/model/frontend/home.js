const schemaArticle = require(__path_schemas_backend + 'article');

module.exports = {
    listItems: async (objWhere, limit , updatedAt) => {
        let data = await schemaArticle.find(objWhere)
                                        .limit(limit)
                                        .sort(updatedAt)
        return data;
    },
    listItemsHome: async (objWhere, updatedAt, limit) => {
        let data = await schemaArticle.find({$or: objWhere})
                                        .limit(20)
                                        .sort(updatedAt)
        return data;
    },
    totalItems: async (objWhere) => {
        let data = await schemaArticle.count(objWhere).then((count) => {
                    return count;
        })
        return data
    },
}
