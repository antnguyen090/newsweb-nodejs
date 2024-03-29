const mainName = "contact"
const schemaContact 	= require(__path_schemas_backend + mainName);
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { getForDashboard } = require("./category");

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
            user: `${process.env.EMAIL_SMTP}`, // generated ethereal user
            pass: `${process.env.PASSWORD_SMTP}`, // generated ethereal password
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

        let infoForClient = await transporter.sendMail({
          from: `"7 News" <thinhnguyenxy04@gmail.com>`, // sender address
          to: `${params.email}`, // list of receivers
          subject: `7 News đã nhận thông tin của bạn`, // Subject line
          text: 'Chúng tôi sẽ liên hệ với bạn thời gian sớm nhất', // plain text body
          // html: settingObj.content_email, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      },
      getForDashboard : async ()=>{
        let data = await schemaContact.count({})
        return data
      }
}


