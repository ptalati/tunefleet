(function () {
    var app = angular.module('login-controller', ['angular-loading-bar']);

    app.controller('LoginController', [
        '$window', '$scope', '$http', '$log', 'baseUrl', '$state',
        function ($window, $scope, $http, $log, baseUrl, $state) {
            $scope.login = {};
            $scope.error = {
                Status: false,
                Message: ''
            };
            $scope.success = {
                Status: false,
                Message: ''
            };
            $scope.ipAddress = '';

            $scope.loginUser = function (login) {
                $scope.error = {
                    Status: false,
                    Message: ''
                };
                $scope.success = {
                    Status: false,
                    Message: ''
                };

                $http.jsonp(baseUrl, {
                    params: {
                        request: 'login',
                        callback: 'JSON_CALLBACK',
                        email: login.Email,
                        password: login.Password,
                        ip_address: $scope.ipAddress
                    }
                }).success(function (result) {
                    if (typeof result.data.Error !== "undefined") {
                        $scope.error = {
                            Status: true,
                            Message: result.data.Error
                        };
                    } else {
                        $scope.success = {
                            Status: true,
                            Message: 'Welcome to TuneFleet!'
                        };

                        localStorage.setItem("TuneFleetUser", JSON.stringify(result.data));

                        console.log("User created.");

                        $state.go("welcome");
                    }
                }).error(function (data, status, headers, config) {
                    console.log("Error [user create] - " + status);
                });
            };

            $scope.getClientIPAddress = function () {
                $.getJSON("http://jsonip.com/?callback=?", function (data) {
                    console.log(data);
                    $scope.ipAddress = data.ip;
                });
            };

            $scope.loadDefault = function () {
                //localStorage.clear();
                console.log(localStorage);

                if (localStorage.getItem("TuneFleetUser")) {
                    $scope.success = {
                        Status: true,
                        Message: 'You are already logged in!'
                    };

                    $state.go("welcome");
                }
            };

            $scope.getClientIPAddress();
            $scope.loadDefault();
        }
    ]);
})();