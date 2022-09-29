const mainName = "contact"
const schemaContact 	= require(__path_schemas_backend + mainName);
const nodemailer = require("nodemailer");

module.exports = {
    saveItems: async (params) =>{
            let data = await schemaContact(params).save()
            return
        },
        listItems: async (objWhere,
            currentPage,
            totalItemsPerPage,
            updatedAt
            ) => {
                let data = await schemaContact.find(objWhere)
                                            .skip((currentPage-1) * totalItemsPerPage)
                                            .limit(totalItemsPerPage)
                                            .sort(updatedAt)
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
        let data = await schemaContact.deleteOne({_id: id})
        return
    },
    deleteItemsMulti: async (arrId) =>{
        let data = await schemaContact.deleteMany({_id: {$in: arrId}})
        return
    }
    ,
    changeStatus: async (id, status) =>{
        let data = await schemaContact.updateOne({_id: id}, {status: status})
        return
        },
    changeStatusItemsMulti: async (arrId, status) =>{
        let data = await schemaContact.updateMany({_id: {$in: arrId}}, {status: status})

    }
    ,
    changeOrdering: async (id, ordering) =>{
            let data = await schemaContact.updateOne({_id: id}, {ordering: ordering})
            return
            },
    getItemByID: async (id) =>{
        let data = await schemaContact.find({_id: id})
        return data
        },
    editItem: async (id, item) =>{
        let data = await schemaContact.updateOne({_id: id}, item)
        return
    },
    changePrice: async (id, price) =>{
        let data = await schemaContact.updateOne({_id: id}, {price: price})
        return
    },
    mainMail: async function (params) {
        console.log(params)
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();
      
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          service: "gmail" ,
        //   host: "smtp.gmail.com",
        //   port: 587,
        //   secure: false, // true for 465, false for other ports
          auth: {
            user: "thinhnguyenxy04@gmail.com", // generated ethereal user
            pass: "mupjqdrcyjxuvqpr", // generated ethereal password
          },
        });
      
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: `"${params.name}" <${params.email}>`, // sender address
          to: "thinhnguyenxy04@gmail.com", // list of receivers
          subject: `${params.subject}`, // Subject line
          text: `${params.message}`, // plain text body
        //   html: "<b>Hello world?</b>", // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      }
}


