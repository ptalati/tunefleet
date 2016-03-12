(function () {
    var app = angular.module('register-controller', ['angular-loading-bar']);

    app.controller('RegisterController', [
        '$window', '$scope', '$http', '$log', 'baseUrl', '$state',
        function ($window, $scope, $http, $log, baseUrl, $state) {
            $scope.register = {};
            $scope.error = {
                Status: false,
                Message: ''
            };
            $scope.success = {
                Status: false,
                Message: ''
            };
            $scope.ipAddress = '';

            $scope.registerUser = function (register) {
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
                        request: 'registration',
                        callback: 'JSON_CALLBACK',
                        name: register.Name,
                        email: register.Email,
                        password: register.Password,
                        phone: register.Phone,
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
                            Message: 'Registration completed. Please verify your account and login.'
                        };

                        console.log("User created.");
                    }
                }).error(function (data, status, headers, config) {
                    console.log("Error [user create] - " + status);
                });
            };

            $scope.getClientIPAddress = function() {
                $.getJSON("http://jsonip.com/?callback=?", function (data) {
                    console.log(data);
                    $scope.ipAddress = data.ip;
                });
            };

            $scope.getClientIPAddress();
        }
    ]);
})();