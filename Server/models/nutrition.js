const mongoose = require('mongoose')

module.exports = new mongoose.Schema({
    calories: { type: Number, default: 0.0 },
    cholesterol: { type: Number, default: 0.0 },
    dietary_fiber: { type: Number, default: 0.0 },
    potassium: { type: Number, default: 0.0 },
    total_fat: { type: Number, default: 0.0 },
    protein: { type: Number, default: 0.0 },
    total_carbohydrate: { type: Number, default: 0.0 },
    sugars: { type: Number, default: 0.0 },
    sodium: { type: Number, default: 0.0 },
    saturated_fat: { type: Number, default: 0.0 },
})