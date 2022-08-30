const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String, 
    slug: String,
    status: String,
    ordering: Number,
    price: Number,
});

module.exports = mongoose.model(databaseConfig.col_product, schema );