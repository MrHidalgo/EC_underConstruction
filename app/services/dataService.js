(function () {
    'use strict';

    angular
        .module('Eportfolio')
        .factory('dataService', ['$http', '$httpParamSerializer', 'appSettings', '$httpParamSerializerJQLike', function dataService($http, $httpParamSerializer, appSettings, $httpParamSerializerJQLike) {
     
            var serviceBase = appSettings.serviceUrl;
            var errorData = "";

            // service methods
            function getHospitals() {
                return getData(serviceBase + "api/Hospitals/GetHospitals")
            }

            function getLevels() {
                return getData(serviceBase + "api/Levels/GetLevels")
            }

            function getCountries() {
                return getData(serviceBase + "api/Countries/GetCountries")
            }

            function getSpecialities() {
                return getData(serviceBase + "api/Specialities/GetSpecialities")
            }
            function getUserTitles() {
                return getData(serviceBase + "api/profile/GetUserTitles")
            }
            function registerUser(model) {
                return postData(serviceBase + "api/register/PreRegister", model, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            }

            function checkRegistrationToken(model) {
                return getData(serviceBase + "api/register/CkeckToken?token=" + model, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            }

            function confirmRegister(model) {
                return postData(serviceBase + "api/register/ConfirmRegister", model, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            }

            function cancelRegister(model) {
                return postData(serviceBase + "api/register/CancelRegister", model, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
            }

            function sendEmailToReset(email) {
                return getData(serviceBase + "api/account/ForgotPassword?email=" + email);
            }

            function checkResetToken(model) {
                return getData(serviceBase + "api/account/CheckToken?token=" + model, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            }
            function changePassword(model) {
                return postData(serviceBase + "api/account/ChangePassword", model, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            }

            // http custom methods
            function getData(url) {
                return $http.get(url, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
                    .then(callComplete, callFailed);
            }
            function postData (url, data, config) {
                return $http.post(url, $httpParamSerializerJQLike(data), config)
                .then(callComplete, callFailed);
            }

            function putData(url, data, config) {
                return $http.put(url, $httpParamSerializer(data), config)
               .then(callComplete, callFailed);
            }

            function callFailed(error) {
                return error;
            }

            function callComplete(response) {
                return response;
            }

            function getKpbList() {
                return getData(serviceBase + "api/Kpb/GetKpbs");
            }

            function getEpaList() {
                return getData(serviceBase + "api/Kpb/GetEpas");
            }

            function sendSupportMessage(data) {
                return postData(serviceBase + "api/ContactUs/Post", data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            }
            function getLanguages() {
                return getData(serviceBase + "api/Language/GetLanguages")
            }
            function reportSubmission(data) {
                return postData(serviceBase + "api/Report/Post", data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            }
            function getColleges() {
                return getData(serviceBase + "api/Colleges/GetColleges");
            }
           
            return  {
                getSpecialities: getSpecialities,
                getLevels: getLevels,
                getHospitals: getHospitals,
                getCountries: getCountries,
                registerUser: registerUser,
                checkRegistrationToken: checkRegistrationToken,
                confirmRegister: confirmRegister,
                cancelRegister: cancelRegister,
                sendEmailToReset: sendEmailToReset,
                checkResetToken: checkResetToken,
                changePassword: changePassword,
                getUserTitles: getUserTitles,
                getKpbList: getKpbList,
                getEpaList: getEpaList,
                sendSupportMessage: sendSupportMessage,
                getLanguages: getLanguages,
                reportSubmission: reportSubmission,
                getColleges: getColleges
            };

        }]);
})();