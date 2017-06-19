const singletonSocket = function singletonSocket(server) {

    var io = require("socket.io").listen(server);
    this.kitchen = io.of("/kitchen");
    this.client = io.of("/client");

    this.client.on("connection", function (socket) {
        socket.on("newConnect", function (data) {
            socket.join(data.userID);
        });
    });

    if(singletonSocket.caller != singletonSocket.getInstance){
        throw new Error("This object cannot be instanciated");
    }
}

singletonSocket.instance = null;

singletonSocket.getInstance = function(server){
    if(this.instance === null && server){
        this.instance = new singletonSocket(server);
    }
    return this.instance;
}

module.exports = (server) => singletonSocket.getInstance(server);