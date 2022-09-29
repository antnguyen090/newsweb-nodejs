const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String, 
    email: String,
    subject: String,
    message: String,
    ordering: Number,
    status: String,
},
{ timestamps: true }
);

module.exports = mongoose.model(databaseConfig.col_contact, schema );