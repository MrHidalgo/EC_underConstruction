(function (angular) {

    "use strict";

    var controller = function ($scope, $state, $filter, submissionService, modalService, $localStorage, $translate /*statusMessage*/, $rootScope) {

        $scope.getSubmissionHistory = getSubmissionHistory;
        $scope.remove = remove;
        $scope.filter = filter;
        $scope.loadUltrasoundTypes = loadUltrasoundTypes;
        $scope.reset = reset;
        $scope.clearDateRange = clearDateRange;

        $scope.submissions = [];
        $scope.pageNumber = 1;
        $scope.totalRecords = 0;

        $scope.filterParams = {
            assessmentOptions: [
                { name: "yes", value: true },
                { name: "no", value: false }
            ],
            conclusionOptions: [
                { name: "normal", value: true },
                { name: "not_normal", value: false },
                { name: "none", value: null }
            ],

      
        };

        $scope.dateOptions = {
            minDate: new Date(),
            maxDate: new Date()
        };

        $scope.dateRangePicker = {
            startDate: null,
            endDate: null
        };

        $scope.dateRangeOptions = {
            locale: {
                // cancelLabel: $filter("translate")("clear") // $translate.instant("clear")
            },
            eventHandlers: {
                "apply.daterangepicker": filter,
                "cancel.daterangepicker": clearDateRange
            }
        };

        function getSubmissionHistory() {

            var startDate = angular.isNullOrUndefined($scope.dateRangePicker.startDate)
                ? null
                : $scope.dateRangePicker.startDate.toDate();

            var endDate = angular.isNullOrUndefined($scope.dateRangePicker.endDate)
                ? null
                : $scope.dateRangePicker.endDate.toDate();

            var ultrasoundTypes = angular.isNullOrUndefined($scope.filterParams.ultrasoundTypes)
                ? []
                : _($scope.filterParams.ultrasoundTypes).pluck("Id");
         
            var assessments = angular.isNullOrUndefined($scope.filterParams.assessments)
                ? []
                : _($scope.filterParams.assessments).pluck("value");
          
            var conclusions = angular.isNullOrUndefined($scope.filterParams.conclusions)
                ? []
                : _($scope.filterParams.conclusions).pluck("value");

            $scope.loading = true;
            submissionService
                .list(null, $scope.pageNumber, startDate, endDate, ultrasoundTypes, assessments, conclusions)
                .then(function (result) {
                    $scope.loading = false;
                    if (!result) {
                        return;
                    }

                    $(document).ready(function () {
                        $rootScope.resizeTableUploadHistory();
                    });
                    $(window).on("load resize ready scroll", function () {
                        if($(window).width() > '767') {
                            $rootScope.resizeTableUploadHistory();
                        }
                    });


                    angular.forEach(result.Submissions, function (submission) {
                        submission.UltrasoundTypeNames = [];
                        angular.forEach(submission.UltrasoundTypeName, function (name) {

                            submission.UltrasoundTypeNames.push($translate.instant(name));

                        });
                        submission.UltrasoundTypeName = submission.UltrasoundTypeNames

                    });
                    $scope.submissions = result.Submissions;
                    $scope.pageNumber = result.PageNumber;
                    $scope.totalRecords = result.TotalRecords;
                });
        }



        function remove(submissionId) {
            modalService
                 .confirm({
                     title: $translate.instant("delete_submission"),
                     message: $translate.instant("are_you_sure_you_want_to_delete_the_submission"),
                     okLabel: $translate.instant("yes"),
                     cancelLabel: $translate.instant("no")
                 })
                 .then(function () {
                     $scope.loading = true;
                     submissionService
                         .remove(submissionId)
                         .then(function (response) {
                             $scope.loading = false;
                             if (!response) {
                                 return;
                             }
                             if ($localStorage.submission !== null && $localStorage.submission.Id === submissionId) {
                                 $localStorage.submission = null;
                             }
                             //statusMessage.show({
                             //    text: "submission_deleted",
                             //    type: statusMessage.messageTypes.success,

                             //});

                             getSubmissionHistory();
                         });
                 });
            //  getSubmissionHistory();
        }

        function filter() {
            $scope.pageNumber = 1;
            getSubmissionHistory();
        }

        function loadUltrasoundTypes() {
            submissionService
                .loadUltrasoundTypes()
                .then(function (response) {
                    if (!response) {
                        return;
                    }
                    // console.log(response);
                    $scope.filterParams.ultrasoundTypeOptions = response;
                });
        }

        function reset() {
            $scope.filterParams.ultrasoundTypes = null;
            $scope.filterParams.assessments = null;
            $scope.filterParams.conclusions = null;

            clearDateRange();

            filter();
        }

        function clearDateRange() {
            $scope.dateRangePicker = {
                startDate: null,
                endDate: null
            };

            filter();
        }

        loadUltrasoundTypes();
        getSubmissionHistory($scope.pageNumber);
    };

    controller.$inject = ["$scope", "$state", "$filter", "submissionService", "modalService", "$localStorage", "$translate"/* "statusMessage"*/, "$rootScope"];

    angular
        .module("Eportfolio.teacher")
        .controller("TeacherSubmissionHistoryController", controller);

}(angular));