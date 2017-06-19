angular
    .module("DroneCafeApp")
    .component("kitchen", {
        templateUrl: '/src/kitchen/kitchen.html',
        controller: function (OrderService, KitchenSocket, $q) {
            var vm = this;
            var newOrdersRequest = OrderService.query({status: "Заказано"}).$promise;
            var cookingOrdersRequest = OrderService.query({status: "Готовится"}).$promise;

            vm.loading = true;

            $q.all([newOrdersRequest, cookingOrdersRequest])
                .then(function (response) {
                    vm.newOrderList = response[0];
                    vm.cookingOrderList = response[1];
                    vm.loading = false;
                });

            vm.startCooking = function (order, $index) {
                OrderService.update({_id: order._id, status: "Готовится"}).$promise
                    .then(function (result) {
                        if (result.error)
                            return false;

                        vm.newOrderList.splice($index, 1);
                        vm.cookingOrderList.push(result);
                    });
            };

            vm.endCooking = function (order, $index) {
                OrderService.update({_id: order._id, status: "Доставляется"}).$promise
                    .then(function (result) {
                        if (result.error)
                            return false;

                        vm.cookingOrderList.splice($index, 1);
                        OrderService.deliver({_id: order._id});
                    });
            };

            KitchenSocket.on("newOrder", function (data) {
                vm.newOrderList.unshift(data);
            });

            vm.$onDestroy = function () {
                KitchenSocket.removeAllListeners();
            };
        }
    });