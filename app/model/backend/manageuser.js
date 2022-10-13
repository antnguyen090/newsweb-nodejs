const mainName = "manageuser"
const schemaUser 	= require(__path_schemas_backend + mainName);
const schemaGroup = require(__path_schemas_backend + "managegroup");

module.exports = {
    saveItems: async (params) =>{
        let data = await schemaUser(params).save(async function(err,room) {
            let userArr = await schemaGroup.findById({_id: room.group})
            userArr.manageuser.push(room)
            await schemaGroup(userArr).save()
         })
        return 
        },
    listItems: async (objWhere,
                    currentPage,
                    totalItemsPerPage,
                    updatedAt
                    ) => {
                        let data = await schemaUser.find(objWhere)
                                                    .skip((currentPage-1) * totalItemsPerPage)
                                                    .limit(totalItemsPerPage)
                                                    .sort(updatedAt)
                        return data;
    },
    deleteItem: async (id) =>{
        let data = await schemaUser.deleteOne({_id: id})
        return
    },
    deleteItemsMulti: async (arrId) =>{
        let data = await schemaUser.deleteMany({_id: {$in: arrId}})
        return
    }
    ,
    changeStatus: async (id, status) =>{
        let data = await schemaUser.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await schemaUser.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
    changeOrdering: async (id, ordering) =>{
            let data = await schemaUser.updateOne({_id: id}, {ordering: ordering})
            return
            },
    getItemByID: async (id) =>{
        let data = await schemaUser.find({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await schemaUser.updateOne({_id: id}, item)
        return
    },
    changeOption: async (id, field, isCheck) =>{
        let data = await schemaUser.updateOne({_id: id}, {[field]: isCheck})
        return
    },
    changeCategory: async (id, newCategory) =>{
        let data = await schemaUser.updateOne({_id: id}, {categoryId: newCategory, category: newCategory})
        return
    },
}


