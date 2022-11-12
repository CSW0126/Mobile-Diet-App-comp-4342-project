const mongoose = require('mongoose');
const daymeal = require('./daymeal');

const UserSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    username : {type: String, require: true, unique: true},
    password : {type: String, require: true},

    // "M" or "F"
    gender: { type: String, default: "M" },
    height: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    age: {type: Number, default: 0},
    // 1 = keep weight, 2 = increase weight, 3 = lose weight
    plan: {type: Number, default: 1},
    dietRecord: {type: [daymeal], default: []}
})

module.exports = mongoose.model('User', UserSchema)