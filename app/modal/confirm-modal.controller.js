(function (angular) {

    "use strict";

    var controller = function ($scope, $uibModalInstance, options) {

        $scope.ok = ok;
        $scope.cancel = cancel;

        $scope.options = options;

        function ok() {
            $uibModalInstance.close();
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }
    };

    controller.$inject = ["$scope", "$uibModalInstance", "options"];

    angular
        .module("Eportfolio")
        .controller("ConfirmModalController", controller);

}(angular));