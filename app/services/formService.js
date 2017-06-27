(function () {
    'use strict';

    angular
        .module('Eportfolio')
        .factory('formService', ['$http', '$httpParamSerializer', 'appSettings', '$httpParamSerializerJQLike', function dataService($http, $httpParamSerializer, appSettings, $httpParamSerializerJQLike) {

            var serviceBase = appSettings.serviceUrl;
        
            // http custom methods
            function getData(url) {
                return $http.get(serviceBase + url)
                    .then(callComplete, callFailed);
            }
            function postData(url, data) {
                return $http.post(serviceBase + url, $httpParamSerializerJQLike(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(callComplete, callFailed);
            }

            function putData(url, data) {
                return $http.put(serviceBase + url, $httpParamSerializer(data))
               .then(callComplete, callFailed);
            }

            function callFailed(error) {
                return error;
            }

            function callComplete(response) {
                return response;
            }

            //own methods
            function getProcedureTypes() {
                return getData("api/Procedure/GetTypes");
            }

            function getCompletionLevels() {
                return getData("api/Procedure/GetLevels");
            }

            function getSupervisors() {
                return getData("api/Procedure/GetSupervisors"); 
            }


            function getSeverities() {
                return getData("api/Procedure/GetSeverities");
            }

            function postProcedureForm(data) {
                return postData("api/Procedure/Post", data);
            }
            function GetProcedures() {
                return getData("api/Procedure/GetProcedures");
            }

            return {
                getProcedureTypes: getProcedureTypes,
                getCompletionLevels: getCompletionLevels,
                getSupervisors: getSupervisors,
                getSeverities: getSeverities,
                postProcedureForm: postProcedureForm,
                GetProcedures:GetProcedures
            };

        }]);
})();