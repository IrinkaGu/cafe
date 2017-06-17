const config    = require("./config");
const mongoose  = require("mongoose");
var mongoUri    = process.env.MONGODB_URI || config.db.url;

module.exports.connect = function () {
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoUri, function (error) {
        if (error) {
            console.error("Could not connect to MongoDB");
            console.log(error);
        }
    });
};

module.exports.disconnect = function () {
    mongoose.disconnect(function (error) {
        if (error) {
            console.log(error);
        }
    });
};