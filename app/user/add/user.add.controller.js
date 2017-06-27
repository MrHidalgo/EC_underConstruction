(function (angular) {

    "use strict";

    controller.$inject =  ["$scope", "$state", "$stateParams", "$localStorage", "authService"];

    function controller($scope, $state, $stateParams, $localStorage, authService) {
        $scope.isPStudent = authService.isPStudent();
        $scope.openKpb = function () {
            authService.goTo('add.kpb', true);
           
        }

        $scope.openProcedureForm = function () {
            $state.go("student.procedure");
        }
      
    }

    angular
    .module("Eportfolio.student")
    .controller("student.add.controller", controller);

    angular
        .module("Eportfolio.teacher")
        .controller("teacher.add.controller", controller);
}(angular));