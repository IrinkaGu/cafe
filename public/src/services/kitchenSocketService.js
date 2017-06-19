angular
    .module("DroneCafeApp")
    .factory("KitchenSocket", function (socketFactory, config) {
        var appIoSocket = io.connect(config.socketUrl + "/kitchen");

        appSocket = socketFactory({
            ioSocket: appIoSocket
        });

        return appSocket;
    });