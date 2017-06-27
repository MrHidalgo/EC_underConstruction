(function (angular) {

    "use strict";


    angular
        .module("Eportfolio.student")
        .controller("student.menu.controller", ["$scope", 'authService', "$state", function ($scope, authService, $state) {
            $scope.isUsStudent = authService.isUsStudent();
            $scope.isPStudent = authService.isPStudent();
            $scope.isCollegeStudent = authService.isCollegeStudent();
            console.log($scope.isCollegeStudent);
            $scope.state = $state;
       
            //$scope.startNewSubmission = startNewSubmission;
            //$scope.storage = $localStorage;

            //function startNewSubmission() {
            //    if (!$state.is("student.submission")) {
            //        $localStorage.submission = null;
            //        $state.go("student.submission");
            //    }
            //};
        }]);

}(angular));