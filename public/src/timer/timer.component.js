angular
    .module("DroneCafeApp")
    .component("timer", {
        template: '{{$ctrl.timer}}',
        bindings: {
            start: '<',
            finish: '<'
        },
        controller: function ($interval) {
            var vm = this;
            var stopTime;

            function updateTime() {
                var currentDate, timerDate;
                if (vm.start){
                    currentDate = (vm.finish) ? new Date(vm.finish) : new Date();
                    currentDate.setHours(currentDate.getHours(), currentDate.getMinutes() + currentDate.getTimezoneOffset());
                    timerDate = new Date(currentDate.getTime() - Date.parse(vm.start));
                    vm.timer = timerDate.toTimeString().substring(0, 8);
                }
            }

            stopTime = $interval(updateTime, 1000);

            vm.$onInit = function(){
                updateTime();
            };

            vm.$onChanges = function(){
                if (vm.finish){
                    $interval.cancel(stopTime);
                    updateTime();
                }
            };

            vm.$onDestroy = function(){
                $interval.cancel(stopTime);
            };
        }
    });