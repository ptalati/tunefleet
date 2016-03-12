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
                Schedule: {},
                Personal: {},
                Car: {}
            };
            $scope.user = {};
            $scope.schedule = {};
            $scope.currentUser = {};
            $scope.loaded = false;
            $scope.error = {
                Status: false,
                Message: ''
            };
            $scope.success = {
                Status: false,
                Message: ''
            };

            $scope.$on('$locationChangeStart', function (event) {
                console.log('Route changed');

                $scope.routeChanges();
            });

            $scope.routeChanges = function() {
                if ($state.params.categoryId) {
                    $.each($scope.categories, function (i, v) {
                        if (v.ID === $state.params.categoryId) {
                            $scope.booking.Category = v;

                            if ($scope.services.length === 0) $scope.fetchServices(v.ID, localStorage["areaId"]);
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
                    $scope.booking.Schedule.Date = $state.params.schedule;
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

                            if ($scope.models.length === 0) $scope.fetchModels(v.ID);
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
                    console.log("Services loaded - " + $scope.services.length);
                }).error(function (data, status, headers, config) {
                    console.log("Error [services] - " + status);
                });
            };

            $scope.getTimeSlots = function (duration) {
                if (typeof duration === "undefined" || typeof $scope.booking.Schedule.Date === "undefined") return [];

                var scheduleTime = moment($scope.booking.Schedule.Date, "DD-MM-YYYY");
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
                
                if (localStorage.getItem("TuneFleetUser")) {
                    $scope.currentUser = JSON.parse(localStorage.getItem("TuneFleetUser"))[0];
                    $scope.booking.Personal = $scope.currentUser;
                }

                //localStorage = {};

                if (!localStorage) {
                    localStorage = {};
                }
            };

            $scope.$watch('booking.Search.State', function (newVal, oldVal) {
                if ($scope.booking.Search.State) {
                    if ($scope.booking.Search.State.ID > 0) {
                        localStorage.stateId = $scope.booking.Search.State.ID;
                        localStorage.stateName = $scope.booking.Search.State.Name;

                        $scope.fetchCities($scope.booking.Search.State.ID);
                    }

                    console.log("State changed - " + $scope.booking.Search.State.ID);
                }
            }, true);

            $scope.$watch('booking.Search.City', function (newVal, oldVal) {
                if ($scope.booking.Search.City) {
                    if ($scope.booking.Search.City.ID > 0) {
                        localStorage.cityId = $scope.booking.Search.City.ID;
                        localStorage.cityName = $scope.booking.Search.City.Name;

                        $scope.fetchAreas($scope.booking.Search.City.ID);
                    }

                    console.log("City changed - " + $scope.booking.Search.City.ID);
                }
            }, true);

            $scope.$watch('booking.Search.Area', function (newVal, oldVal) {
                if ($scope.booking.Search.Area) {
                    if ($scope.booking.Search.Area.ID > 0) {
                        localStorage.areaId = $scope.booking.Search.Area.ID;
                        localStorage.areaName = $scope.booking.Search.Area.Name;
                    }

                    console.log("Area changed - " + $scope.booking.Search.Area.ID);
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

            $scope.generateUrl = function (icon) {
                console.log(baseUrl + icon);
                return icon;
            };

            $scope.getDisplayDate = function(schedule) {
                return moment(schedule, "MMDDYYYYHHmm").format("MM-DD-YYYY hh:mm A");
            };

            $scope.getDisplayName = function (payment) {
                if (typeof payment === "undefined") return '';
                
                return payment === "cash_on_complete" ? "Cash On Complete" : "Pre-paid";
            };

            $scope.bookOrder = function(booking) {
                $scope.error = {
                    Status: false,
                    Message: ''
                };
                $scope.success = {
                    Status: false,
                    Message: ''
                };

                $scope.currentUser = {};

                if (localStorage.getItem("TuneFleetUser")) {
                    $scope.currentUser = JSON.parse(localStorage.getItem("TuneFleetUser"))[0];
                }

                if (typeof $scope.currentUser.ID === "undefined") {
                    console.log("User not available");

                    $http.jsonp(baseUrl, {
                        params: {
                            request: 'registration',
                            callback: 'JSON_CALLBACK',
                            name: register.Name,
                            email: register.Email,
                            password: register.Password,
                            phone: register.Phone
                        }
                    }).success(function(result) {
                        if (typeof result.data.Error !== "undefined") {
                            $scope.error = {
                                Status: true,
                                Message: result.data.Error
                            };
                        } else {
                            localStorage.setItem("TuneFleetUser", JSON.stringify(result.data));

                            $scope.orderCreate(booking);

                            console.log("User created.");
                        }
                    }).error(function(data, status, headers, config) {
                        console.log("Error [user create] - " + status);
                    });
                } else {
                    console.log("User found");

                    $scope.orderCreate(booking);
                }
            };

            $scope.orderCreate = function(booking) {
                $http.jsonp(baseUrl, {
                    params: {
                        request: 'order_insert',
                        callback: 'JSON_CALLBACK',
                        user_id: $scope.currentUser.ID,
                        model_id: booking.Car.Model.ID,
                        service_id: booking.Service.ID,
                        price: booking.Service.Price,
                        service_address: booking.Car.ServiceAddress,
                        reg_number: booking.Car.RegNumber,
                        payment: booking.Payment,
                        schedule: moment(booking.Schedule.Date, "MMDDYYYYHHmm").format("YYYY-MM-DD hh:mm:ss")
                    }
                }).success(function(result) {
                    $scope.success = {
                        Status: true,
                        Message: 'Order has been created. Thank you for using TuneFleet! Someone from TuneFleet will contact you about your order.'
                    };

                    console.log("Order created.");
                }).error(function(data, status, headers, config) {
                    console.log("Error [order create] - " + status);
                });
            };
        }
    ]);
})();