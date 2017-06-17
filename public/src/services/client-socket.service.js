angular
    .module("DroneCafeApp")
    .factory("ClientSocket", function (socketFactory, config) {
        var appIoSocket = io.connect(config.apiUrl + "/client");

        appSocket = socketFactory({
            ioSocket: appIoSocket
        });

        return appSocket;
    });