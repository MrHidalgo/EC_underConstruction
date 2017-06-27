(function (angular) {

    "use strict";

    var controller = function ($scope, teacherService) {

        $scope.getDashboardInfo = getDashboardInfo;

        function getDashboardInfo() {
            teacherService
                .getDashboardInfo()
                .then(function (result) {
                    if (!result) {
                        return;
                    }

                    $scope.dashboard = result;
                });
        };
        
        getDashboardInfo();
    };

    controller.$inject = ["$scope", "teacherService"];

    angular
        .module("Eportfolio.teacher")
        .controller("TeacherDashboardController", controller);

}(angular));