const mainName = "menubar"
const schemaMenuBar 	= require(__path_schemas_backend + mainName);

module.exports = {
    saveItems: async (params) =>{
            let data = await schemaMenuBar(params).save()
            return
        },
    listItems: async (objWhere,
            currentPage,
            totalItemsPerPage,
            updatedAt
            ) => {
                let data = await schemaMenuBar.find(objWhere)
                                            .skip((currentPage-1) * totalItemsPerPage)
                                            .limit(totalItemsPerPage)
                                            .sort(updatedAt)
                return data;
        },
    deleteItem: async (id) =>{
        let data = await schemaMenuBar.deleteOne({_id: id})
        return
    },
    deleteItemsMulti: async (arrId) =>{
        let data = await schemaMenuBar.deleteMany({_id: {$in: arrId}})
        return
    }
    ,
    changeStatus: async (id, status) =>{
        let data = await schemaMenuBar.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await schemaMenuBar.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
    changeOrdering: async (id, ordering) =>{
            let data = await schemaMenuBar.updateOne({_id: id}, {ordering: ordering})
            return
            },
    getItemByID: async (id) =>{
        let data = await schemaMenuBar.find({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await schemaMenuBar.updateOne({_id: id}, item)
        return
    },
    changeParent: async (id, newParent) =>{
        let data = await schemaMenuBar.updateOne({_id: id}, {parentMenu: newParent})
        return
    },
}


