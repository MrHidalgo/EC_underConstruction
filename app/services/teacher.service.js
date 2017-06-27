(function (angular) {

    "use strict";
    angular
       .module('Eportfolio')
       .factory('teacherService', TeacherService)
       .run(['teacherService', function (teacherService) {

       }])
  
    TeacherService.$inject = ["$http", "$exceptionHandler", "appSettings"];

  function TeacherService($http, $exceptionHandler, appSettings) {

        return {
            getDashboardInfo: _getDashboardInfo,
            getcollegeDashboardInfo: getcollegeDashboardInfo,
            getCollegeReviews: getCollegeReviews
        };

        function _getDashboardInfo() {

                var successCallback = function(response) {
                    if (!response.data) {
                        $exceptionHandler(error.create("Unable to get teacher dashboard info", "Server Error"), "Get teacher dashboard info");
                        return null;
                    }

                    return response.data;
                };

                var errorCallback = function(errorResponse) {
                    $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Get teacher dashboard info");
                };

            return $http
                .get(appSettings.serviceUrl+"api/teacherdashboard/Get")
                .then(successCallback, errorCallback);
        }

        function getcollegeDashboardInfo() {

            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to get teacher dashboard info", "Server Error"), "Get teacher dashboard info");
                    return null;
                }

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Get teacher dashboard info");
            };

            return $http
                .get(appSettings.serviceUrl + "api/teacherdashboard/GetColleges")
                .then(successCallback, errorCallback);
        }
        function getCollegeReviews(showReviewed, pageNumber, startDate, endDate, ultrasoundTypes, assessments, conclusions, approvals) {

            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to get submission history", "Server Error"), "Get submission history");
                    return null;
                }

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Get submission history");
            };

            var config = {
                params: {
                    showReviewed: showReviewed,
                    pageNumber: pageNumber,
                    ultrasoundTypes: ultrasoundTypes,
                    startDate: startDate,
                    endDate: endDate,
                    assessments: assessments,
                    conclusions: conclusions,
                    approvals: approvals
                }
            };

            return $http
                .get(appSettings.serviceUrl + "api/submissions/GetCollegeReviews/", config)
                .then(successCallback, errorCallback);
        }

    };

   
   

}(angular));



//(function (angular) {

//    "use strict";

//    angular
//        .module("Eportfolio.teacher")
//        .service("teacherService", ["$http", "$exceptionHandler", "error", function ($http, $exceptionHandler, error) {

//            return {
//                getDashboardInfo: getDashboardInfo
//            };

//            function getDashboardInfo() {

//                var successCallback = function (response) {
//                    if (!response.data) {
//                        $exceptionHandler(error.create("Unable to get teacher dashboard info", "Server Error"), "Get teacher dashboard info");
//                        return null;
//                    }

//                    return response.data;
//                };

//                var errorCallback = function (errorResponse) {
//                    $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Get teacher dashboard info");
//                };

//                return $http
//                    .get("/api/teacherdashboard/")
//                    .then(successCallback, errorCallback);
//            }
//        }]);

//}(angular));