angular
    .module("DroneCafeApp")
    .component("clientHome", {
        templateUrl: '/src/client/client.html',
        controller: function (AuthService, $sessionStorage, $state, UserService, OrderService, ClientSocket) {
            var vm = this;
            vm.ordersLoading = true;

            if (!AuthService.isAuthorized()) {
                return $state.go("login");
            } else {
                vm.user = $sessionStorage.user;
            }

            vm.logout = function () {
                AuthService.logout();
                return $state.go("login");
            };

            vm.addMoney = function () {
                UserService.addToBalance({_id: vm.user._id, sum: 100}).$promise
                    .then(function (user) {
                        updateBalance(user.balance);
                    });
            };

            vm.cancelOrder = function (order) {
                OrderService.remove({_id: order._id}).$promise
                    .then(function () {
                        removeFromList(order);
                    })
            };

            vm.repeatOrder = function (order) {
                OrderService.remove({_id: order._id}).$promise
                    .then(function () {
                        removeFromList(order);
                        var newOrder = {
                            user: order.user,
                            dish: order.dish._id,
                            status: "Заказано",
                            sum: getSumWithDiscount(order.dish.price)
                        };
                        return OrderService.save(newOrder).$promise;
                    })
                    .then(function (newOrder) {
                        updateBalance(newOrder.user.balance);
                        vm.orderList.unshift(newOrder);
                    })
            };

            vm.enoughMoney = function (sum) {
                return $sessionStorage.user.balance >= getSumWithDiscount(sum);
            };

            vm.getEnoughMoney = function (sum) {
                return getSumWithDiscount(sum) - $sessionStorage.user.balance;
            };

            getOrderList();

            ClientSocket.emit("newConnect", {userID: vm.user._id});

            ClientSocket.on("statusChanged", function (changedOrder) {
                updateOrderList(changedOrder);
            });

            ClientSocket.on("orderDeleted", function (deletedOrder) {
                removeFromList(deletedOrder);
            });

            ClientSocket.on("balanceChanged", function (balance) {
                updateBalance(balance);
            });

            vm.$onDestroy = function () {
                ClientSocket.removeAllListeners();
            };

            function updateBalance(balance) {
                $sessionStorage.user.balance = balance;
            }

            function getSumWithDiscount(price) {
                return price * 0.95;
            }

            function updateOrderList(changedOrder) {
                vm.orderList = vm.orderList.map(function (order) {
                    if (order._id == changedOrder._id)
                        order = changedOrder;
                    return order;
                })
            }

            function getOrderList() {
                OrderService.query({user: vm.user._id}).$promise
                    .then(function (data) {
                        vm.orderList = data;
                        vm.ordersLoading = false;
                    });
            }

            function removeFromList(deletedOrder) {
                vm.orderList = vm.orderList.filter(function (order) {
                    return order._id != deletedOrder._id;
                });
            }
        }
    });