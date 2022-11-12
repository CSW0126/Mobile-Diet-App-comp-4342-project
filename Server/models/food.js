const mongoose = require('mongoose')
const Nutrition = require('./nutrition')
const NutritionModel = mongoose.model('Nutrition', Nutrition)

module.exports = new mongoose.Schema({
    name: {type:String, default: ""},
    imageUrl : {type:String, default: ""},
    unit : {type: String, default: ""},
    quantity :{type: Number, default: 1},
    nutrition: {type: Nutrition, default: ()=>{return new NutritionModel({})}}
})