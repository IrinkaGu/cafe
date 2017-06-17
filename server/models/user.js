const mongoose = require('mongoose');

let UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('User', UserSchema);
