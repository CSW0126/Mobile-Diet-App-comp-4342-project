const mongoose = require('mongoose')
const Food = require('./food')

module.exports = new mongoose.Schema({
    date : {type:Date , require: true},
    food: {type:[Food], default:[]}
})