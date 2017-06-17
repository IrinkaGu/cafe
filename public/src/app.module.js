angular
    .module("DroneCafeApp", [
        "ui.router",
        "ngResource",
        "ui.materialize",
        "ngMessages",
        "ngStorage",
        "btford.socket-io"
    ])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("user-home", {
                url: "/",
                component: "clientHome"
            })
            .state("login", {
                url: "/login",
                component: "login"
            })
            .state("dish-list", {
                url: "/dishes",
                component: "dishList"
            })
            .state("kitchen", {
                url: "/kitchen",
                component: "kitchen"
            });

        $urlRouterProvider.otherwise('/');
    }])
    .constant('config', {
        apiUrl: 'http://127.0.0.1:3001/api/v1'
    });