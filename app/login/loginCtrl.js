(function () {
    'use strict';
    angular
        .module('Eportfolio')
        .controller('loginCtrl',
            ['$window', '$state', '$scope', '$uibModal', 'authService', '$localStorage', 'dataService', "$location", "Notification", "$sce", "$filter", "$rootScope", "Idle", 
                function loginCtrl($window, $state, $scope, $uibModal, authService, $localStorage, dataService, $location, Notification, $sce, $filter, $rootScope, Idle) {

                    // console.log("loginCtrl");

                    /**
                     * @name loginUser()
                     * @function
                     */
                   
                    function getRequiredMessage(input) {
                        if (input.is("[data-login='loginuser']")) {
                            return $filter('translate')('email_is_required');
                        }
                        if (input.is("[name='Password']")) {
                            return $filter('translate')('password_is_required');
                        }
                    }
                    $scope.loginRules = {
                        rules: {
                            validEmail: function (input) {
                                var ret = true;
                                if (input.is("[data-login='loginuser']")) {
                                    if (!$scope.validateEmail(input.val())) {
                                        ret = false;
                                    }
                                }
                                return ret;
                            },
                        },
                        messages: {
                            validEmail: function () {
                                return $filter('translate')('email_isnot_valid');
                            },
                            required: function (input) {
                                return getRequiredMessage(input);
                            }
                        }
                    };
                 
                 
                    $scope.registerRules = {
                        rules: {
                            validregisterEmail: function (input) {
                                var ret = true;
                                if (input.is("[name='Email']")) {
                                    if (!$scope.validateEmail(input.val())) {
                                        $scope.$$childHead.userForm.Email.$invalid = true;
                                        ret = false;
                                    }
                                }
                                return ret;
                            }
                        },
                        messages: {
                            validregisterEmail: function () {
                                return $filter('translate')('email_isnot_valid');
                            }
                        }
                    };
                    $scope.validateEmail = function (email) {
                        var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                        return re.test(email);
                    }

                    $scope.loginUser = function () {
                        if (!$scope.$$childHead.loginValidator.validate()) {
                            return;
                        }
                        else {


                            $rootScope.loading = true;
                            $scope.credentials = {
                                'userName': $scope.$$childHead.username,
                                'password': $scope.$$childHead.password
                            };

                            authService.login($scope.credentials).then(function (response) {
                                if (response === true) {

                                    authService.checkHome();
                                    $rootScope.loading = false;
                                    Idle.watch();

                                }
                                else {
                                    // console.log(response);
                                    $rootScope.loading = false;
                                    Notification.clearAll();
                                    Notification.error({ message: response.data.error_description });

                                }
                            }, function (response) {
                                $rootScope.loading = false;
                                // console.log(response);
                            });
                        }
                    };

                    $scope.error = "";
                    $scope.emailExist = false;

                    function getSpecialities() {
                        return dataService.getSpecialities().then(function (response) {
                            $scope.specialities = response.data;
                            return $scope.specialities;
                        });
                    }

                    function getLevels() {
                        return dataService.getLevels().then(function (response) {
                            $scope.levelOfTainings = response.data;
                            return $scope.levelOfTainings;
                        });
                    }

                    function getTitles() {
                        dataService.getUserTitles().then(function (data) {
                            $scope.userTitles = data.data;
                            return $scope.userTitles;
                        });
                    }

                    function getHospitals() {
                        return dataService.getHospitals().then(function (response) {
                            $scope.hospitals = response.data;
                            return $scope.hospitals;
                        });
                    }

                    function getCountries() {
                        return dataService.getCountries().then(function (response) {
                            $scope.countries = response.data;
                            return $scope.countries;
                        });
                    }

                    function getLanguages() {
                        return dataService.getLanguages().then(function (response) {
                            $scope.languages = response.data;
                            //console.log(response.data);
                            return $scope.languages;
                        });

                    }
                    function getColleges() {
                        return dataService.getColleges().then(function (response) {
                            $scope.colleges = response.data;
                            return $scope.colleges;
                        });
                    }

                    function init() {
                        getSpecialities();
                        getLevels();
                        getHospitals();
                        getCountries();
                        getTitles();
                        getLanguages();
                        getColleges();
                    }

                    init();

                    /**
                     * After send or register redirect on login tmpl - and active btn
                     *
                     * @name avtiveBtn
                     * @function
                     */
                    var avtiveBtn = function () {
                        $(".forms__btn").removeClass("active");
                        $(".forms__btn").eq(0).addClass("active");
                    };


                    /**
                     * @name updateInstittutionList
                     * @function
                     * @param isSchool
                     */
                    $scope.updateInstittutionList = function (isSchool) {
                        $scope.iSSchoolselected = isSchool;
                    };


                    /**
                     * @name register
                     * @function
                     */
                    $scope.register = function () {
                        $rootScope.loading = true;

                        dataService.registerUser($scope.$$childHead.user).then(function (response) {
                            if (response.data.Success)
                            {
                                $rootScope.loading = false;

                                Notification.success({
                                        message: $filter('translate')(response.data.Message.created)
                                    }
                                );

                                $scope.filePath = "/app/login/loginTMPL.html";

                                avtiveBtn();
                            }
                            else if (response.data.Message.user_exist)
                            {
                                Notification.error({
                                        message: $filter('translate')("email_already_registered")
                                    }
                                );

                                $scope.$$childHead.userForm.Email.$invalid = true;
                                $scope.$$childHead.emailExist = true;
                                $rootScope.loading = false;
                            }
                            else
                            {
                                $rootScope.loading = false;
                            }
                        }, function (error) {
                            return;
                        });
                    };


                    /**
                     * @name sendEmail();
                     * @function
                     */
                    $scope.sendEmail = function () {

                        $rootScope.loading = true;

                        dataService.sendEmailToReset($scope.$$childHead.email).then(function (response) {
                            if (response.data.Success === true) {
                                $rootScope.loading = false;

                                Notification.success({ message: response.data.Message.send });

                                $scope.filePath = $sce.trustAsHtml("/app/login/loginTMPL.html");

                                avtiveBtn();
                                $rootScope.loading = false;
                            } else {
                                $rootScope.loading = false;
                                Notification.clearAll();
                                Notification.error({ message: response.data.Message.user_does_not_exist });
                            }
                        }, function (error) {
                            $rootScope.loading = false;
                        })
                    };

                    /**
                     * @property {string} defaults.login    - /app/login/loginTMPL.html
                     * @property {string} defaults.register - /app/login/registerTMPL.html
                     * @property {string} defaults.forgot   - /app/login/forgotPasswordTMPL.html
                     * @type {string}
                     */
                    $scope.filePath = "/app/login/loginTMPL.html";

                    /**
                     * Return some template for - [login / register / forgot]
                     * @param path {string} [path = filePath]
                     */
                    $scope.navigationTMPL = function (path) {
                        $scope.filePath = $sce.trustAsHtml(path);
                    };
                }]);
})();