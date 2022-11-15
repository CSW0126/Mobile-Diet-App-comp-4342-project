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
    // "Keep" ,"Increase" , "Lose" 
    purpose: {type: String, default: ""},
    // 0 = 0.25, 1 = 0.5, 2 = 1  (i.e purpose + 0.25kg/week)
    plan : {type: Number, default: 1},
    dietRecord: {type: [daymeal], default: []},
    // 0 = need to do tutorial, 1 = skip tutorial
    tutPass: {type: Number, default: 0}
})

module.exports = mongoose.model('User', UserSchema)