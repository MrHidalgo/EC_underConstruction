'use strict';
(function () {

    angular
        .module('Eportfolio')
        .factory('userService', UserService)
        .run(['userService', function (userService) {

        }])

    UserService.$inject = ['$http', '$q', '$localStorage', '$exceptionHandler', 'appSettings', '$httpParamSerializer', '$httpParamSerializerJQLike'];

    function UserService($http, $q, $localStorage, $exceptionHandler, appSettings, $httpParamSerializer, $httpParamSerializerJQLike) {
        var serviceBase = appSettings.serviceUrl;
        var UserServiceFactory = {};


        UserServiceFactory.profileDetails = _profileDetails;
        UserServiceFactory.saveProfile = _saveProfile;
        UserServiceFactory.getUseById = _getUseById;
        UserServiceFactory.getSupervisorsType = _getSupervisorsType;


        return UserServiceFactory;

        function _profileDetails() {
            var data = $localStorage.user.username;
            var url = serviceBase + "api/profile/Get"
            return $http({
                method: 'GET',
                url: url,
                params: { userEmail: data }

            });

        }

        function _saveProfile(userdeteils) {
            var urlprofile = serviceBase + "api/profile/SaveChanges";

            function successCallback(response) {
            };
            function errorCallback(response) {
                return false;
            };

            var data = { model: userdeteils };


            return $http.post(urlprofile, $httpParamSerializerJQLike(userdeteils), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback);


        }
        function _getSupervisorsType() {
           
            var url = serviceBase + "api/profile/GetSupervisors"
            return $http({
                method: 'GET',
                url: url,
                

            });

        }
                      
        function _getUseById(id) {
            var url = serviceBase + "api/profile/GetById";
          
            return $http({
                method: 'GET',
                url: url,
                params: { id: id }

            });
        }

    };
})();

