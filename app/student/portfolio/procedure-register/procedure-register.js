(function (angular) {

    "use strict";

    var controller = function ($scope, $locale, $translate, formService, $filter, Notification) {
        $scope.format = 'dd/MM/yyyy';
        $scope.popDateDateDateOptions = {
            format: $scope.format,
            culture: $translate.use() === 'nl' ? "nl-NL" : "en-US",
            value: new Date(),
            mask: '00/00/0000',
            max: new Date()
        };
        $scope.other = { Id: 0, Name: "other" };

        $scope.ProcedureForm = {
            ProcedureDate: new Date(),
            ProcedureType: null,
            CompletionLevel: null,
            Supervisor: null,
            Complication: null,
            Severity: null,
            ComplicationDescription: null,
            Intervention: null,
            InterventionDescription: null,

        };
        $scope.isvalidProcedureType = function () {
            if (angular.isNullUndefinedOrWhitespace($scope.ProcedureForm.ProcedureType)) {

                return true;
            }
            else {
                return false;
            }
        }
        function init() {

            getCleanFormModel();
            getProcedureTypes();
            getCompletionLevels();
            getSupervisors();
            getSeverities();

        }
        $scope.curDate = new Date();
        function getCleanFormModel() {
            $scope.ProcedureForm.ProcedureDate = $scope.curDate;
            $scope.ProcedureForm.ProcedureType = null;
            $scope.ProcedureForm.CompletionLevel = null;
            $scope.ProcedureForm.Supervisor = null;
            $scope.ProcedureForm.Complication = null;
            $scope.ProcedureForm.Severity = null;
            $scope.ProcedureForm.ComplicationDescription = null;
            $scope.ProcedureForm.Intervention = null;
            $scope.ProcedureForm.InterventionDescription = null;
            return $scope.ProcedureForm.ProcedureDate;
        }


        $scope.onConplicationChanged = function () {
            if ($scope.ProcedureForm.Complication) {
                $scope.ProcedureForm.Severity = null,
                $scope.ProcedureForm.ComplicationDescription = null,
                $scope.ProcedureForm.Intervention = null,
                $scope.ProcedureForm.InterventionDescription = null;
            }
        }

        $scope.onInterventionChanged = function () {
            if ($scope.ProcedureForm.Intervention) {
                $scope.ProcedureForm.InterventionDescription = null;
            }
        }

        //api calls
        $scope.save = function () {
            var data = {
                ProcedureDate: $scope.ProcedureForm.ProcedureDate,
                ProcedureType: $scope.ProcedureForm.ProcedureType.Id,
                CompletionLevel: $scope.ProcedureForm.CompletionLevel,
                Supervisor: $scope.ProcedureForm.Supervisor,
                Complication: $scope.ProcedureForm.Complication,
                Severity: $scope.ProcedureForm.Severity,
                ComplicationDescription: $scope.ProcedureForm.ComplicationDescription,
                Intervention: $scope.ProcedureForm.Intervention,
                InterventionDescription: $scope.ProcedureForm.InterventionDescription,
            };

            $scope.loading = true;
            formService.postProcedureForm(data).then(function (response) {
                if (!response.data) {
                    $scope.loading = false;
                    console.error(response);

                } else {
                    $scope.loading = false;
                    Notification.clearAll();
                    Notification.success({ message: $filter('translate')("form_created") });
                    getCleanFormModel();

                }
            });
        }


        function getProcedureTypes() {
            $scope.loading = true;
            formService.getProcedureTypes().then(function (response) {
                $scope.ProcedureTypes = response.data;
                //angular.forEach($scope.ProcedureTypes, function (val, key) {
                //    $scope.ProcedureTypes[key].Name = $filter("translate")(val.Name);
                //});
                console.log($scope.ProcedureTypes);
                $scope.KOptsTypes = {
                    dataSource: $scope.ProcedureTypes,
                    dataTextField: "Name",
                    dataValueField: "Id",
                    //template: "{{ dataItem.Name | translate }}",
                    valueTemplate: "{{dataItem.Name | translate }}",
                    filter: "contains"
                }
                $scope.loading = false;

            });
        }

        function getCompletionLevels() {
            $scope.loading = true;
            formService.getCompletionLevels().then(function (response) {
                $scope.CompletionLevels = response.data;
                $scope.loading = false;
                $scope.CompletionLevels;
            });
        }

        function getSupervisors() {
            $scope.loading = true;
            formService.getSupervisors().then(function (response) {
                $scope.Supervisors = response.data;
                $scope.Supervisors.push($scope.other);
                $scope.loading = false;

            });
        }

        function getSeverities() {
            $scope.loading = true;
            formService.getSeverities().then(function (response) {
                $scope.Severities = response.data;
                $scope.loading = false;

            });
        }

        init();
    };

    controller.$inject = ["$scope", "$locale", "$translate", "formService", "$filter", "Notification"];

    angular
        .module("Eportfolio.student")
        .controller("StudentProcedureRegisterController", controller);

}(angular));