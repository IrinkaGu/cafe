angular
    .module("DroneCafeApp")
    .component("dishList", {
        templateUrl: '/src/dish/dish.html',
        controller: function (DishService, AuthService, $state, $sessionStorage, OrderService) {
            var vm = this;
            var user;

            vm.limit = 12;

            if (!AuthService.isAuthorized()) {
                return $state.go("login");
            } else {
                user = $sessionStorage.user;
            }

            vm.getDishList = function (page) {
                vm.loading = true;
                DishService.query({limit: vm.limit, page: page}).$promise
                    .then(function (data) {
                        vm.list = data.list;
                        vm.totalCount = data.total;
                        vm.loading = false;
                    });
            };

            vm.formatList = function (list) {
                return list.join(", ");
            };

            vm.isAvailable = function (dishPrice) {
                return user.balance >= dishPrice;
            };

            vm.getEnoughMoney = function (dishPrice) {
                return dishPrice - user.balance;
            };

            vm.buy = function (dish) {
                OrderService.save({user: user._id, dish: dish._id, status: "Заказано", sum: dish.price}).$promise
                    .then(function (data) {
                        $sessionStorage.user.balance = data.user.balance;
                        $state.go("user-home");
                    });
            };

            vm.getDishList();
        }
    });
