(function (angular) {

    "use strict";
    angular
        .module("Eportfolio.student")
        .controller("studentcollege-search.controller", ["$scope", "$filter", "submittedFileService", "submissionService", "$uibModal", "Notification",
     function studentSearchController($scope, $filter, submittedFileService, submissionService, $uibModal, Notification) {

         $scope.reviewedByMe = true;
         $scope.pageNumber = 1;
         $scope.totalRecords = 0;

         $scope.search = search;
         $scope.loadUltrasoundTypes = loadUltrasoundTypes;
         $scope.loadViews = loadViews;
         $scope.loadIndications = loadIndications;
         $scope.loadFingingOptions = loadFingingOptions;
         $scope.updateOptions = updateOptions;
         $scope.newSearch = newSearch;
         $scope.showFileDetails = showFileDetails;
         $scope.backToList = backToList;
         $scope.clearSearchCriteria = clearSearchCriteria;
         $scope.clearDateRange = clearDateRange;
         $scope.enlarge = enlarge;

         $scope.dateRangePicker = {
             startDate: null,
             endDate: null
         };
         $scope.dateRegisterPicker = {
             startRegisterDate: null,
             endRegisterDate: null

         }
         $scope.dateregisterOptions = {
             maxDate: new Date(),
             showWeeks: true
         }

         $scope.dateOptions = {
             maxDate: new Date(),
             showWeeks: true
         };

         $scope.dateRangeOptions = {
             locale: {
                 cancelLabel: "clear"// $translate.instant("clear")
             },
             eventHandlers: {
                 "cancel.daterangepicker": clearDateRange
             }
         };

         function search() {

             var selectedIndications = _($scope.indications).filter({ selected: true });
             var selectedIndicationIds = !selectedIndications || selectedIndications.length === 0
                 ? []
                 : _(selectedIndications).pluck("Id"); //todo

             var selectedFindings = _.chain($scope.findings)
                 .filter(function (finding) {
                     return finding.selectedOptionId !== 0;
                 })
                 .map(function (finding) {
                     return { FindingId: finding.id, SelectedFindingOptionId: finding.selectedOptionId };
                 })
                 .valueOf();

             var startDate = angular.isNullOrUndefined($scope.dateRangePicker.startDate)
                 ? null
                 : $scope.dateRangePicker.startDate.toDate();

             var endDate = angular.isNullOrUndefined($scope.dateRangePicker.endDate)
                 ? null
                 : $scope.dateRangePicker.endDate.toDate();

             var startRegisterDate = angular.isNullOrUndefined($scope.dateRegisterPicker.startRegisterDate)
                ? null
                : $scope.dateRangePicker.startDate.toDate();

             var endRegisterDate = angular.isNullOrUndefined($scope.dateRegisterPicker.endRegisterDate)
                 ? null
                 : $scope.dateRangePicker.endDate.toDate();
             var registerTypeId = !angular.equals($scope.registrationType, {}) && !angular.isNullOrUndefined($scope.registrationType) ? $scope.registrationType.Id : undefined;
             submittedFileService
                 .searchCollegeUploads(registerTypeId, startDate, endDate, startRegisterDate, endRegisterDate, $scope.reviewedByMe, $scope.pageNumber, true, false)
                 .then(function (response) {
                     if (!response) {
                         return;
                     }

                     if (response.Files.length === 0) {
                         Notification.clearAll();
                         Notification.info({ message: "No matches found!" });
                         return;
                     }

                     $scope.files = response.Files;
                     $scope.totalRecords = response.TotalRecords;
                     $scope.pageNumber = response.PageNumber;
                 });
         }

         function loadUltrasoundTypes() {
             submissionService
                 .loadRegistrationTypes()
                 .then(function (response) {
                     if (!response) {
                         return;
                     }
                     // console.log(response);
                     $scope.registrationTypes = response;
                 });
         }

         function loadViews() {
             var ustypes = [];
             ustypes.push($scope.ultrasoundTypeId);
             submissionService
                 .loadViews(ustypes)
                 .then(function (response) {
                     if (!response) {
                         return;
                     }

                     $scope.views = response;
                 });
         }

         function loadIndications() {
             // console.log($scope.ultrasoundType);
             var ustypes = [];
             if ($scope.ultrasoundType === undefined || $scope.ultrasoundType == null) {
                 ustypes = [];
             }
             else {
                 ustypes.push($scope.ultrasoundType);
             }

             submissionService
                 .loadIndications(null, ustypes)
                 .then(function (response) {
                     if (!response) {
                         return;
                     }
                     // console.log(response);
                     $scope.indications = response;
                 });
         }

         function loadFingingOptions() {

             $scope.findings = [];

             if (angular.isNullUndefinedOrWhitespace($scope.viewId)) {
                 return;
             }

             submissionService
                 .loadFindings(null, $scope.viewId)
                 .then(function (response) {
                     if (!response) {
                         return;
                     }
                     // console.log(response);
                     $scope.findings = response;
                 });
         }

         function updateOptions() {
             loadViews();
             loadIndications();
         }

         function newSearch() {
             $scope.files = null;
             $scope.pageNumber = 1;
             $scope.totalRecords = 0;

             // clearSearchCriteria();
         }

         function showFileDetails(file) {
             $scope.selectedFile = file;
         }

         function backToList() {
             $scope.selectedFile = null;
         }

         function clearSearchCriteria() {
             $scope.ultrasoundType = null;
             $scope.viewId = null;
             $scope.startDate = null;
             $scope.endDate = null;
             $scope.reviewedByMe = true;
             $scope.findings = [];

             angular.forEach($scope.indications,
                 function (indication) {
                     indication.selected = false;
                 });

             clearDateRange();

             loadUltrasoundTypes();
             loadViews();
             loadIndications();
         }

         function clearDateRange() {
             $scope.dateRangePicker = {
                 startDate: null,
                 endDate: null
             };
         }

         function enlarge(filepath) {
             var isVideoFile = angular.isVideoFile(filepath);


             $uibModal.open({
                 templateUrl: "/app/common/media-popup.html",
                 controller: "MediaPopupController",
                 resolve: {
                     file: function () {
                         return {
                             filepath: filepath,
                             isVideo: isVideoFile
                         }
                     }
                 }
             });
         }

         loadUltrasoundTypes();
         loadViews();
         loadIndications();
     }]);

    // controller.$inject = [];



}(angular));