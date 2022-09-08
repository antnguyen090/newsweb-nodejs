const itemsModel 	= require(__path_schemas + 'category');

module.exports = {
    saveItems: async (params) =>{
        let data = await itemsModel(params).save()
        return
        },
    listItems: async (number) =>{
        let data = await itemsModel.find().where('age').gt(number).sort({ age: 'asc' }).limit(2);
        return data;
    },
    showError:  (error) =>{
        let html = ""
        error.forEach((obj) =>{
            html += `
            <div class="alert alert-warning alert-dismissible">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                <h5><i class="icon fas fa-exclamation-triangle"></i> Alert!</h5>
                ${obj.msg}
            </div>
            `
        })
       return html
    },
    showSuccess: (params) => {
    if(params === undefined) return;
    return `<div class="alert alert-success alert-dismissible">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
    <h5><i class="icon fas fa-check"></i> Alert!</h5>
    ${params}
    </div>`
    },

    deleteItem: async (id) =>{
        let data = await itemsModel.deleteOne({_id: id})
        return
    },
    deleteItemsMulti: async (arrId) =>{
        let data = await itemsModel.deleteMany({_id: {$in: arrId}})
        return
    }
    ,
    changeStatus: async (id, status) =>{
        let data = await itemsModel.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await itemsModel.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
    changeOrdering: async (id, ordering) =>{
            let data = await itemsModel.updateOne({_id: id}, {ordering: ordering})
            return
            },
    getItemByID: async (id) =>{
        let data = await itemsModel.find({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await itemsModel.updateOne({_id: id}, item)
        return
    },
    changePrice: async (id, price) =>{
        let data = await itemsModel.updateOne({_id: id}, {price: price})
        return
    },
}


