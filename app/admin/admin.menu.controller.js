(function (angular) {

    "use strict";

    var controller = function ($scope, $localStorage, $state) {

        $scope.startNewSubmission = startNewSubmission;
        $scope.storage = $localStorage;

        function startNewSubmission() {
            if (!$state.is("admin.userdb")) {
                $localStorage.submission = null;
                $state.go("admin.userdb");
            }
        };
    };

    controller.$inject = ["$scope", "$localStorage", "$state"];

    angular
        .module("Eportfolio.admin")
        .controller("admin.menu.controller", controller);

}(angular));