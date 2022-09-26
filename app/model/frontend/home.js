const schemaArticle = require(__path_schemas_backend + 'article');

module.exports = {
    listItems: async (objWhere, currentPage, totalItemsPerPage, updatedAt) => {
        let data = await schemaArticle.find(objWhere)
                                        .skip((currentPage - 1) * totalItemsPerPage)
                                        .limit(totalItemsPerPage)
                                        .sort(updatedAt)
        return data;
    },
    listItemsHome: async (objWhere, updatedAt) => {
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
