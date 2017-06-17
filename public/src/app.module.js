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
        apiUrl: 'https://localhost:3001/api/v1'
    });