(function () {
    var app = angular.module('tuneFleetStore', ['angular-loading-bar', 'ngDialog']);

    app.constant('baseUrl', 'http://tunefleet.braindemo.com/');
    app.constant('isMobile', navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i));

    app.config([
        'cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = false;
            //cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar-spinner"><div class="spinner"><img src="images/loading.gif" /> Loading...</div></div>';
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
            $scope.areas = [];
            $scope.categories = [];
            $scope.services = [];
            $scope.booking = {};
            $scope.user = {};
            $scope.hideStep = 1;
            $scope.loaded = false;

            $scope.$on('cfpLoadingBar:completed', function () {
                //console.log('Loading Finished');
                $scope.loaded = true;
            });

            $scope.fetchStates = function () {
                $http.jsonp(baseUrl, {
                    params: {
                        'request': 'states',
                        'callback': 'JSON_CALLBACK'
                }}).success(function (result) {
                    $scope.states = result.data;

                    $scope.user.State = $scope.states[0];

                    if (!localStorage["stateId"]) {
                        $scope.booking.State = $scope.states[0];
                    } else {
                        var stateId = localStorage["stateId"];

                        console.log(stateId);

                        $.each($scope.states, function(index, value) {
                            if (value.ID === stateId) $scope.booking.State = value;
                        });

                        console.log($scope.booking.State);
                    }
                    
                    console.log("States loaded - " + $scope.states.length);
                }).error(function (data, status, headers, config) {
                    console.log("Error [states] - " + status);
                });
            };

            $scope.fetchCities = function(stateId) {
                $http.jsonp(baseUrl, {
                    params: {
                        'request': 'cities',
                        'callback': 'JSON_CALLBACK',
                        'state_id': stateId
                    }
                }).success(function(result) {
                    $scope.cities = result.data;

                    $scope.user.City = $scope.cities[0];
                    
                    if (!localStorage["cityId"]) {
                        $scope.booking.City = $scope.cities[0];
                    } else {
                        var cityId = localStorage["cityId"];

                        console.log(cityId);

                        $.each($scope.cities, function (index, value) {
                            if (value.ID === cityId) $scope.booking.City = value;
                        });

                        console.log($scope.booking.City);
                    }

                    console.log("Cities loaded - " + $scope.cities.length);
                }).error(function(data, status, headers, config) {
                    console.log("Error [cities] - " + status);
                });
            };

            $scope.fetchAreas = function(cityId) {
                $http.jsonp(baseUrl, {
                    params: {
                        'request': 'areas',
                        'callback': 'JSON_CALLBACK',
                        'city_id': cityId
                    }
                }).success(function(result) {
                    $scope.areas = result.data;

                    if (!localStorage["areaId"]) {
                        $scope.booking.Area = $scope.areas[0];
                    } else {
                        var areaId = localStorage["areaId"];

                        console.log(areaId);

                        $.each($scope.areas, function (index, value) {
                            if (value.ID === areaId) $scope.booking.Area = value;
                        });

                        console.log($scope.booking.Area);

                        $scope.startSearch($scope.booking);
                    }

                    console.log("Areas loaded - " + $scope.areas.length);
                }).error(function(data, status, headers, config) {
                    console.log("Error [areas] - " + status);
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
                    $scope.hideStep = 2;
                    console.log("Categories loaded - " + $scope.categories.length);
                }).error(function (data, status, headers, config) {
                    console.log("Error [categories] - " + status);
                });
            };

            $scope.fetchServices = function (categoryId, areaId) {
                $http.jsonp(baseUrl, {
                    params: {
                        'request': 'services',
                        'callback': 'JSON_CALLBACK',
                        'category_id': categoryId,
                        'area_id': areaId
                    }
                }).success(function (result) {
                    $scope.services = result.data;
                    $scope.hideStep = 3;
                    console.log("Services loaded - " + $scope.services.length);
                }).error(function (data, status, headers, config) {
                    console.log("Error [services] - " + status);
                });
            };

            $scope.loadDefault = function() {
                $scope.fetchStates();

                //localStorage = {};

                if (!localStorage) {
                    localStorage = {};
                }
            };

            $scope.$watch('booking.State', function (newVal, oldVal) {
                if ($scope.booking.State) {
                    if ($scope.booking.State.ID > 0) {
                        $scope.fetchCities($scope.booking.State.ID);
                    }

                    console.log("State changed - " + $scope.booking.State.ID);
                }
            }, true);

            $scope.$watch('booking.City', function (newVal, oldVal) {
                if ($scope.booking.City) {
                    if ($scope.booking.City.ID > 0) {
                        $scope.fetchAreas($scope.booking.City.ID);
                    }

                    console.log("City changed - " + $scope.booking.City.ID);
                }
            }, true);

            $scope.startSearch = function (booking) {
                $scope.categories = [];
                $scope.fetchCategories();

                localStorage.stateId = booking.State.ID;
                localStorage.cityId = booking.City.ID;
                localStorage.areaId = booking.Area.ID;
            };

            $scope.showServices = function (category) {
                $scope.services = [];
                $scope.fetchServices(category.ID, $scope.booking.Area.ID);
            };

            $scope.goBack = function(step) {
                $scope.hideStep = step - 1;
                console.log($scope.hideStep);
            };

            $scope.generateUrl = function (icon) {
                console.log(baseUrl + icon);
                return icon;
            };

            $scope.selectService = function (service) {
                $scope.service = service;
                $scope.hideStep = 4;
            };

            $scope.changeLocation = function() {
                $scope.categories = [];
                $scope.services = [];
                $scope.hideStep = 1;
            };

            $scope.updateSchedule = function(schedule) {
                $scope.hideStep = 5;
            };

            $scope.updateUser = function(user) {
                $scope.hideStep = 6;
            };
        }
    ]);
})();
