(function () {
    var app = angular.module('order-controller', ['angular-loading-bar']);

    app.controller('OrderController', [
        '$window', '$scope', '$http', '$log', 'baseUrl', '$state',
        function ($window, $scope, $http, $log, baseUrl, $state) {
            $scope.orders = {};

            $scope.fetchOrders = function () {
                $scope.currentUser = {};

                if (localStorage.getItem("TuneFleetUser")) {
                    $scope.currentUser = JSON.parse(localStorage.getItem("TuneFleetUser"))[0];
                }

                $http.jsonp(baseUrl, {
                    params: {
                        'request': 'orders',
                        'callback': 'JSON_CALLBACK',
                        user_id: $scope.currentUser.ID
                    }
                }).success(function (result) {
                    $scope.orders = result.data;
                    console.log("Orders loaded - " + $scope.orders.length);
                }).error(function (data, status, headers, config) {
                    console.log("Error [orders] - " + status);
                });
            };
            
            $scope.fetchOrders();
        }
    ]);
})();