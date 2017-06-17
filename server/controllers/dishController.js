const Dish = require("../models/dish");

function list(queryPage, queryLimit, done) {
    let page = parseInt(queryPage) || 1;
    let limit = parseInt(queryLimit) || 10;
    let skip = (page - 1) * limit;

    let totalCount = 0;

    Dish.find().count().exec()
        .then(function (total) {
            totalCount = total;
            return Dish.find().limit(limit).skip(skip).exec();
        })
        .then(function (dishes) {
            done(null, {list: dishes, total: totalCount});
        })
        .catch((err) => done(err));
}

module.exports = {
    list
};