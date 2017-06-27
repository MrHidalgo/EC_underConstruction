(function (angular) {

    "use strict";

    var controller = function ($scope, $state, $uibModal, authService) {
        $scope.isAuth = authService.isAuth();

        if ($scope.isAuth) {
            $scope.user = authService.getUserInfo();
            $scope.usertypes = authService.getHeaderTypesNames();
            $scope.loggedAs = (angular.isNullOrUndefined($scope.user.userFirstName) ? '' : $scope.user.userFirstName + " ")
                + (angular.isNullOrUndefined($scope.user.userMiddleName) ? '' : $scope.user.userMiddleName + " ")
                + (angular.isNullOrUndefined($scope.user.userSecondName) ? '' : $scope.user.userSecondName + ", ")
                + (angular.isNullOrUndefined($scope.usertypes) ? '' : $scope.usertypes);
        } else {
            $scope.loggedAs = null;
            $scope.user = null;
            $scope.usertypes = null;
        }

        $scope.logout = logout;

        function logout() {
            authService.logOut();
        }
    };

    controller.$inject = ["$scope", "$state", "$uibModal", "authService"];

    angular
        .module("Eportfolio")
        .controller("headerCtrl", controller);

}(angular));