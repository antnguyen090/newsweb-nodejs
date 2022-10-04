const mainName = "article"
const schemaArticle 	= require(__path_schemas_backend + mainName);
const schemaCategory = require(__path_schemas_backend + "category");

module.exports = {
    saveItems: async (params) =>{
        let data = await schemaArticle(params).save(async function(err,room) {
            let articleArr = await schemaCategory.findById({_id: room.categoryId})
            articleArr.articles.push(room)
            await schemaCategory(articleArr).save()
         })
        return 
        },
    listItems: async (objWhere,
                    currentPage,
                    totalItemsPerPage,
                    updatedAt
                    ) => {
                        let data = await schemaArticle.find(objWhere)
                                                    .skip((currentPage-1) * totalItemsPerPage)
                                                    .limit(totalItemsPerPage)
                                                    .sort(updatedAt)
                        return data;
    },
    deleteItem: async (id) =>{
        let data = await schemaArticle.deleteOne({_id: id})
        return
    },
    deleteItemsMulti: async (arrId) =>{
        let data = await schemaArticle.deleteMany({_id: {$in: arrId}})
        return
    }
    ,
    changeStatus: async (id, status) =>{
        let data = await schemaArticle.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await schemaArticle.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
    changeOrdering: async (id, ordering) =>{
            let data = await schemaArticle.updateOne({_id: id}, {ordering: ordering})
            return
            },
    getItemByID: async (id) =>{
        let data = await schemaArticle.find({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await schemaArticle.updateOne({_id: id}, item)
        return
    },
    changeOption: async (id, field, isCheck) =>{
        let data = await schemaArticle.updateOne({_id: id}, {[field]: isCheck})
        return
    },
}


