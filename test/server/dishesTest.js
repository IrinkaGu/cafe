const supertest = require('supertest');
const expect    = require('chai').expect;
const CONFIG    = require("../../server/config");
const PORT      = process.env.PORT || CONFIG.server.defaultPort;

describe("Тестирование /dishes: ", () => {

    let server;

    before((done) => {
        require('../../index');
        setTimeout(() => {
            server = supertest.agent(CONFIG.server.host + ":" + PORT);
            done();
        }, 100);
    });

    it("Получение списка всех блюд", function (done) {
        server
            .get("/api/v1/dishes")
            .expect(200)
            .expect(res => {
                    res.body.total && res.body.list && !res.body.error;
            })
            .end((err, res) => (err) ? done(err) : done());
    });
});