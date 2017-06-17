const supertest = require('supertest');
const expect    = require('chai').expect;
const CONFIG    = require("../../server/config");
const PORT      = process.env.PORT || CONFIG.server.defaultPort;
const User      = require("../../server/models/user");
const Dish      = require("../../server/models/dish");
const Order     = require("../../server/models/order");

describe("Тестирование /orders: ", () => {

    let testUser = new User({
        name: "test",
        email: "test@test.com",
        balance: 100
    });

    let testOrder = {
        status: "Заказано",
    };

    let server;
    before((done) => {

        Promise.all([
            testUser.save(),
            Dish.findOne().exec()
        ]).then(function (results) {
            testUser = results[0];
            testOrder.user = results[0].id;
            testOrder.dish = results[1].id;
            testOrder.sum = results[1].price;
        });

        require('../../index');
        setTimeout(() => {
            server = supertest.agent(CONFIG.server.host + ":" + PORT);
            done();
        }, 100);
    });

    it("Получение списка всех заказов", function (done) {
        server
            .get("/api/v1/orders")
            .expect(200)
            .expect(res => {
                expect(res.body).to.be.an('array');
                expect(res.body.error).to.be.undefined;
            })
            .end((err, res) => (err) ? done(err) : done());
    });

    var newOrderId;
    it("Успешное добавление заказа", function (done) {
        server
            .post("/api/v1/orders/")
            .send(testOrder)
            .expect(200)
            .expect(res => {
                expect(res.body.error).to.be.undefined;
                expect(res.body._id).to.not.be.undefined;
                expect(res.body.user._id).to.equal(testOrder.user);
                expect(res.body.dish._id).to.equal(testOrder.dish);
                expect(res.body.sum).to.equal(testOrder.sum);
                newOrderId = res.body._id;
            })
            .end((err, res) => (err) ? done(err) : done());
    });

    it("Обновление статуса заказа", function (done) {
        server
            .put("/api/v1/orders/" + newOrderId)
            .send({
                status: "Готовится"
            })
            .expect(200)
            .expect(res => {
                expect(res.body.error).to.be.undefined;
                expect(res.body.status).to.be.equal('Готовится');
            })
            .end((err, res) => (err) ? done(err) : done());
    });

    it("Доставка заказа", function (done) {
        this.timeout(5000);
        server
            .put("/api/v1/orders/" + newOrderId + "/deliver")
            .send({})
            .expect(200)
            .expect(res => {
                expect(res.body.error).to.be.undefined;
                expect(res.body.status).to.be.equal('Подано');
            })
            .end((err, res) => (err) ? done(err) : done());
    });

    it("Успешное удаление заказа", function (done) {
        server
            .del("/api/v1/orders/" + newOrderId)
            .send(testOrder)
            .expect(200)
            .expect(res => {
                expect(res.body.error).to.be.undefined;
                expect(res.body.ok).to.be.equal(1);
            })
            .end((err, res) => (err) ? done(err) : done());
    });

    after(() => {
        Order.remove({_id: newOrderId}).exec();
        User.remove({_id: testOrder.user}).exec();
    });

});
