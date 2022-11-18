const mainName = "category"
const schemaCategory 	= require(__path_schemas_backend + mainName);

module.exports = {
    saveItems: async (params) =>{
            let data = await schemaCategory(params).save()
            return
        },
        listItems: async (objWhere,
            currentPage,
            totalItemsPerPage,
            updatedAt
            ) => {
                let data = await schemaCategory.find(objWhere)
                                            .skip((currentPage-1) * totalItemsPerPage)
                                            .limit(totalItemsPerPage)
                                            .sort(updatedAt)
                return data;
},
    deleteItem: async (id) =>{
        let data = await schemaCategory.deleteOne({_id: id})
        return
    },
    deleteItemsMulti: async (arrId) =>{
        let data = await schemaCategory.deleteMany({_id: {$in: arrId}})
        return
    }
    ,
    changeStatus: async (id, status) =>{
        let data = await schemaCategory.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await schemaCategory.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
    changeOrdering: async (id, ordering) =>{
            let data = await schemaCategory.updateOne({_id: id}, {ordering: ordering})
            return
            },
    getItemByID: async (id) =>{
        let data = await schemaCategory.find({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await schemaCategory.updateOne({_id: id}, item)
        return
    },
    getForDashboard: async ()=>{
        let data = await schemaCategory.find().select('articles')
        return data
    }
}


