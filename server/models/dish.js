const mongoose = require('mongoose');

let DishSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    ingredients: [String],
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Dish', DishSchema);