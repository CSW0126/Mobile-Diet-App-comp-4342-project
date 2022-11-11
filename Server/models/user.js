const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    deviceID : {type: String , require: true, unique: true},
    username : {type: String, require: true},
    activate : {type:Boolean, default: true}
})

module.exports = mongoose.model('User', UserSchema)