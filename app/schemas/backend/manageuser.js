const mongoose = require('mongoose');
const { Schema } = mongoose;
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({
    name: String, 
    status: String,
    slug: String,
    ordering: Number,
    description: String,
    avatar: String,
    password:  {
        type: String,
    },
    username: String,
    thumb: String,
    group: String,
    otp: {
        code: {
            type: String,
            default: null},
        timegetotp: { 
            type: Date,
            default: null},
    },
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

schema.pre('save', async function save(next) {
    if (!this.isModified('password')) return next();
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      this.password = await bcrypt.hash(this.password, salt);
      return next();
    } catch (err) {
      return next(err);
    }
});

module.exports = mongoose.model(databaseConfig.col_manageuser, schema );





