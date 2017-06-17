const express       = require("express");
const bodyParser    = require("body-parser");
const api           = require("./server/api");
const database      = require("./server/db");
const CONFIG        = require("./server/config");
const PORT          = process.env.PORT || CONFIG.server.defaultPort;

const app = express();
database.connect();
const server = app.listen(PORT, function () {
    console.log('Listening on port ' + PORT)
});

app.use(express.static('./public'));
app.use('/scripts', express.static('./node_modules/'));

app.use('/api', api);

app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

app.use((err, req, res, next) => {
    console.dir(err);
    res.status(500).send('500 Server Error');
});

app.on('error', err => console.error(err));

module.exports = app;