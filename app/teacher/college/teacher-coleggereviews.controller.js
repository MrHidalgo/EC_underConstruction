(function (angular) {

    "use strict";

    var controller = function ($scope, $state, teacherService, $translate) {

        $scope.submissions = [];
        $scope.pageNumber = 1;
        $scope.totalRecords = 0;
        $scope.showReviewed = false;

        $scope.getSubmissions = getSubmissions;

        function getSubmissions() {
            teacherService
                .getCollegeReviews($scope.showReviewed, $scope.pageNumber, null, null, null, null, [true, false])
                .then(function (result) {
                    if (!result) {
                        return;
                    }
                    angular.forEach(result.Submissions, function (submission) {
                        submission.UltrasoundTypeNames = [];
                        angular.forEach(submission.UltrasoundTypeName, function (name) {

                            submission.UltrasoundTypeNames.push($translate.instant(name));

                        });
                        submission.UltrasoundTypeName = submission.UltrasoundTypeNames;

                    });
                    $scope.submissions = result.Submissions;
                    $scope.pageNumber = result.PageNumber;
                    $scope.totalRecords = result.TotalRecords;
                });
        };

        getSubmissions($scope.pageNumber);
    };

    controller.$inject = ["$scope", "$state", "teacherService", "$translate"];

    angular
        .module("Eportfolio.teacher")
        .controller("teacher-coleggereviews.controller", controller);

}(angular));