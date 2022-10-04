const mainName = "wheather"
const schemaWheather 	= require(__path_schemas_backend + mainName);

module.exports = {
    saveItems: async (params) =>{
            let data = await schemaWheather(params).save()
            return
        },
        listItems: async (objWhere,
            currentPage,
            totalItemsPerPage,
            updatedAt
            ) => {
                let data = await schemaWheather.find(objWhere)
                                            .skip((currentPage-1) * totalItemsPerPage)
                                            .limit(totalItemsPerPage)
                                            .sort(updatedAt)
                return data;
},
    deleteItem: async (id) =>{
        let data = await schemaWheather.deleteOne({_id: id})
        return
    },
    deleteItemsMulti: async (arrId) =>{
        let data = await schemaWheather.deleteMany({_id: {$in: arrId}})
        return
    }
    ,
    changeStatus: async (id, status) =>{
        let data = await schemaWheather.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await schemaWheather.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
    changeOrdering: async (id, ordering) =>{
            let data = await schemaWheather.updateOne({_id: id}, {ordering: ordering})
            return
            },
    getItemByID: async (id) =>{
        let data = await schemaWheather.find({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await schemaWheather.updateOne({_id: id}, item)
        return
    },
}


