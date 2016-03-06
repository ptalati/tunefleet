(function () {
    var app = angular.module('tuneFleetStore', ['angular-loading-bar', 'ngDialog']);

    app.constant('baseUrl', 'http://tunefleet.braindemo.com/');
    app.constant('isMobile', navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i));

    app.config([
        'cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = true;
            cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar-spinner"><div class="spinner"><img src="images/loading.gif" /> Loading...</div></div>';
        }
    ]);

    app.config(['ngDialogProvider', function (ngDialogProvider) {
        ngDialogProvider.setDefaults({
            className: 'ngdialog-theme-default',
            plain: false,
            showClose: true,
            closeByDocument: true,
            closeByEscape: true,
            appendTo: false,
            preCloseCallback: function () {
                console.log('default pre-close callback');
            }
        });
    }]);

    app.config(['$httpProvider', function($httpProvider) {
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
        }
    ]);

    app.controller('TuneFleetController', [
        '$scope', '$http', '$log', '$interval', 'baseUrl', function ($scope, $http, $log, $interval, baseUrl) {
            $scope.Authorized = false;
            $scope.states = [];
            $scope.cities = [];
            $scope.categories = [];
            $scope.services = [];
            $scope.search = {};
            $scope.hideStep = 1;

            $scope.$on('cfpLoadingBar:completed', function () {
                //console.log('Loading Finished');
            });

            $scope.fetchStates = function () {
                $http.jsonp(baseUrl, {
                    params: {
                        'request': 'states',
                        'callback': 'JSON_CALLBACK'
                }}).success(function (result) {
                    $scope.states = result.data;
                    console.log("States loaded - " + $scope.states.length);
                }).error(function (data, status, headers, config) {
                    console.log("Error [states] - " + status);
                });
            };

            $scope.fetchCities = function (stateId) {
                $http.jsonp(baseUrl, {
                    params: {
                        'request': 'cities',
                        'callback': 'JSON_CALLBACK',
                        'state_id': stateId
                    }
                }).success(function (result) {
                    $scope.cities = result.data;
                    console.log("Cities loaded - " + $scope.cities.length);
                }).error(function (data, status, headers, config) {
                    console.log("Error [cities] - " + status);
                });
            };

            $scope.fetchCategories = function () {
                $http.jsonp(baseUrl, {
                    params: {
                        'request': 'categories',
                        'callback': 'JSON_CALLBACK'
                    }
                }).success(function (result) {
                    $scope.categories = result.data;
                    console.log("Categories loaded - " + $scope.categories.length);
                }).error(function (data, status, headers, config) {
                    console.log("Error [categories] - " + status);
                });
            };

            $scope.fetchServices = function (categoryId, cityId) {
                $http.jsonp(baseUrl, {
                    params: {
                        'request': 'services',
                        'callback': 'JSON_CALLBACK',
                        'category_id': categoryId,
                        'city_id': cityId
                    }
                }).success(function (result) {
                    $scope.services = result.data;
                    console.log("Services loaded - " + $scope.services.length);
                }).error(function (data, status, headers, config) {
                    console.log("Error [services] - " + status);
                });
            };

            $scope.fetchStates();

            $scope.$watch('search.state', function (newVal, oldVal) {
                if ($scope.search.state) {
                    if ($scope.search.state.id > 0) {
                        $scope.fetchCities($scope.search.state.id);
                    }

                    console.log("State changed - " + $scope.search.state.id);
                }
            }, true);

            $scope.startSearch = function(search) {
                $scope.hideStep = 2;
                $scope.fetchCategories();
            };

            $scope.showServices = function (category) {
                $scope.hideStep = 3;
                $scope.fetchServices(category.id, $scope.search.city.id);
            };

            $scope.goBack = function(step) {
                $scope.hideStep = step - 1;
                console.log($scope.hideStep);
            };

            $scope.generateUrl = function (icon) {
                console.log(baseUrl + icon);
                return icon;
            };
        }
    ]);
})();
