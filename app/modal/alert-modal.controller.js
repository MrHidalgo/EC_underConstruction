(function (angular) {

    "use strict";

    var controller = function ($scope, $uibModalInstance, options) {

        $scope.options = options;

        $scope.ok = function() {
            $uibModalInstance.close();
        };

    };

    controller.$inject = ["$scope", "$uibModalInstance", "options"];

    angular
        .module("Eportfolio")
        .controller("AlertModalController", controller);

}(angular));