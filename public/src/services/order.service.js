angular
    .module("DroneCafeApp")
    .factory("OrderService", function($resource, config){

        return $resource(config.apiUrl + '/orders/:_id/',
            {
                _id: '@_id'
            },
            {
                update: {
                    method: "PUT"
                },
                deliver: {
                    method: "PUT",
                    url: config.apiUrl + '/orders/:_id/deliver'
                }
            });
    });