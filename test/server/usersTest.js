const supertest = require('supertest');
const expect    = require('chai').expect;
const CONFIG    = require("../../server/config");
const PORT      = process.env.PORT || CONFIG.server.defaultPort;
const User      = require("../../server/models/user");

describe('Тестирование /users', () => {

    let server;

    before((done) => {
        require('../../index');
        setTimeout(() => {
            server = supertest.agent(CONFIG.server.host + ":" + PORT);
            done();
        }, 100);
    });

    const user = {
        'name': 'test',
        'email': 'test@test.com',
        'balance': 100
    };

    let URL = '/api/v1/users/';

    let newUser;
    it('Тест на успешное создание пользователя', function (done) {
        server
            .post(URL).send(user).expect(200).expect(function(res) {
                expect(res.body.name).to.be.equal(user.name);
                expect(res.body.email).to.be.equal(user.email);
                expect(res.body.balance).to.be.equal(user.balance);
                newUser = res.body;
            })
            .end((err, res) => (err) ? done(err) : done());
    });

    it('Тест на неудачное создание пользователя', function (done) {
        let failUser = {
            'name': 'test',
            'balance': 100
        };
        server
            .post(URL).send(failUser).expect(500, {})
            .end((err, res) => (err) ? done(err) : done());
    });

    it('Тест на успешное получение пользователя', function (done) {
        server
            .get(URL + '?email=' + newUser.email).expect(200).expect(function(res) {
                expect(res.body.name).to.be.equal(newUser.name);
                expect(res.body.email).to.be.equal(newUser.email);
                expect(res.body.balance).to.be.equal(newUser.balance)
            })
            .end((err, res) => (err) ? done(err) : done());
    });

    it('Тест пользователь не найден', function (done) {
        server
            .get(URL).expect(404)
            .end((err, res) => (err) ? done(err) : done());
    });

    it('Тест на успешное пополнение баланса', function (done) {

        server
            .put(URL + newUser._id).send({'sum' : 10}).expect(200).expect(function(res) {
                expect(res.body.balance).to.be.equal(user.balance + 10);
            })
            .end((err, res) => (err) ? done(err) : done());
    });

    it('Тест на успешное списание баланса', function (done) {
        server
            .put(URL + newUser._id).send({'sum' : -10}).expect(200).expect(function(res) {
                expect(res.body.balance).to.be.equal(user.balance)
            })
            .end((err, res) => (err) ? done(err) : done());
    });

    it('Тест на неудачное списание баланса - пользователь не найден', function (done) {
        server
            .put(URL).send({'sum' : -10}).expect(404)
            .end((err, res) => (err) ? done(err) : done());
    });

    after(function () {
        User.remove({email: newUser.email}).exec();
    });

});