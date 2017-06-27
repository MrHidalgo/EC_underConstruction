(function (angular) {

    "use strict";

    var service = function ($http, $exceptionHandler, error, appSettings, $httpParamSerializer) {

        return {
            reply: reply,
            review: review,
            search: search,
            markMessageAsRead: markMessageAsRead,
            searchCollegeUploads: searchCollegeUploads
        };

        function reply(message, fileId) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to update submitted file message", "Server Error"), "Update submitted file message");
                    return null;
                }

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Update submitted file message");
            };

            var data = {
                message: message,
                fileId: fileId
            };

            return $http
                .post(appSettings.serviceUrl + "api/submittedfilemessages/Post", data)
                .then(successCallback, errorCallback);
        }

        function review(fileId, approve, remarks) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to review submitted file", "Server Error"), "Review submitted file");
                    return null;
                }

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Review submitted file");
            };

            var data = {
                fileId: fileId,
                approve: approve,
                remarks: remarks
            };

            return $http
                .post(appSettings.serviceUrl + "api/submissionfiles/review", data)
                .then(successCallback, errorCallback);
        }

        function search(ultrasoundTypeId, viewId, findings, startDate, endDate, reviewedByMe, indicationIds, pageNumber, isStudent, isOnlyPersonal) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Error during search submitted file", "Server Error"), "Search submitted file");
                    return null;
                }

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Search submitted file");
            };

            var data = {
                ultrasoundTypeId: ultrasoundTypeId,
                viewId: viewId,
                findings: JSON.stringify(findings),
                startDate: startDate,
                endDate: endDate,
                reviewedByMe: reviewedByMe,
                indicationIds: indicationIds,
                pageNumber: pageNumber,
                IsStudent: isStudent,
                IsOnlyPersonal: isOnlyPersonal
            };

            var config = {
                params: data
            };

            return $http
                .get(appSettings.serviceUrl + "api/submissionfiles/search", config)
                .then(successCallback, errorCallback);
        }

        function searchCollegeUploads(RegisterTypeId, startDate, endDate,startRegisterdate, endRegisterDate, reviewedByMe, pageNumber, isStudent, isOnlyPersonal) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Error during search submitted file", "Server Error"), "Search submitted file");
                    return null;
                }

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Search submitted file");
            };

            var data = {
                RegisterTypeId: RegisterTypeId,
                startDate: startDate,
                endDate: endDate,
                starRegistertDate: startRegisterdate,
                endRegisterDateDate: endRegisterDate,
                reviewedByMe: reviewedByMe,
                //indicationIds: indicationIds,
                pageNumber: pageNumber,
                IsStudent: isStudent,
                IsOnlyPersonal: isOnlyPersonal
            };

            var config = {
                params: data
            };

            return $http
                .get(appSettings.serviceUrl + "api/submissionfiles/searchCollegeFiles", config)
                .then(successCallback, errorCallback);
        }

        function markMessageAsRead(fileId) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Error marking messages as read", "Server Error"), "Mark message as read");
                    return null;
                }

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Mark message as read");
            };

            return $http
                .post(appSettings.serviceUrl + "api/file/message/markasread/" + fileId)
                .then(successCallback, errorCallback);
        }
    };

    service.$inject = ["$http", "$exceptionHandler", "error", "appSettings", "$httpParamSerializer"];

    angular
        .module("Eportfolio")
        .service("submittedFileService", service);

}(angular));