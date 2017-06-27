(function (angular) {

    "use strict";


    controller.$inject = ["$scope", "$state", "$stateParams", "$localStorage", "userService", 'authService'];

    function controller($scope, $state, $stateParams, $localStorage, userService, authService) {

        $scope.isResponseTrue = false;

        $scope.fillProfile = function () {
            userService.profileDetails().then(function (dataResponse) {
                $scope.userProfileInfo = "";

                $scope.isResponseTrue = true;
                $scope.languageName = "";
                $scope.user = dataResponse.data;
                $scope.isInCollege = authService.isCollegeUser();
                $scope.user.EndSubscription = kendo.toString(kendo.parseDate($scope.user.EndSubscription, "dd.MM.yyyy"), "dd/MM/yyyy");
                $scope.user.StartSubscription = kendo.toString(kendo.parseDate($scope.user.StartSubscription, "dd.MM.yyyy"), "dd/MM/yyyy");
                var langKeys = $scope.user.Language.Key;

                $scope.languageName = (langKeys === "en") ? "english" :  "nederlands";

                if  (!angular.IsNullOrEmpty($scope.user.MiddleName)) {
                    $scope.userProfileInfo = $scope.user.Name + " " + $scope.user.MiddleName + " " + $scope.user.Surname;
                } else {
                    $scope.userProfileInfo = $scope.user.Name + " " + $scope.user.Surname;
                }
            });
        };

        $scope.editProfile = function () {
            authService.goTo('editprofile', true);
        };
    }

    angular
        .module("Eportfolio.student")
        .controller("student.profile.controller", controller);
    angular
        .module("Eportfolio.teacher")
        .controller("teacher.profile.controller", controller);

}(angular));