const express   = require("express");
const order     = require("../../../../server/controllers/orderController");

const app = module.exports = express();

app.get('/', function (req, res) {
    order.list(req.query, (err, data) => {
        processRes(res, err, data)
    });
});

app.post('/', function (req, res) {
    order.create(req.body, (err, data) => {
        processRes(res, err, data)
    });
});

app.put('/:id', function (req, res) {
    order.updateStatus(req.params.id, req.body.status, (err, data) => {
        processRes(res, err, data)
    });
});

app.delete('/:id', function (req, res) {
    order.remove(req.params.id, (err, data) => {
        processRes(res, err, data)
    });
});

app.put('/:id/deliver', function (req, res) {
    order.deliver(req.params.id, (err, data) => {
        processRes(res, err, data)
    })
});

const processRes = (res, err, data) => {
    return (err) ? res.status(500).send(err.message) :
        res.status(200).json(data);
}