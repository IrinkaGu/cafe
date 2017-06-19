angular
    .module("DroneCafeApp")
    .factory("ClientSocket", function (socketFactory, config) {
        var appIoSocket = io.connect(config.socketUrl + "/client");

        appSocket = socketFactory({
            ioSocket: appIoSocket
        });

        return appSocket;
    });