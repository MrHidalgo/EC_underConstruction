(function () {
    'use strict';

    angular
        .module('Eportfolio')
        .controller('changePasswordCtrl', ['$scope', '$stateParams', 'dataService', 'authService', '$uibModal', function ($scope, $stateParams, dataService, authService, $uibModal) {

            $scope.loading = false;

            checkToken();

            function checkToken() {
                return dataService.checkResetToken($stateParams.token)
                       .then(function (response) {
                           if (response.data.Success == false) {
                               authService.goTo("login")
                           }
                           $scope.user = response.data;
                           return $scope.user;
                       })
                       .catch(function (error) {
                           // console.error(error);
                           return;
                       });
            };

            $scope.sendPassword = function () {
                $scope.user.Token = $stateParams.token;
                $scope.loading = true;
                return dataService.changePassword($scope.user)
                    .then(function (response) {

                        //todo login
                        // console.log(response.data.Message);

                        if (response.data.Success == true) {
                            authService.login({ userName: $scope.user.Email, password: $scope.user.NewPassword }).then(function (response) {
                                $scope.loading = false;
                                if (response == true) {
                                    authService.goTo("profile", true);
                                }
                            }, function (response) {
                                // console.log(response)
                                $scope.loading = false;
                            })

                        }
                        $scope.loading = false;
                        return;
                    })
                    .catch(function (error) {
                        $scope.loading = false;
                        // console.log(error);
                        //message if user exist
                    })
            };

            $scope.checkPwds = function () {
                if ($scope.user != null || $scope.user != undefined) {

                    return (($scope.user.NewPassword != undefined || $scope.user.NewPassword != null)
                        && ($scope.user.ConfirmedPassword != undefined || $scope.user.ConfirmedPassword != null)
                        && $scope.user.NewPassword == $scope.user.ConfirmedPassword) ? false : true;

                } else {
                    return false;
                }
            };

            //
            // $scope.contactUs = function () {
            //
            //     var modalInstance = $uibModal.open({
            //         templateUrl: "/app/home/contact-us.html",
            //         controller: "ContactUsCtrl"
            //     });
            // }
        }]);
})();
