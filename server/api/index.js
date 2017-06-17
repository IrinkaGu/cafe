const express       = require("express");
const bodyParser    = require("body-parser");
const app = module.exports = express();

app.use(bodyParser.urlencoded({"extended": true}));
app.use(bodyParser.json());

app.use('/v1', require('./v1'));