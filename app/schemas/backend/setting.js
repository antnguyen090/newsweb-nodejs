const mongoose = require('mongoose');
const { Schema } = mongoose;
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({
    setting: String, 
},
{ timestamps: true }
);

module.exports = mongoose.model(databaseConfig.col_setting, schema );




