const mainName = "manageuser"
const schemaUser 	= require(__path_schemas_backend + mainName);
const schemaGroup = require(__path_schemas_backend + "managegroup");
const OTPHelpers = require(__path_helpers + 'generateotp');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
    getUserByID: async (id) =>{
            let data = await schemaUser.findOne({_id: id})
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
    getItemByUsername: async (obj) =>{
        let data = await schemaUser.findOne(obj)
        return data
    },
    resetPassword: async (username) =>{
        let checkExit = await module.exports.getItemByUsername({username: username}).then(async user=>{
            if(!user){
                return {error: 'Incorrect Email'}
            } else{
                let otp =  await OTPHelpers.generateOTP(4)
                let nowTime = Date.now()
                user.otp.code = otp
                user.otp.timegetotp = nowTime
                await schemaUser.updateOne({username: username}, user).then(async obj=>{
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
                    let infoForClient = await transporter.sendMail({
                      from: `"7 News" <thinhnguyenxy04@gmail.com>`, // sender address
                      to: `${user.username}`, // list of receivers
                      subject: `RESET PASSWORD`, // Subject line
                      text: `OTP is: ${user.otp.code}. Only exits in 5 minutes`, // plain text body
                    });
                })
                  return {success: true, user: user }
            }
        })
        return checkExit
    },
    finalResetPassword: async(username, otp, password)=>{
        let result = await module.exports.getItemByUsername({username: username}).then(async user=>{
            if(!user){
                return {error: "Incorrect Username"}
            } else{
                let nowTime = new Date(Date.now())
                let otpTime = new Date(user.otp.timegetotp)
                console.log(nowTime-otpTime)
                if((nowTime-otpTime) > 300000){
                return {error: "OTP out time"}
                } else{
                    let otpCode = user.otp.code
                    if(otpCode === otp ){
                        const salt = await bcrypt.genSalt(saltRounds);
                        user.password = await bcrypt.hash(password, salt);
                        let data = await schemaUser.updateOne({username: username},user)
                        return {success: 'Changed Password Succesfully'}
                    } else{
                        return {error: 'Incorrect OTP Code'}
                    }
                }
            }
        })
        return result
    }
}



