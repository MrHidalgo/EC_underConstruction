(function (angular) {

    "use strict";

    var controller = function ($scope, $translate, $locale, submissionService) {

        $scope.allMonthNames = $locale.DATETIME_FORMATS.SHORTMONTH;
        $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
        $scope.loadNewer = loadNewer;
        $scope.loadOlder = loadOlder;
        $scope.loadReviewStats = loadReviewStats;

        $scope.referenceDate = new Date();
        $scope.currentDate = new Date();

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


        function loadProgress() {
            loadUltrasoundTypes();
            $scope.labels = loadLabels();

            loadUltrasoundHistory();
        };

        function loadReviewStats() {
            submissionService
                .loadReviewStats()
                .then(function(response) {
                    if (!response) {
                        return;
                    }

                    $scope.stats = response;
                });
        }

        function loadLabels() {
            var currentMonth = $scope.referenceDate.getMonth();
            var currentYear = $scope.referenceDate.getFullYear();
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

        function loadUltrasoundTypes() {

            if ($scope.series && $scope.series.length > 0) {
                return;
            }

            var types = [];

            submissionService
                .loadUltrasoundTypes()
                .then(function (response) {
                    if (!response) {
                        return;
                    }

                    angular.forEach(response, function (type) {
                        types.push($translate.instant(type.Name));
                    });

                    $scope.series = types;
                    $scope.sultrasoundTypes = [];
                    $scope.sultrasoundTypes = response;
                    $scope.stotaluserUS = { Id: 0, Name: "total" };
                    $scope.sultrasoundTypes.push($scope.stotaluserUS);
                });
        };

        function loadUltrasoundHistory() {
            submissionService
                .loadReviewed($scope.referenceDate)
                .then(function (response) {
                    if (!response) {
                        $scope.data = [];
                        return;
                    }

                    $scope.data = response;
                });
        };

        function loadNewer() {
            var currentYear = $scope.referenceDate.getFullYear();
            $scope.referenceDate.setFullYear(currentYear + 1);
            loadProgress();
        }

        function loadOlder() {
            var currentYear = $scope.referenceDate.getFullYear();
            $scope.referenceDate.setFullYear(currentYear - 1);
            loadProgress();
        }

        loadProgress();
        loadReviewStats();


        //from student
        //$scope.allMonthNames = $locale.DATETIME_FORMATS.SHORTMONTH;
        $scope.sloadNewer = sloadNewer;
        $scope.sloadOlder = sloadOlder;

        $scope.snonNormalReferenceDate = new Date();
        $scope.snormalReferenceDate = new Date();
        //$scope.scurrentDate = new Date();

        $scope.sdatasetOverride = [{ yAxisID: 'y-axis-1' }];
   
        $scope.sloadProgress = function (isNormal) {
            //  loadUltrasoundTypes();
            // console.log(isNormal);
            sloadUltrasoundHistory(isNormal);

            if (angular.isNullOrUndefined(isNormal)) {
                $scope.snormaLabels = sloadLabels(true);
                $scope.snonNormalLabels = sloadLabels(false);
                return;
            }

            if (isNormal) {
                $scope.snormaLabels = sloadLabels(true);
            } else {
                $scope.snonNormalLabels = sloadLabels(false);
            }
        };


        //$scope.loadprogress = function (isNormal) {
        //    if (isNormal) {
        //        $scope.series = [];
        //        var arr = [];
        //        var ustypes = [];
        //        arr.push($scope.ultrasoundType.Name);
        //        angular.forEach(arr, function (type) {
        //            ustypes.push(/*$translate.instant(*/type + " (Total)"/*)*/);
        //        });
        //        angular.forEach(arr, function (type) {
        //            ustypes.push(/*$translate.instant("ultrasound_type_" + */type + " (Not Supervised)"/*)*/);
        //        });
        //        $scope.series = ustypes;// ustypes;
        //        console.log($scope.series);
        //        loadProgress(true);
        //    }
        //    else {
        //        $scope.seriesnonNormal = [];
        //        var arr = [];
        //        var ustypes = [];
        //        arr.push($scope.ultrasoundTypeNonNormal.Name);
        //        angular.forEach(arr, function (type) {
        //            ustypes.push(/*$translate.instant("ultrasound_type_" + */type + " (Total)"/*)*/);
        //        });
        //        angular.forEach(arr, function (type) {
        //            ustypes.push(/*$translate.instant("ultrasound_type_" + */type + " (Not Supervised)"/*)*/);
        //        });
        //        $scope.seriesnonNormal = ustypes;// ustypes;
        //        console.log($scope.seriesnonNormal);
        //        loadProgress(false);
        //    }
        //}

        function sloadLabels(isNormal) {
            var referenceDate = isNormal ? $scope.snormalReferenceDate : $scope.snonNormalReferenceDate;
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

        /*$scope.sloadUltrasoundTypes = function () {

            if ($scope.sseries && $scope.sseries.length > 0) {
                return;
            }

            var types = [];

            submissionService
                .loadUltrasoundTypes()
                .then(function (response) {
                    if (!response) {
                        return;
                    }
                    $scope.sultrasoundTypes = [];
                    $scope.sultrasoundTypes = response;
                    $scope.stotaluserUS = { Id: 0, Name: "total" };
                    $scope.sultrasoundTypes.push($scope.stotaluserUS);
                });
        };*/

        function sloadUltrasoundHistory(isNormal) {
            if (angular.isNullOrUndefined(isNormal)) {
                sloadNormalUltrasoundHistory();
                sloadNonNormalUltrasoundHistory();
                return;
            }

            if (isNormal) {
                sloadNormalUltrasoundHistory();
            } else {
                sloadNonNormalUltrasoundHistory();
            }
        };

        function sloadNormalUltrasoundHistory() {
            $scope.sseries = [];
            var arr = [];
            var ustypes = [];
            arr.push($scope.sultrasoundType.Name);
            angular.forEach(arr, function (type) {
                ustypes.push($translate.instant(type) + " (" + $translate.instant("total") + ")");
            });
            angular.forEach(arr, function (type) {
                ustypes.push($translate.instant(type) + " (" + $translate.instant("not_supervised") + ")");
            });


            $scope.sseries = ustypes;// ustypes;
            console.log($scope.sseries);

            $scope.sultrasoundIds = [];
            submissionService
                .loadHistory(true, $scope.snormalReferenceDate, $scope.sultrasoundType.Id, true)
                .then(function (response) {
                    if (!response) {
                        $scope.snormalData = [];
                        return;
                    }
                    $scope.snormalData = [];
                    $scope.snormalData = response;
                    //console.log($scope.normalData);
                });
        }

        function sloadNonNormalUltrasoundHistory() {

            $scope.sseries = [];
            var arr = [];
            var ustypes = [];
            arr.push($scope.sultrasoundType.Name);
            angular.forEach(arr, function (type) {
                ustypes.push($translate.instant(type) + " (" + $translate.instant("total") + ")");
            });
            angular.forEach(arr, function (type) {
                ustypes.push($translate.instant(type) + " (" + $translate.instant("not_supervised") + ")");
            });


            $scope.sseries = ustypes;// ustypes;
            // console.log($scope.series);
            $scope.sultrasoundIds = [];
            $scope.sultrasoundIds.push($scope.sultrasoundType.Id);
            submissionService
                .loadHistory(false, $scope.snonNormalReferenceDate, $scope.sultrasoundIds, true)
                .then(function (response) {
                    if (!response) {
                        $scope.snonNormalData = [];
                        return;
                    }
                    $scope.snonNormalData = [];
                    $scope.snonNormalData = response;
                    //console.log($scope.nonNormalData);
                });
        }

        function sloadNewer(isNormal) {
            var currentYear = isNormal ? $scope.snormalReferenceDate.getFullYear() : $scope.snonNormalReferenceDate.getFullYear();

            if (isNormal) {
                $scope.snormalReferenceDate.setFullYear(currentYear + 1);
            } else {
                $scope.snonNormalReferenceDate.setFullYear(currentYear + 1);
            }

            $scope.sloadProgress(isNormal);
        }

        function sloadOlder(isNormal) {
            var currentYear = isNormal ? $scope.snormalReferenceDate.getFullYear() : $scope.snonNormalReferenceDate.getFullYear();

            if (isNormal) {
                $scope.snormalReferenceDate.setFullYear(currentYear - 1);
            } else {
                $scope.snonNormalReferenceDate.setFullYear(currentYear - 1);
            }

            $scope.sloadProgress(isNormal);
        }


    };
    function createChart() {
        $("#chart").kendoChart({
            dataSource: {
                transport: {
                    read: {
                        url: "../content/dataviz/js/spain-electricity.json",
                        dataType: "json"
                    }
                },
                sort: {
                    field: "year",
                    dir: "asc"
                }
            },
            title: {
                text: "Spain electricity production (GWh)"
            },
            legend: {
                position: "top"
            },
            seriesDefaults: {
                type: "line"
            },
            series: [{
                field: "nuclear",
                name: "Nuclear"
            }, {
                field: "hydro",
                name: "Hydro"
            }, {
                field: "wind",
                name: "Wind"
            }],
            categoryAxis: {
                field: "year",
                labels: {
                    rotation: -90
                },
                crosshair: {
                    visible: true
                }
            },
            valueAxis: {
                type: "log",
                labels: {
                    format: "N0"
                },
                minorGridLines: {
                    visible: true
                }
            },
            tooltip: {
                visible: true,
                shared: true,
                format: "N0"
            }
        });
    }

    $(document).ready(createChart);
    $(document).bind("kendo:skinChange", createChart);
    controller.$inject = ["$scope", "$translate", "$locale", "submissionService"];


    angular
        .module("Eportfolio.teacher")
        .controller("TeacherProgressController", controller);

}(angular));