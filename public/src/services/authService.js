angular
    .module("DroneCafeApp")
    .factory("AuthService", function (UserService, $sessionStorage) {
        var service = {};

        service.login = function (credentials) {
            return UserService.get({email: credentials.email}).$promise.then(function (user) {
                if (user._id) {
                    $sessionStorage.user = user;
                    return user;
                }

                credentials.balance = 100;
                return UserService.save(credentials).$promise.then(function (user) {
                    $sessionStorage.user = user;
                    return user;
                });
            });
        };

        service.logout = function () {
            delete $sessionStorage.user;
        };

        service.isAuthorized = function () {
            return !!$sessionStorage.user;
        };

        service.getUserData = function () {
            return $sessionStorage.user;
        };

        return service;
    });