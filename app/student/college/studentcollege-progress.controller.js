(function (angular) {

    "use strict";

    var controller = function ($scope, $locale, $translate, submissionService) {

        $scope.allMonthNames = $locale.DATETIME_FORMATS.SHORTMONTH;
        $scope.loadNewer = loadNewer;
        $scope.loadOlder = loadOlder;
        // $scope.totaluserUS = { Id: 0, Name: "total" };

        $scope.nonNormalReferenceDate = new Date();
        $scope.normalReferenceDate = new Date();
        $scope.currentDate = new Date();

        $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
        $scope.options = {
            scales: {
                yAxes: [
                  {
                      id: 'y-axis-1',
                      type: 'linear',
                      display: true,
                      position: 'left'
                  }
                ]
            },
            legend: { display: true }
        };

        $scope.loadProgress = function (isNormal) {

            loadUltrasoundHistory(isNormal);

            if (angular.isNullOrUndefined(isNormal)) {
                $scope.normaLabels = loadLabels(true);
                $scope.nonNormalLabels = loadLabels(false);
                return;
            }

            if (isNormal) {
                $scope.normaLabels = loadLabels(true);
            } else {
                $scope.nonNormalLabels = loadLabels(false);
            }
        };


        $scope.loadprogress = function (isNormal) {

            if (isNormal) {
                $scope.series = [];
                var arr = [];
                var ustypes = [];
                arr.push($scope.ultrasoundType.Name);
                angular.forEach(arr, function (type) {
                    ustypes.push(/*$translate.instant(*/type + " (Total)"/*)*/);
                });
                angular.forEach(arr, function (type) {
                    ustypes.push(/*$translate.instant("ultrasound_type_" + */type + " (Not Supervised)"/*)*/);
                });


                $scope.series = ustypes;// ustypes;
                console.log($scope.series);
                loadProgress(true);

            }
            else {
                $scope.seriesnonNormal = [];
                var arr = [];
                var ustypes = [];
                arr.push($scope.ultrasoundTypeNonNormal.Name);
                angular.forEach(arr, function (type) {
                    ustypes.push(/*$translate.instant("ultrasound_type_" + */type + " (Total)"/*)*/);
                });
                angular.forEach(arr, function (type) {
                    ustypes.push(/*$translate.instant("ultrasound_type_" + */type + " (Not Supervised)"/*)*/);
                });
                $scope.seriesnonNormal = ustypes;// ustypes;
                console.log($scope.seriesnonNormal);
                loadProgress(false);
            }
        }

        function loadLabels(isNormal) {
            var referenceDate = isNormal ? $scope.normalReferenceDate : $scope.nonNormalReferenceDate;
            var currentMonth = referenceDate.getMonth();
            var currentYear = referenceDate.getFullYear();
            var previousYear = currentYear - 1;
            var prevousYearMonths = currentMonth === 11 ? [] : $scope.allMonthNames.slice(currentMonth + 1);
            var currentYearMonths = $scope.allMonthNames.slice(0, currentMonth + 1);

            var previousYearMonthLabels = _(prevousYearMonths).map(function (monthLabel) {
                return monthLabel + " " + previousYear;
            });

            var currentYearMonthLabels = _(currentYearMonths).map(function (monthLabel) {
                return monthLabel + " " + currentYear;
            });

            return previousYearMonthLabels.concat(currentYearMonthLabels);
        };

        $scope.loadRegistrationTypes = function () {

            if ($scope.series && $scope.series.length > 0) {
                return;
            }

            var types = [];

            submissionService
                .loadRegistrationTypes()
                .then(function (response) {
                    if (!response) {
                        return;
                    }
                    $scope.registrationTypes = [];
                    $scope.registrationTypes = response;
                    $scope.totaluserUS = { Id: 0, Name: "Total" };
                    $scope.registrationTypes.push($scope.totaluserUS);
                    $scope.registrationType = $scope.toObject($scope.registrationTypes);
                    console.log($scope.registrationType)
                    $scope.loadProgress();

                });


        };
        $scope.toObject = function (registrationTypes) {
            var rv = {};
            for (var i = 0; i < registrationTypes.length; ++i)
                if (registrationTypes[i].Id == 0) {
                    rv = registrationTypes[i];
                }
            return rv;
        };

        function loadUltrasoundHistory(isNormal) {
            if (angular.isNullOrUndefined(isNormal)) {
                loadNormalUltrasoundHistory();
                //loadNonNormalUltrasoundHistory();
                return;
            }

            if (isNormal) {
                loadNormalUltrasoundHistory();
            } else {
               // loadNonNormalUltrasoundHistory();
            }
        };

        function loadNormalUltrasoundHistory() {
            $scope.series = [];
            var arr = [];
            var ustypes = [];
            arr.push($scope.registrationType.Name);
            angular.forEach(arr, function (type) {
                ustypes.push(/*$translate.instant*/(type) + " (" + $translate.instant("Total") + ")");
            });
            angular.forEach(arr, function (type) {
                ustypes.push(/*$translate.instant*/(type) + " (" + $translate.instant("Not Supervised") + ")");
            });


            $scope.series = ustypes;// ustypes;
            console.log($scope.series);

            $scope.ultrasoundIds = [];
            submissionService
                .loadStudentCollegeProgress($scope.normalReferenceDate, $scope.registrationType.Id)
                .then(function (response) {
                    if (!response) {
                        $scope.normalData = [];
                        return;
                    }
                    $scope.normalData = [];
                    $scope.normalData = response;
                    //console.log($scope.normalData);
                });
        }

        function loadNonNormalUltrasoundHistory() {

            $scope.series = [];
            var arr = [];
            var ustypes = [];
            arr.push($scope.ultrasoundType.Name);
            angular.forEach(arr, function (type) {
                ustypes.push($translate.instant(type) + " (" + $translate.instant("total") + ")");
            });
            angular.forEach(arr, function (type) {
                ustypes.push($translate.instant(type) + " (" + $translate.instant("not_supervised") + ")");
            });


            $scope.series = ustypes;// ustypes;
            // console.log($scope.series);
            $scope.ultrasoundIds = [];
            $scope.ultrasoundIds.push($scope.ultrasoundType.Id);
            submissionService
                .loadHistory(false, $scope.nonNormalReferenceDate, $scope.ultrasoundIds)
                .then(function (response) {
                    if (!response) {
                        $scope.nonNormalData = [];
                        return;
                    }
                    $scope.nonNormalData = [];
                    $scope.nonNormalData = response;
                    //console.log($scope.nonNormalData);
                });
        }

        function loadNewer(isNormal) {
            var currentYear = isNormal ? $scope.normalReferenceDate.getFullYear() : $scope.nonNormalReferenceDate.getFullYear();

            if (isNormal) {
                $scope.normalReferenceDate.setFullYear(currentYear + 1);
            } else {
                $scope.nonNormalReferenceDate.setFullYear(currentYear + 1);
            }

            $scope.loadProgress(isNormal);
        }

        function loadOlder(isNormal) {
            var currentYear = isNormal ? $scope.normalReferenceDate.getFullYear() : $scope.nonNormalReferenceDate.getFullYear();

            if (isNormal) {
                $scope.normalReferenceDate.setFullYear(currentYear - 1);
            } else {
                $scope.nonNormalReferenceDate.setFullYear(currentYear - 1);
            }

            $scope.loadProgress(isNormal);
        }
    };

    controller.$inject = ["$scope", "$locale", "$translate", "submissionService"];

    angular
        .module("Eportfolio.student")
        .controller("studentcollege-progress.controller", controller);

}(angular));