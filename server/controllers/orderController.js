const Order     = require("../models/order");
const User      = require("../controllers/userController");
const drone     = require("netology-fake-drone-api");
const config    = require("../config");
const socketIO    = require("../socketIO")();

function create(body, done) {
    let order = new Order(body);

    order.save()
        .then(function (order) {
            return Order.populate(order, 'dish');
        })
        .then(function (order) {
            return User.incBalance(order.user, -order.sum);
        })
        .then(function (user) {
            order.user = user;
            socketIO.kitchen.emit("newOrder", order);
            done(null, order);
        })
        .catch(err => done(err));
}

function list(query, done) {
    Order.find(query).sort("-created").populate('dish').populate('user').exec()
        .then(orders => done(null, orders))
        .catch(err => done(err));
}

function deleteOrder(orderId) {
    return Order.remove({_id: orderId}).exec();
}

function remove(id, done) {
    deleteOrder(id)
        .then(result => done(null, result))
        .catch(err => done(err));
}

function autoRemove(order) {
    setTimeout(function () {
        deleteOrder(order._id).then(function () {
            socketIO.client.to(order.user).emit("orderDeleted", order);
        });
    }, 120000);
}

function updateStatus(id, status, done) {
    let orderFinished = false;
    let query = {status: status};

    if (status == "Готовится") {
        query["cookingStart"] = Date.now();
    }

    if (status == "Подано" || status == "Возникли сложности") {
        query["finished"] = Date.now();
        orderFinished = true;
    }

    Order.findOneAndUpdate({"_id": id}, {$set: query}, {new: true}).populate('dish').populate('user').exec()
        .then(function (order) {
            if (!order) {
                done(new Error('Заказ не найден'))
            } else {
                socketIO.client.to(order.user._id).emit("statusChanged", order);
                if (orderFinished) {
                    autoRemove(order);
                }
                done(null, order)
            }
        })
        .catch(err => done(err));
}

function deliver(id, done) {
    Order.findById(id).populate('dish').populate('user').exec()
        .then((order) => {
            let callback = done;
            drone.deliver(order.user, order.dish)
                .then(() => updateStatus(id, "Подано", callback))
                .catch(err => {
                    User.incBalance(order.user._id, order.sum)
                        .then(function (user) {
                            socketIO.client.to(user._id).emit("balanceChanged", user.balance);
                            updateStatus(id, "Возникли сложности", callback);
                        })
                        .catch(err => callback(err))
                });
        })
        .catch(err => done(err));
}

module.exports = {
    create,
    list,
    remove,
    updateStatus,
    deliver
};