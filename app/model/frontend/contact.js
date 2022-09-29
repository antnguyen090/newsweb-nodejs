const schemaContact 	= require(__path_schemas_backend + 'contact');
const nodemailer = require("nodemailer");

module.exports = {
    saveItems: async (params) =>{
        let data = await schemaContact(params).save()
        return
        },          
          
}


