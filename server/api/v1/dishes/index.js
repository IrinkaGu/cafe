const express   = require("express");
const dish      = require("../../../../server/controllers/dishController");

const app = module.exports = express();


app.get('/', function(req, res) {
    dish.list(req.query.page, req.query.limit, (err, data) => {
        return (err) ? res.status(500).send(err.message) :
            res.status(200).json(data);
    });
});