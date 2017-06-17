const User = require("../models/user");

function create(data, done) {
    new User(data).save()
        .then(res => done(null, res))
        .catch(error => done(error));
}

function getByEmail(email, done) {
    User.findOne({email: email}).exec()
        .then(user => done(null, user))
        .catch(error => done(error));
}

function incBalance(id, sum) {
    return User.findOneAndUpdate({"_id": id}, {$inc: {"balance": sum}}, {new: true}).exec();
}

function updateBalance(id, sum, done) {
    incBalance(id, sum)
        .then(user => done(null, user))
        .catch(error => done(error));
}

module.exports = {
    create,
    getByEmail,
    updateBalance,
    incBalance
};