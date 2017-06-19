angular
    .module("DroneCafeApp")
    .factory("UserService", function ($resource, config) {

        return $resource(config.apiUrl + '/users/:_id/',
            {
                _id: '@_id'
            },
            {
                addToBalance: {
                    method: 'PUT',
                    url: config.apiUrl + '/users/:_id'
                }
            });
    });