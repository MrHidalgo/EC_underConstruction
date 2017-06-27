(function (angular) {

    "use strict";

    var controller = function ($scope, authService, $state) {
        $scope.isUsTeacher = authService.isUsTeacher();
        $scope.state = $state;
        $scope.isPTeacher = authService.isPTeacher();
        $scope.isPTeacher = authService.isPTeacher();
        $scope.isteacherCollege = authService.isCollegeTeacher();
       
    };

    controller.$inject = ["$scope", "authService", "$state"];

    angular
        .module("Eportfolio.teacher")
        .controller("TeacherMenuController", controller);

}(angular));