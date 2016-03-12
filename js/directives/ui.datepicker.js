(function() {
    var app = angular.module('ui.datepicker', []);

    app.directive("datepicker", function () {
        return {
            restrict: "A",
            require: "ngModel",
            link: function(scope, elem, attrs, ngModelCtrl) {
                var updateModel = function(dateText) {
                    scope.$apply(function() {
                        ngModelCtrl.$setViewValue(dateText);
                    });
                };

                var options = {
                	showOn: "button",
                	buttonImageOnly: true,
                	dateFormat: "dd-mm-yy",
                    onSelect: function(dateText) {
                        updateModel(dateText);
                    }
                };

                elem.datepicker(options);
            }
        }
    });
})();