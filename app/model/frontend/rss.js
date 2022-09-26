const schemaMenuBar = require(__path_schemas_backend + 'menubar');
const schemaCategory = require(__path_schemas_backend + 'category');
const schemaRSS = require(__path_schemas_backend + 'rss');


module.exports = {
    getDataCategory : async () =>{
        let data = await schemaRSS.find({status:'active'}).sort({ordering:"asc"})
        return data
    },
    getDataMenuBar : async () =>{
        let data = await schemaMenuBar.find({status:'active'}).sort({ordering:"asc"})
        return data
    },
    getDataRSS : async (id) =>{
        let data = await schemaRSS.findOne({status:'active', _id: id})
        return data
    }
}