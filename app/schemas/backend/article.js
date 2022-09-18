const mongoose = require('mongoose');
const { Schema } = mongoose;
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String, 
    slug: String,
    status: String,
    ordering: Number,
    price: Number,
    thumb: String,
    editordata: String,
    categoryId: String,
    category: { type: Schema.Types.ObjectId, ref: 'category' },
},
{ timestamps: true }
);

module.exports = mongoose.model(databaseConfig.col_article, schema );






