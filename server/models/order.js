const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let OrderSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    dish: {
        type: Schema.Types.ObjectId,
        ref: 'Dish'
    },
    status: {
        type: String,
        enum: ["Заказано", "Готовится", "Доставляется", "Возникли сложности", "Подано"]
    },
    sum: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    finished: Date,
    cookingStart: Date
});

module.exports = mongoose.model('Order', OrderSchema);