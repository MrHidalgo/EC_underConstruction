(function (angular) {

    "use strict";

    var service = function ($uibModal) {

        return {
            alert: alert,
            confirm: confirm
        };

        function alert(options) {
            var modalInstance = $uibModal.open({
                templateUrl: "/app/modal/alert-modal.html",
                controller: "AlertModalController",
                resolve: {
                    options: options
                }
            });

            return modalInstance.result;
        }

        function confirm(options) {
            var modalInstance = $uibModal.open({
                templateUrl: "/app/modal/confirm-modal.html",
                controller: "ConfirmModalController",
                resolve: {
                    options: options
                }
            });

            return modalInstance.result;
        }
    };

    service.$inject = ["$uibModal"];

    angular
        .module("Eportfolio")
        .service("modalService", service);

}(angular));