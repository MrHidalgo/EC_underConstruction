(function () {
    'use strict';
    angular
        .module('Eportfolio')
        .controller('confirmRegisterCtrl', ['$stateParams', '$scope', '$uibModal', 'dataService', 'authService', '$localStorage', "Notification", "$filter", "$rootScope",
            function ($stateParams, $scope, $uibModal, dataService, authService, $localStorage, Notification, $filter, $rootScope) {
                checkRegistrationToken();
                $scope.loading = false;
                $scope.accepted = false;

                var token = $stateParams.token;


                function checkRegistrationToken() {
                    return dataService.checkRegistrationToken($stateParams.token)
                        .then(function (response) {
                            if (response.data.Success == false) {
                                authService.goTo("login")
                            }
                            $scope.user = response.data;
                            return $scope.user;
                        })
                        .catch(function (error) {
                            return;
                        });
                };

                $scope.checkPwds = function () {
                    if ($scope.user != null || $scope.user != undefined) {

                        return (($scope.user.Password != undefined || $scope.user.Password != null)
                        && ($scope.user.ConfirmPassword != undefined || $scope.user.ConfirmPassword != null)
                        && $scope.user.Password == $scope.user.ConfirmPassword) ? false : true;

                    } else {
                        return false;
                    }
                };

                $scope.confirmRegister = function () {
                    $scope.user.Token = token;
                    $rootScope.loading = true;
                    dataService.confirmRegister($scope.user)
                        .then(function (response) {

                            if (response.data.Success) {
                                Notification.success({message: $filter('translate')(response.data.Message.created)});
                                authService.login({userName: $scope.user.ConfirmedEmail, password: $scope.user.Password}).then(function (response) {
                                    $rootScope.loading = false;
                                    if (response == true) {

                                        authService.checkHome();
                                        authService.goTo("profile", true);
                                    }
                                }, function (response) {
                                    $rootScope.loading = false;
                                })
                            }
                            else {
                                Notification.error({message: $filter('translate')("an_error_occurred_while_processing_the_request")});
                            }
                            $rootScope.loading = false;
                            return;
                        })
                        .catch(function (error) {
                            $rootScope.loading = false;

                        })
                };

                $scope.cancelRegister = function () {
                    $scope.user.Token = token;

                    $scope.opts1 = {
                        backdrop: true,
                        backdropClick: true,
                        dialogFade: false,
                        keyboard: true,
                        templateUrl: 'app/cancel-register/cancel-register.html',
                        controller: 'cancelRegister',
                        resolve: {} // empty storage
                    };

                    var modalInstance = $uibModal.open($scope.opts1);

                    modalInstance.result.then(
                        function () {
                            dataService.cancelRegister($scope.user)
                                .then(function (response) {
                                    if (response.data.Success) {
                                        authService.goTo("login");
                                    }

                                    return;
                                })
                                .catch(function (error) {})
                        },
                        function () {});
                };

                $scope.openConditions = function (str) {

                    var strVar = (str === "conditions") ? "app/conditions/conditions.html" : "app/conditions/privacy.html";

                    $scope.opts2 = {
                        backdrop: true,
                        backdropClick: true,
                        dialogFade: false,
                        keyboard: true,
                        templateUrl: strVar,
                        controller: 'conditions',
                        controllerAs: '$ctrl',
                        resolve: {
                            item: function () {
                                return angular.copy({name: $scope.name});
                            }
                        }
                    };

                    var modalInstance = $uibModal.open($scope.opts2);

                    modalInstance.result.then(function () {}, function () {});
                };

            }]);

})();