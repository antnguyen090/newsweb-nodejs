const mainName = "article"
const schemaArticle 	= require(__path_schemas_backend + mainName);
const schemaCategory = require(__path_schemas_backend + "category");
require('mongoose-query-random');

module.exports = {
    saveItems: async (params) =>{
        let data = await schemaArticle(params).save(async function(err,room) {
            let articleArr = await schemaCategory.findById({_id: room.category})
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
        let removeObject = await schemaArticle.findOne({_id: id}).then( async (obj)=>{
            let articleArr = await schemaCategory.findById({_id: obj.category})
            articleArr.articles.remove(id)
            await schemaCategory(articleArr).save()
            let data = await schemaArticle.deleteOne({_id: id})
        })
        return
    },
    deleteItemsMulti: async (arrId) =>{
        await Promise.all(arrId.map(async (id,index) => {
            let removeObject = await schemaArticle.findOne({_id: id}).then( async (obj)=>{
            let articleArr = await schemaCategory.findById({_id: obj.category})
            articleArr.articles.remove(id)
            await schemaCategory(articleArr).save()
            let data = await schemaArticle.deleteOne({_id: id})
            })
             }))
            .catch((error) => {
                console.error(error.message)
                return Promise.reject()
            });
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
    changeCategory: async (id, newCategory) =>{
        let updateOldCategory = schemaArticle.findOne({_id: id}).then(async item=>{
            await schemaCategory.findOne({_id: item.category}).then( async oldItem=>{
                oldItem.articles.remove(id)
                await schemaCategory(oldItem).save()
            })
            await schemaCategory.findOne({_id: newCategory}).then( async newItem=>{
                newItem.articles.push(id)
                await schemaCategory(newItem).save()
            })
        })
        let data = await schemaArticle.updateOne({_id: id}, {categoryId: newCategory, category: newCategory})
        return
    },
    listItemsRandom: async() =>{
        return schemaArticle.aggregate([
            { $match: { status: 'active' }},
        ]); 
    },
    clearall: async ()=>{
       await schemaCategory.updateMany({ status : 'active'}, { articles: [] });
       return
    },
    findall: async ()=>{
        let data = await schemaArticle.find({})
        let arr  = []
        await Promise.all(data.map(async (obj,index) => {
                // let articleArr = await schemaCategory.findOne({_id: obj.categoryId})
                // await articleArr.articles.push(obj)
                // let dataa = await schemaCategory(articleArr).save()
                // return dataa
                if(obj.categoryId === '632976b66095a9135928f897'){
                    arr.push(obj.id)
                }
             }))
            .catch((error) => {
                console.error(error)
                return Promise.reject()
            });
            console.log(arr)
        let save = await schemaCategory.updateOne({_id: '632976b66095a9135928f897'},{articles: arr})
        return arr
    }
}


