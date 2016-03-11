(function () {
    var app = angular.module('booking-controller', ['angular-loading-bar']);

    app.controller('BookingController', [
        '$window', '$scope', '$http', '$log', 'baseUrl', '$state',
        function ($window, $scope, $http, $log, baseUrl, $state) {
            $scope.Authorized = false;
            $scope.states = [];
            $scope.cities = [];
            $scope.areas = [];
            $scope.categories = [];
            $scope.services = [];
            $scope.timeSlots = [];
            $scope.makes = [];
            $scope.models = [];
            $scope.booking = {
                Search: {},
                Category: {},
                Service: {},
                Schedule: '',
                Personal: {},
                Car: {}
            };
            $scope.user = {};
            $scope.schedule = {};
            $scope.hideStep = 1;
            $scope.loaded = false;

            $scope.$on('$locationChangeStart', function (event) {
                console.log('Route changed');

                $scope.routeChanges();
            });

            $scope.routeChanges = function() {
                console.log($state.params.categoryId);

                if ($state.params.categoryId) {
                    $.each($scope.categories, function (i, v) {
                        if (v.ID === $state.params.categoryId) {
                            $scope.booking.Category = v;
                            $scope.fetchServices(v.ID, localStorage["areaId"]);
                        }
                    });
                }

                if ($state.params.serviceId) {
                    $.each($scope.services, function (i, v) {
                        if (v.ID === $state.params.serviceId) {
                            $scope.booking.Service = v;
                        }
                    });
                }

                if ($state.params.schedule) {
                    $scope.booking.Schedule = $state.params.schedule;
                }

                if ($state.params.name) {
                    $scope.booking.Personal.Name = $state.params.name;
                }

                if ($state.params.email) {
                    $scope.booking.Personal.Email = $state.params.email;
                }

                if ($state.params.phone) {
                    $scope.booking.Personal.Phone = $state.params.phone;
                }

                if ($state.params.makeId) {
                    $.each($scope.makes, function (i, v) {
                        if (v.ID === $state.params.makeId) {
                            $scope.booking.Car.Make = v;
                            $scope.fetchModels(v.ID);
                        }
                    });
                }

                if ($state.params.regNumber) {
                    $scope.booking.Car.RegNumber = $state.params.regNumber;
                }

                if ($state.params.serviceAddress) {
                    $scope.booking.Car.ServiceAddress = $state.params.serviceAddress;
                }

                if ($state.params.paymentMethod) {
                    $scope.booking.Payment = $state.params.paymentMethod;
                }
            };

            // function to process the form
            $scope.processForm = function () {
                alert('awesome!');
            };

            $scope.$on('cfpLoadingBar:completed', function () {
                //console.log('Loading Finished');
                $scope.loaded = true;
            });

            $scope.fetchStates = function () {
                $http.jsonp(baseUrl, {
                    params: {
                        'request': 'states',
                        'callback': 'JSON_CALLBACK'
                    }
                }).success(function (result) {
                    $scope.states = result.data;

                    if (!localStorage["stateId"]) {
                        $scope.booking.Search.State = $scope.states[0];
                    } else {
                        var stateId = localStorage["stateId"];

                        console.log(stateId);

                        $.each($scope.states, function (index, value) {
                            if (value.ID === stateId) $scope.booking.Search.State = value;
                        });

                        console.log($scope.booking.Search.State);
                    }

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

                    if (!localStorage["cityId"]) {
                        $scope.booking.Search.City = $scope.cities[0];
                    } else {
                        var cityId = localStorage["cityId"];

                        console.log(cityId);

                        $.each($scope.cities, function (index, value) {
                            if (value.ID === cityId) $scope.booking.Search.City = value;
                        });

                        console.log($scope.booking.Search.City);
                    }

                    console.log("Cities loaded - " + $scope.cities.length);
                }).error(function (data, status, headers, config) {
                    console.log("Error [cities] - " + status);
                });
            };

            $scope.fetchAreas = function (cityId) {
                $http.jsonp(baseUrl, {
                    params: {
                        'request': 'areas',
                        'callback': 'JSON_CALLBACK',
                        'city_id': cityId
                    }
                }).success(function (result) {
                    $scope.areas = result.data;

                    if (!localStorage["areaId"]) {
                        $scope.booking.Search.Area = $scope.areas[0];
                    } else {
                        var areaId = localStorage["areaId"];

                        console.log(areaId);

                        $.each($scope.areas, function (index, value) {
                            if (value.ID === areaId) $scope.booking.Search.Area = value;
                        });

                        console.log($scope.booking.Search.Area);

                        $scope.startSearch($scope.booking);
                    }

                    console.log("Areas loaded - " + $scope.areas.length);
                }).error(function (data, status, headers, config) {
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
                    $scope.routeChanges();
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

            $scope.getTimeSlots = function (duration) {
                if (typeof duration === "undefined" || typeof $scope.booking.Schedule.Date === "undefined") return [];

                var scheduleTime = moment($scope.booking.Schedule.Date);
                var startTime = moment(scheduleTime.format('MM-DD-YYYY') + ' 10:00', 'MM-DD-YYYY HH:mm');
                var endTime = moment(scheduleTime.format('MM-DD-YYYY') + ' 18:00', 'MM-DD-YYYY HH:mm').subtract(duration - 60, 'minutes');

                for (var m = startTime; m.isBefore(endTime) ; m.add(60, 'minutes')) {
                    var st = moment(m.format("MM-DD-YYYY hh:mm A"), "MM-DD-YYYY hh:mm A");
                    var et = moment(m.format("MM-DD-YYYY hh:mm A"), "MM-DD-YYYY hh:mm A").add(duration, 'minutes');
                    var item = {
                        Date: m.format("MM-DD-YYYY"),
                        StartTime: st.format("hh:mm A"),
                        EndTime: et.format("hh:mm A"),
                        DateTime: m.format("MM-DD-YYYY hh:mm A"),
                        DateTick: st.format("MMDDYYYYHHmm"),
                        Selected: false,
                        Active: st.isSameOrAfter(moment())
                    };

                    $scope.timeSlots.push(item);
                }

                console.log('Timeslots loaded - ' + $scope.timeSlots.length);
            };

            $scope.fetchMakes = function () {
                $http.jsonp(baseUrl, {
                    params: {
                        'request': 'makes',
                        'callback': 'JSON_CALLBACK'
                    }
                }).success(function (result) {
                    $scope.makes = result.data;
                    $scope.booking.Car.Make = $scope.makes[0];
                    console.log("Makes loaded - " + $scope.makes.length);
                }).error(function (data, status, headers, config) {
                    console.log("Error [makes] - " + status);
                });
            };

            $scope.fetchModels = function (makeId) {
                $http.jsonp(baseUrl, {
                    params: {
                        'request': 'models',
                        'callback': 'JSON_CALLBACK',
                        'make_id': makeId
                    }
                }).success(function (result) {
                    $scope.models = result.data;

                    if ($state.params.modelId) {
                        $.each($scope.models, function (i, v) {
                            if (v.ID === $state.params.modelId) {
                                $scope.booking.Car.Model = v;
                            }
                        });
                    } else {
                        $scope.booking.Car.Model = $scope.models[0];
                    }

                    console.log("Models loaded - " + $scope.models.length);
                }).error(function (data, status, headers, config) {
                    console.log("Error [models] - " + status);
                });
            };

            $scope.loadDefault = function () {
                $scope.fetchStates();
                $scope.fetchMakes();
                $scope.fetchCategories();

                //localStorage = {};

                if (!localStorage) {
                    localStorage = {};
                }
            };

            $scope.$watch('booking.Search.State', function (newVal, oldVal) {
                if ($scope.booking.Search.State) {
                    if ($scope.booking.Search.State.ID > 0) {
                        $scope.fetchCities($scope.booking.Search.State.ID);
                    }

                    console.log("State changed - " + $scope.booking.Search.State.ID);
                }
            }, true);

            $scope.$watch('booking.Search.City', function (newVal, oldVal) {
                if ($scope.booking.Search.City) {
                    if ($scope.booking.Search.City.ID > 0) {
                        $scope.fetchAreas($scope.booking.Search.City.ID);
                    }

                    console.log("City changed - " + $scope.booking.Search.City.ID);
                }
            }, true);

            $scope.$watch('booking.Schedule.Date', function (newVal, oldVal) {
                if ($scope.booking.Schedule.Date) {
                    $scope.timeSlots = [];
                    $scope.getTimeSlots($scope.booking.Service.Duration);

                    console.log("Schedule changed - " + $scope.booking.Schedule.Date);
                }
            }, true);

            $scope.$watch('booking.Car.Make', function (newVal, oldVal) {
                if ($scope.booking.Car) {
                    if ($scope.booking.Car.Make) {
                        if ($scope.booking.Car.Make.ID > 0) {
                            $scope.fetchModels($scope.booking.Car.Make.ID);
                        }

                        console.log("Make changed - " + $scope.booking.Car.Make.ID);
                    }
                }
            }, true);

            $scope.startSearch = function (booking) {
                $scope.categories = [];
                $scope.fetchCategories();

                localStorage.stateId = booking.Search.State.ID;
                localStorage.cityId = booking.Search.City.ID;
                localStorage.areaId = booking.Search.Area.ID;
            };

            $scope.showServices = function (category) {
                $scope.services = [];
                $scope.booking.Category = category;
                $scope.fetchServices(category.ID, $scope.booking.Search.Area.ID);
            };

            $scope.goBack = function (step) {
                $scope.hideStep = step - 1;
                console.log($scope.hideStep);
            };

            $scope.generateUrl = function (icon) {
                console.log(baseUrl + icon);
                return icon;
            };

            $scope.selectService = function (service) {
                $scope.booking.Service = service;
                $scope.hideStep = 4;
            };

            $scope.changeLocation = function () {
                $scope.categories = [];
                $scope.services = [];
                $scope.hideStep = 1;
            };

            $scope.updateSchedule = function (schedule) {
                $scope.hideStep = 5;
            };

            $scope.updateUser = function (user) {
                $scope.hideStep = 6;
            };

            $scope.selectTime = function (schedule) {
                if (!schedule.Active) return;

                $scope.schedule.Timeslot = schedule;

                $.each($scope.timeSlots, function (index, value) {
                    $scope.timeSlots[index].Selected = false;

                    if (value === schedule) {
                        $scope.timeSlots[index].Selected = true;
                    }
                });
            };

            $scope.getDisplayDate = function(schedule) {
                return moment(schedule, "MMDDYYYYHHmm").format("MM-DD-YYYY hh:mm A");
            };

            $scope.getDisplayName = function (payment) {
                if (typeof payment === "undefined") return '';
                
                return payment === "cash_on_complete" ? "Cash On Complete" : "Pre-paid";
            };
        }
    ]);
})();