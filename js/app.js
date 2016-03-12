(function () {
    var app = angular.module('tuneFleetStore', [
        'ngRoute',
        'ngResource',
        'ui.router',
        'angular-loading-bar',
        'ngDialog',
        'ui.datepicker',
        'app.loading',
        'booking-controller',
        'register-controller',
        'login-controller',
        'order-controller'
    ]);

    //app.constant('baseUrl', 'http://localhost:14550/');
    app.constant('baseUrl', 'http://tunefleet.braindemo.com/');
    app.constant('isMobile', navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i));

    app.config([
        'cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = true;
            cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar-spinner"><div class="spinner"><img src="images/logo.png" /> Loading...</div></div>';
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

    app.config([
        '$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider.state("welcome", {
                url: "/welcome",
                templateUrl: 'templates/home.html'
            }).state("login", {
                url: "/login",
                templateUrl: 'templates/login.html',
                controller: 'LoginController'
            }).state("logout", {
                url: "/logout",
                template: 'Logout',
                controller: function ($scope, baseUrl, $state) {
                    $scope.loadDefault = function () {
                        if (localStorage["TuneFleetUser"]) {
                            localStorage.removeItem("TuneFleetUser");
                            
                            $state.go("login");
                        }
                    };

                    $scope.loadDefault();
                }
            }).state("register", {
                url: "/register",
                templateUrl: 'templates/register.html',
                controller: 'RegisterController'
            }).state("help", {
                url: "/help",
                templateUrl: 'templates/help.html'
            }).state("contact", {
                url: "/contact",
                templateUrl: 'templates/contact.html'
            }).state("orders", {
                url: "/orders",
                templateUrl: 'templates/orders.html',
                controller: 'OrderController'
            }).state('booking', {
                url: '/booking',
                templateUrl: 'templates/booking.html',
                controller: 'BookingController'
            }).state('booking.locate', {
                url: '/locate',
                templateUrl: 'templates/booking-locate.html'
            }).state('booking.categories', {
                url: '/categories',
                templateUrl: 'templates/booking-categories.html'
            }).state('booking.vehicle', {
                url: '/categories/:categoryId/vehicle',
                templateUrl: 'templates/booking-vehicle.html'
            }).state('booking.services', {
                url: '/categories/:categoryId/vehicle/:makeId/:modelId/services',
                templateUrl: 'templates/booking-services.html'
            }).state('booking.schedule', {
                url: '/categories/:categoryId/vehicle/:makeId/:modelId/services/:serviceId/schedule',
                templateUrl: 'templates/booking-schedule.html'
            }).state('booking.personal', {
                url: '/categories/:categoryId/vehicle/:makeId/:modelId/services/:serviceId/schedule/:schedule/personal',
                templateUrl: 'templates/booking-personal.html'
            }).state('booking.car', {
                url: '/categories/:categoryId/vehicle/:makeId/:modelId/services/:serviceId/schedule/:schedule/personal/:name/:email/:phone/car',
                templateUrl: 'templates/booking-car.html'
            }).state('booking.payment', {
                url: '/categories/:categoryId/vehicle/:makeId/:modelId/services/:serviceId/schedule/:schedule/personal/:name/:email/:phone/car/:regNumber/:serviceAddress/payment',
                templateUrl: 'templates/booking-payment.html'
            }).state('booking.confirmation', {
                url: '/categories/:categoryId/vehicle/:makeId/:modelId/services/:serviceId/schedule/:schedule/personal/:name/:email/:phone/car/:regNumber/:serviceAddress/payment/:paymentMethod/confirmation',
                templateUrl: 'templates/booking-confirmation.html'
            });

            $urlRouterProvider.otherwise(function ($injector, $location) {
                var $state = $injector.get("$state");

                if (!localStorage["areaId"]) {
                    $state.go('booking.locate');
                } else {
                    $state.go("welcome");
                }
            });
        }
    ]);

    app.controller('TuneFleetController', [
        '$scope', '$http', '$log', '$interval', 'baseUrl', '$location', '$state', '$rootScope',
        function ($scope, $http, $log, $interval, baseUrl, $location, $state, $rootScope) {
            $scope.loggedIn = false;
            $scope.showMenu = true;

            $scope.$on('$locationChangeStart', function (event) {
                console.log('Route changed');
                console.log($location.path());

                if ($location.path() === '/login' || $location.path() === '/register') $scope.showMenu = false;
                else $scope.showMenu = true;

                $scope.fetchUser();
            });

            $scope.getCurrentArea = function () {
                if (typeof localStorage["areaId"] !== "undefined") {
                    return localStorage["areaName"] + ", " + localStorage["cityName"];
                }
            };

            $scope.fetchUser = function () {
                if (localStorage.getItem("TuneFleetUser")) {
                    $scope.loggedIn = true;
                    $scope.user = JSON.parse(localStorage.getItem("TuneFleetUser"))[0];
                    console.log($scope.user.ID);
                }
            };

            $scope.fetchUser();
        }
    ]);
})();
