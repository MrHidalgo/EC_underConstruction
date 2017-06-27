(function () {
    'use strict';

    angular
        .module('Eportfolio')
        .factory('specificConclusionService', ['$http', '$httpParamSerializer', 'appSettings', '$httpParamSerializerJQLike',
            function dataService($http, $httpParamSerializer, appSettings, $httpParamSerializerJQLike) {

                var serviceBase = appSettings.serviceUrl;
           
            return {
                getConclusionTags: getConclusionTags,
                saveConclusionTags: saveConclusionTags
            };
           

            // http custom methods
            function getData(url) {
                return $http.get(serviceBase + url, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                    .then(callComplete, callFailed);
            }
            function postData(url, data, config) {
                return $http.post(serviceBase + url, $httpParamSerializerJQLike(data), config)
                .then(callComplete, callFailed);
            }

            function putData(url, data, config) {
                return $http.put(serviceBase + url, $httpParamSerializerJQLike(data), config)
               .then(callComplete, callFailed);
            }

            function callFailed(error) {
                return error;
            }

            function callComplete(response) {
                return response.data;
            }


            function getConclusionTags(SpecialityId) {
                return getData('api/Ultrasound/GetConclusionTags?SpecialityId=' + SpecialityId);
            }
           
            function saveConclusionTags(data) {
             

                return postData('api/Ultrasound/SaveConclusionTags', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            }

        }]);
})();