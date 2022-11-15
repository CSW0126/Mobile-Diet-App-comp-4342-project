const mongoose = require('mongoose')
const Food = require('./food')

module.exports = new mongoose.Schema({
    date : {type:Date , require: true},
    //breakfast, lunch, dinner, other
    type: {type: String, default: ""},
    food: {type:[Food], default:[]}
})