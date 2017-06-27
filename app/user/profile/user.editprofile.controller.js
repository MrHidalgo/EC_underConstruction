(function (angular) {

    // "use strict";


    controller.$inject = ["$scope", "$state", "$stateParams", "appSettings", "$localStorage", "userService", 'dataService', 'authService', "Notification", "$rootScope", "$filter", "$translate"];

    function controller($scope, $state, $stateParams, appSettings, $localStorage, userService, dataService, authService, Notification, $rootScope, $filter, $translate) {

        getProfileDetails();
        function init() {
            // getProfileDetails();
            getSpecialities();
            getHospitals();
            getCountries();
            getLevels();
            getTitles();
            getLanguages();
            getColleges();
        }
       
        $scope.validatorrules = {
            rules: {
                repeatedNewPassword: function (input) {
                    var ret = true;
                    var newPswdConfm = $("input[data-password='newPassword']");

                    if (input.is("[data-password='repeatedNewPassword']")) {
                        // console.log(input.val());

                        ret = input.val() === newPswdConfm.val();
                    }

                    return ret;
                },
                requiredLength: function (input) {
                    var reqLength = true;

                    if (input.is("[data-password='newPassword']") || input.is("[data-password='repeatedNewPassword']")) {
                        var val = input.val();

                        reqLength = val.length >= 6 || val.length === 0;
                    }

                    return reqLength;
                }
            },
            messages: {
                repeatedNewPassword: "Passwords do not match!",
                requiredLength: "Password is to short!"
            }
        };

        // $scope.validator.validate();
        //console.log($scope.validator);
        // $scope.notf1.show("Hi");
        function getSpecialities() {
            dataService.getSpecialities().then(function (data) {
                $scope.specialities = data.data;
                return $scope.specialities;
            });
        }
        function getColleges() {
            dataService.getColleges().then(function (data) {
                $scope.colleges = data.data;
                return $scope.colleges;
            });
        }


        function getProfileDetails() {
            $scope.isInCollege = authService.isCollegeUser();
            userService.profileDetails().then(function (dataResponse) {
                $scope.user = dataResponse.data;
                if ($scope.user != null) {

                    $scope.user.Key = $scope.user.Language.Key;
                    
                    if ($scope.isInCollege) {
                        init();
                    }
                    else {
                        init();
                        initSupervisors();
                    }
                    
                }
            });

        }
        function getLanguages() {
            return dataService.getLanguages().then(function (response) {
                $scope.userLanguages = response.data;
                // console.log(response.data);
                return $scope.userLanguages;
            });

        }
        $scope.years = [{ Id: 1, Name: 1 }, { Id: 2, Name: 2 }, { Id: 3, Name: 3 }, { Id: 4, Name: 4 }, { Id: 5, Name: 5 }];
        $scope.semesters = [{ Id: 1, Name: 1 }, { Id: 2, Name: 2 }];
        function getHospitals() {
            dataService.getHospitals().then(function (data) {
                $scope.hospitals = data.data;
                return $scope.hospitals;
            });
        }

        function getCountries() {
            dataService.getCountries().then(function (data) {
                $scope.countries = data.data;
                return $scope.countries;
            });
        }

        function getLevels() {
            dataService.getLevels().then(function (data) {
                $scope.levelOfTainings = data.data
                return $scope.levelOfTainings;
            });
        }

        function getTitles() {
            dataService.getUserTitles().then(function (data) {
                $scope.userTitles = data.data
                return $scope.userTitles;
            });
        }


        $scope.types = [];
        $scope.type = {};
        $scope.userTypes = $localStorage.userRoles;


        /**
         * @name save
         * @function save()
         */
        $scope.save = function () {
            if ($scope.userForm.$valid && $scope.validator.validate()) {
                $scope.confirmModify.setOptions({ title: $translate.instant("confirm") });
                $scope.confirmModify.center().open();
            } else {
                // Notification.success({ message: $filter('translate')("changed_succesfully") });

                Notification.error(
                    {
                        message: "Please fill in all required fields"
                    }
                );
            }
        };


        $scope.closeConfirm = function () {
            $scope.confirmModify.close();
        };

        $scope.updatePFSupervisors = function (index) {
            for (var select in $scope.supervisors) {
                if ($scope.supervisors[select].Id == index) {
                    $scope.Selecteers = $scope.supervisors[select].Selecteer;
                }
            }
        };

        $scope.updateUsSupervisors = function (index) {
            for (var select in $scope.supervisors) {
                if ($scope.supervisors[select].Id == index) {
                    $scope.USSelecteers = $scope.supervisors[select].Selecteer;
                }
            }
        };

        $scope.closeresponsewind = function () {
            $scope.responseResultwind.close();
        };

        $scope.confirmSave = function () {
            $scope.loading = true;
            console.log($scope.user);
            userService.saveProfile($scope.user).then(function (dataResponse) {
                $scope.confirmModify.close();
                if (dataResponse == "OK") {
                    $scope.loading = false;
                }
                $scope.loading = false;
                authService.updateUser($scope.user);
                $rootScope.userMainInfo();
                setTimeout(function () {
                    $scope.loading = false;
                    $scope.confirmModify.close();
                    $scope.message = "changed succes!";
                    $scope.responseResultwind.center().open();
                    Notification.success({ message: $filter('translate')("changed_succesfully") });
                    authService.goTo('profile', true);
                }, 500);
            },

                function (err) {
                    Notification.error({ message: err.error_description, positionY: 'top', positionX: 'right' });
                    $scope.message = err.error_description;
                    //$scope.loading = false;
                })
        }

        $scope.checknewPwds = function () {
            if ($scope.user !== undefined || $scope.user != null) {


                if ($scope.user.newPassword !== undefined || $scope.user.newPassword != null) {
                    if ($scope.user.repeatedNewPassword !== undefined || $scope.user.repeatedNewPassword != null) {
                        return ($scope.user.newPassword == $scope.user.repeatedNewPassword) ? false : true;
                    }
                }
            } else {
                return false;
            }
        }


        $scope.cancelEdit = function () {
            authService.goTo('profile', true);
        }
        var serviceBase = appSettings.serviceUrl;

        function initSupervisors() {
            $scope.hospitalDataSource = {
                transport: {
                    read: {
                        url: appSettings.serviceUrl + "api/Hospitals/GetHospitals",
                        type: "GET",
                        dataType: "json",
                        cache: false
                    }
                }
            };
            $scope.supervisorDataSource = {
                transport: {
                    read: {
                        url: appSettings.serviceUrl + "api/admin/GetSupervisors",
                        type: "GET",
                        dataType: "json",
                        cache: false
                    }
                }
            };

            $scope.selecteerTeacherDataSource = {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: function () {
                            return appSettings.serviceUrl + "api/admin/GetUsersByRoleName?rolename=" + $scope.userRoleName;
                        }
                    }
                }
            };
            $scope.selecteerHospitalsDataSource = {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: function () {
                            return appSettings.serviceUrl + "api/admin/GetUsersByRoleName?rolename=" + $scope.userRoleName;
                        }
                    }
                }
            };
            $scope.selecteerGroupsDataSource = {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: function () {
                            return appSettings.serviceUrl + "api/admin/GetOtherGroups";
                        }
                    }


                }
            };

            $scope.DataSourceSelecteer = function (rolename) {
                if ($scope.user.PortfolioSupervisorType == 1) {
                    if (rolename == "teacher portfolio") {
                        $scope.userRoleName = "teacher portfolio";
                    }
                    if (rolename == "teacher US") {
                        $scope.userRoleName = "teacher US";
                    }
                    return $scope.selecteerTeacherDataSource;
                }
                if ($scope.user.PortfolioSupervisorType == 3) {
                    return $scope.hospitalDataSource;
                }
                if ($scope.user.PortfolioSupervisorType == 4) {
                    return $scope.selecteerGroupsDataSource;
                }
            };
            $scope.selecteerPtfCbxOptions = {
                dataTextField: "Name",
                dataValueField: "Id",
                dataBound: function (e) {
                    var items = e.sender.dataSource.data();
                    if ($scope.user.PortfolioSupervisorType != undefined) {

                        if ($scope.user.UserSuperVisorId !== undefined && $scope.user.UserSuperVisorId != null) {
                            for (var i = 0, max = items.length; i < max; i++) {
                                elem = items[i];
                                if (elem['Id'] == $scope.user.UserSuperVisorId) {
                                    $scope.selecteerPtfCbx.select(parseInt(i));
                                    $scope.$apply();
                                }
                            }
                        }
                        else {
                            $scope.selecteerPtfCbx.text("");
                        }
                    }
                },
                select: function (e) {
                    var dataItem = this.dataItem(e.item.index());
                    if ($scope.selecteerPtfCbx == e.sender) {
                        $scope.user.UserSuperVisorId = dataItem.Id;
                        $scope.$apply();
                    }
                }
            };

            $scope.portfolioSupDDLOptions = {
                dataSource: $scope.supervisorDataSource,
                dataTextField: "Name",
                dataValueField: "Id",
                template: "{{ dataItem.Name | translate }}",
                dataBound: function (e) {
                    var items = e.sender.dataSource.data();
                    if ($scope.user.PortfolioSupervisorType !== undefined) {
                        for (var i = 0, max = items.length; i < max; i++) {
                            elem = items[i];
                            if (elem['Id'] === $scope.user.PortfolioSupervisorType) {
                                $scope.portfolioSupDDL.select(parseInt(i));
                                $scope.$apply();
                                $scope.selecteerPtfCbx.setDataSource($scope.DataSourceSelecteer("teacher portfolio"));
                            }
                        }
                    } else {
                        this.select(0);
                    }
                },

                select: function (e) {
                    var dataItem = this.dataItem(e.item.index());
                    if ($scope.portfolioSupDDL === e.sender) {
                        $scope.user.PortfolioSupervisorType = dataItem.Id;
                        $scope.user.UserSuperVisorId = null;
                        $scope.$apply();
                        $scope.selecteerPtfCbx.setDataSource($scope.DataSourceSelecteer("teacher portfolio"));
                    }
                }
            };

            $scope.DataSourceUsSelecteer = function (rolename) {

                if ($scope.user.UsSupervisorType == 1) {

                    if (rolename == "teacher US") {
                        $scope.userRoleName = "teacher US";
                    }
                    return $scope.selecteerTeacherDataSource;
                }
                if ($scope.user.UsSupervisorType == 3) {
                    return $scope.hospitalDataSource;
                }
                if ($scope.user.UsSupervisorType == 4) {
                    return $scope.selecteerGroupsDataSource;
                }
            };

            $scope.portfolioUsSupDDLOptions = {
                dataSource: $scope.supervisorDataSource,
                dataTextField: "Name",
                dataValueField: "Id",
                template: "{{ dataItem.Name | translate }}",
                dataBound: function (e) {
                    var items = e.sender.dataSource.data();
                    if ($scope.user.UsSupervisorType != undefined) {
                        for (var i = 0, max = items.length; i < max; i++) {
                            elem = items[i];
                            if (elem['Id'] == $scope.user.UsSupervisorType) {
                                $scope.portfolioUSDDL.select(parseInt(i));
                                $scope.$apply();
                                $scope.SelecteerUSCbx.setDataSource($scope.DataSourceUsSelecteer("teacher US"));
                                $scope.$apply();
                            }
                        }
                    } else {
                        this.select(0);
                    }

                },

                select: function (e) {
                    var dataItem = this.dataItem(e.item.index());
                    if ($scope.portfolioUSDDL == e.sender) {
                        $scope.user.UsSupervisorType = dataItem.Id;
                        $scope.user.USSuperVisorId = null;
                        $scope.$apply();
                        $scope.SelecteerUSCbx.setDataSource($scope.DataSourceUsSelecteer("teacher US"));
                    }
                }
            };

            $scope.USselecteerCbxOptions = {
                dataTextField: "Name",
                dataValueField: "Id",
                highlightFirst: false,
                dataBound: function (e) {
                    var items = e.sender.dataSource.data();
                    if ($scope.user.UsSupervisorType != undefined) {

                        if ($scope.user.USSuperVisorId !== undefined && $scope.user.USSuperVisorId != null) {
                            for (var i = 0, max = items.length; i < max; i++) {
                                elem = items[i];
                                if (elem['Id'] == $scope.user.USSuperVisorId) {
                                    $scope.$apply();
                                    $scope.SelecteerUSCbx.select(parseInt(i));
                                    $scope.$apply();

                                }
                            }
                        }
                        else {
                            $scope.SelecteerUSCbx.text("");
                        }
                    }
                    else {
                        $scope.SelecteerUSCbx.text("");
                    }

                },
                select: function (e) {
                    var dataItem = this.dataItem(e.item.index());
                    if ($scope.SelecteerUSCbx == e.sender) {
                        $scope.user.USSuperVisorId = dataItem.Id;
                        $scope.$apply();
                    }
                }
            };

            $scope.isInUS = function () {

                if (authService.isUsStudent() || authService.isUsTeacher()) {
                    return true;
                }
                else {
                    return false;
                }
            };

            $scope.isInPortfolio = function () {
                if (authService.isPTeacher() || authService.isPStudent()) {
                    return true;
                }
                else {
                    return false;
                }
            };

            $scope.updatelanguage = function () {
                $rootScope.setLanguage($scope.user.Key);
                for (var language in $scope.userLanguages) {
                    if ($scope.userLanguages[language].Key == $scope.user.Key) {
                        $scope.user.Language = $scope.userLanguages[language];
                    }
                }

            }

        }
        // $scope.lol = function () {
        //     console.log(input.is("[data-password='newPassword']"));
        //     console.log(input.is("[data-password='repeatedNewPassword']"));
        // }

    };

    angular
        .module("Eportfolio.teacher")
        .controller("teacher.editprofile.controller", controller);

    angular
        .module("Eportfolio.student")
        .controller("student.editprofile.controller", controller);
}(angular));

