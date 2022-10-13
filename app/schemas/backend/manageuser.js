const mongoose = require('mongoose');
const { Schema } = mongoose;
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({
    name: String, 
    status: String,
    slug: String,
    ordering: Number,
    content: String,
    avatar: String,
    password: String,
    username: String,
    thumb: String,
    group: String,
    managegroup: { type: Schema.Types.ObjectId, ref: 'managegroup' },
    created: {
        user_id: Number,
        user_name: String,
        time: Date
    },
    modified: {
        user_id: Number,
        user_name: String,
        time: Date
    }
},
{ timestamps: true }
);

module.exports = mongoose.model(databaseConfig.col_manageuser, schema );





