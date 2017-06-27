(function (angular) {

    "use strict";

    var service = function ($http, $exceptionHandler, error, appSettings, $httpParamSerializer) {

        return {
            create: create,
            update: update,
            groupHasTeacher: groupHasTeacher,
            sentSupervisorRequest: sentSupervisorRequest,
            complete: complete,
            remove: remove,
            get: get,
            getFull: getFull,
            preview: preview,
            list: list,
            loadFileDetails: loadFileDetails,
            loadFilePreview: loadFilePreview,
            preupload:preupload,
            updateFileDetails: updateFileDetails,
            loadHistory: loadHistory,
            loadUltrasoundTypes: loadUltrasoundTypes,
            loadIndications: loadIndications,
            loadViews: loadViews,
            loadFindings: loadFindings,
            loadReviewed: loadReviewed,
            loadReviewStats: loadReviewStats,
            replies: replies,
            updateReviewSummary: updateReviewSummary,
            reply: reply,
            loadDiscussion: loadDiscussion,
            closeDiscussion: closeDiscussion,
            removeFile: removeFile,
            removeTagsFromSubmission: removeTagsFromSubmission, 
            loadIndicationsAndViews: loadIndicationsAndViews,
            getTeacherReviews: getTeacherReviews,
            getCollegeSubmission: getCollegeSubmission,
            saveCollegeUpload: saveCollegeUpload,
            loadRegistrationTypes: loadRegistrationTypes,
            listCollege: listCollege,
            previewCollegeSubmission: previewCollegeSubmission,
            loadStudentCollegeProgress: loadStudentCollegeProgress,
            loadReviewedCollegeStats: loadReviewedCollegeStats,
            loadCollegeReviewed: loadCollegeReviewed,
            collegeReplies: collegeReplies

        };
        function sentSupervisorRequest() {
            var successCallback = function (response) {
                return response;
            };
            var errorCallback = function (errorResponse) {
                return errorResponse;
            };
            return $http
                .get(appSettings.serviceUrl + "api/ContactUs/SendSupervisorRequest")
                .then(successCallback, errorCallback);
            
        }

        function groupHasTeacher() {
            var successCallback = function (response) {

                return response;
            };

            var errorCallback = function (errorResponse) {
                return errorResponse;
            };



            return $http
                .get(appSettings.serviceUrl + "api/submissionsummary/GroupHasTeacher")
                .then(successCallback, errorCallback);
        }

        function loadIndicationsAndViews(submissionId, ultrasoundTypes) {
               var successCallback = function (response) {
                //if (!response) {
                   // $exceptionHandler(error.create("Unable to get indications", "Server Error"), "Get indications");
                    //return null;
                //}

                return response;
            };

            var errorCallback = function (errorResponse) {
               // $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Get indications");
                return response;
            };
            var data = {
                SubmissionId: submissionId,
                UltrasoundTypes: ultrasoundTypes

            };
                   return $http
                  .post(appSettings.serviceUrl + "api/submission/GetIndicationsWithViews", data)
                  .then(successCallback, errorCallback);
        }

        function preupload (details) {
            var successCallback = function (response) {


                if (!response) {
                    //$exceptionHandler(error.create("Unable to complete submission", "Server Error"), "Complete submission");
                    return response;
                }

                return response;
            };

            var errorCallback = function (response) {
                //$exceptionHandler(error.create(errorResponse, "Server Error"), "Complete submission");
                return response;
            };



            return $http
                .post(appSettings.serviceUrl + "api/submissionFiles/Preupload", details)
                .then(successCallback, errorCallback);
        } 

        function removeTagsFromSubmission(submissionId, ultasoundTypeId) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to delete tags", "Server Error"), "Get submitted file details");
                    return null;
                }

                return response;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse, "Server Error"), "Tags are not deleted");
            };

            return $http
                .get(appSettings.serviceUrl + "api/submissionFiles/DeleteFileTags?submissionId=" + submissionId + "&ultasoundTypeId=" + ultasoundTypeId)
                .then(successCallback, errorCallback);

        }

        function list(showReviewed, pageNumber, startDate, endDate, ultrasoundTypes, assessments, conclusions, approvals) {

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
                .get(appSettings.serviceUrl + "api/submission/list/", config)
                .then(successCallback, errorCallback);
        }
        function listCollege(showReviewed, pageNumber, startDate, endDate, UltrasoundTypes) {

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
                    UltrasoundTypes: UltrasoundTypes,
                    startDate: startDate,
                    endDate: endDate
                }
            };

            return $http
                .get(appSettings.serviceUrl + "api/submission/listCollege/", config)
                .then(successCallback, errorCallback);
        }


        function getTeacherReviews(showReviewed, pageNumber, startDate, endDate, ultrasoundTypes, assessments, conclusions, approvals) {

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
                .get(appSettings.serviceUrl + "api/submissions/GetReviews/", config)
                .then(successCallback, errorCallback);
        }
        function create() {

            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to create submission", "Server Error"), "Create submission");
                    return false;
                }

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Create submission");
            };

            return $http
                .post(appSettings.serviceUrl + "api/submissions/Post")
                .then(successCallback, errorCallback);
        }

        function update(submission) {
            var successCallback = function (response) {

                var responseData = response.data;

                if (!responseData) {
                    $exceptionHandler(error.create("Unable to update submission details", "Server Error"), "Update submission details");
                    return null;
                }

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Update submission details");
            };

            return $http
                .put(appSettings.serviceUrl + "api/submissions/Put/", JSON.stringify(submission))
                .then(successCallback, errorCallback);
        }

        function complete(parameters) {
            var successCallback = function (response) {

                

                if (!response) {
                    $exceptionHandler(error.create("Unable to complete submission", "Server Error"), "Complete submission");
                    return response;
                }

                return response;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Complete submission");
                return null;
            };



            return $http
                .post(appSettings.serviceUrl + "api/submissionsummary/Post", parameters)
                .then(successCallback, errorCallback);
        }

        function remove(submissionId) {
            var successCallback = function (response) {

                var responseData = response.data;

                if (!responseData) {
                    $exceptionHandler(error.create("Unable to delete submission", "Server Error"), "Delete submission");
                    return null;
                }

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Delete submission");
            };

            return $http
                .delete(appSettings.serviceUrl + "api/submissions/Delete?id=" + submissionId)
                .then(successCallback, errorCallback);
        }

        function get(submissionId) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to get submission details", "Server Error"), "Get submission details");
                    //return null;
                }

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Get submission details");
                //return null;
            };

            return $http
                .get(appSettings.serviceUrl + "api/submissions/get?id=" + submissionId)
                .then(successCallback, errorCallback);
        }

        function getFull(submissionId) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to get submission details", "Server Error"), "Get submission details");
                    return null;
                }

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Get submission details");
            };

            return $http
                .get(appSettings.serviceUrl + "api/submission/GetFullSubmission?id=" + submissionId)
                .then(successCallback, errorCallback);
        }


        function preview(submissionId) {
            var successCallback = function (response) {
                //if (!response.data) {
                //    $exceptionHandler(error.create("Unable to preview submission details", "Server Error"), "Preview submission details");
                //    return null;
                //}

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                return errorResponse;
               // $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Preview submission details");
            };

            return $http
                .get(appSettings.serviceUrl + "api/submission/preview/" + submissionId)
                .then(successCallback, errorCallback);
        }

        function loadFileDetails(fileId) {

            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to get submitted file details", "Server Error"), "Get submitted file details");
                    return null;
                }

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Get submitted file details");
            };

            return $http
                .get(appSettings.serviceUrl + "api/submissionFiles/get?id=" + fileId)
                .then(successCallback, errorCallback);
        }

        function loadFilePreview(fileId) {

            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to load submitted file preview", "Server Error"), "Load submitted file preview");
                    return null;
                }

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Load submitted file preview");
            };

            return $http
                .get(appSettings.serviceUrl + "api/submissionFiles/preview/" + fileId)
                .then(successCallback, errorCallback);
        }

        function updateFileDetails(selectedFile, findings) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to update submitted file details", "Server Error"), "Update submitted file details");
                    return false;
                }

                return true;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Update submitted file details");
            };

            var data = {
                SelectedFile: selectedFile,
                Findings: findings
            };

            return $http
                .post(appSettings.serviceUrl + "api/submissionFiles/UpdateFileDetails", data)
                .then(successCallback, errorCallback);
        }

        function loadHistory(loadNormalUltrasound, referenceDate,ultrasoundId, isTeacherPersonal) {
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

            return $http
                .post(appSettings.serviceUrl + "api/submissionHistory/Get?loadNormalUltrasound=" + loadNormalUltrasound + "&referenceDate=" + referenceDate.toISOString() + "&ultrasoundId=" + ultrasoundId + "&isTeacherPersonal=" + isTeacherPersonal)
                .then(successCallback, errorCallback);
        }
        function loadStudentCollegeProgress(referenceDate, registrationId) {
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

            return $http
                .post(appSettings.serviceUrl + "api/submissionHistory/GetCollegeProgress?referenceDate=" + referenceDate.toISOString() + "&registrationId=" + registrationId)
                .then(successCallback, errorCallback);

        }

        function loadUltrasoundTypes() {

            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to get ultrasound types", "Server Error"), "Get ultrasound types");
                    return null;
                }

                return response.data.UltrasoundTypes;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Get ultrasound types");
            };

            return $http
                .get(appSettings.serviceUrl + "api/UltrasoundTypes/Get")
                .then(successCallback, errorCallback);
        }
        function loadRegistrationTypes() {

            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to get ultrasound types", "Server Error"), "Get ultrasound types");
                    return null;
                }

                return response.data.RegistrationTypes;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Get ultrasound types");
            };

            return $http
                .get(appSettings.serviceUrl + "api/RegistrationTypes/Get")
                .then(successCallback, errorCallback);
        }

        function loadIndications(submissionId, ultrasoundTypeId) {

            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to get indications", "Server Error"), "Get indications");
                    return null;
                }

                return response.data.Indications;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Get indications");
            };
            var data = {
                SubmissionId: submissionId,
                ultrasoundTypes: ultrasoundTypeId

            };
                   return $http
                  .post(appSettings.serviceUrl + "api/indications/Post", data)
                  .then(successCallback, errorCallback);
        }

        function loadViews(ultrasoundTypes) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to get views", "Server Error"), "Get views");
                    return null;
                }

                return response.data.Views;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Get views");
            };
            
            var data = { ultrasoundTypes: ultrasoundTypes };
            // console.log(data);
            return $http
                .post(appSettings.serviceUrl + "api/views/GetViews", data)
                .then(successCallback, errorCallback);
        }

        function loadFindings(fileId, viewId) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to get findings", "Server Error"), "Get findings");
                    return null;
                }

                return response.data.Findings;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Get findings");
            };

            return $http
                .get(appSettings.serviceUrl + "api/findings/Get?fileId=" + fileId + "&viewId=" + viewId)
                .then(successCallback, errorCallback);
        }

        function loadReviewed(referenceDate) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to get reviewed submission history", "Server Error"), "Get reviewed submission history");
                    return null;
                }

                return response.data;
            };
            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Get reviewed submission history");
            };

            return $http
                .get(appSettings.serviceUrl + "api/reviewedsubmissionHistory/Get?referenceDate=" + referenceDate.toISOString())
                .then(successCallback, errorCallback);
        }
        function loadCollegeReviewed(referenceDate) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to get reviewed submission history", "Server Error"), "Get reviewed submission history");
                    return null;
                }

                return response.data;
            };
            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Get reviewed submission history");
            };

            return $http
                .get(appSettings.serviceUrl + "api/reviewedsubmissionHistory/GetCollegeReviewed?referenceDate=" + referenceDate.toISOString())
                .then(successCallback, errorCallback);

        }
        function loadReviewStats() {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to get reviewed stats", "Server Error"), "Get reviewed stats");
                    return null;
                }

                return response.data;
            };
            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Get reviewed stats");
            };

            return $http
                .get(appSettings.serviceUrl + "api/SubmissionReviewStats/Get")
                .then(successCallback, errorCallback);
        }
        function loadReviewedCollegeStats() {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to get reviewed stats", "Server Error"), "Get reviewed stats");
                    return null;
                }

                return response.data;
            };
            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Get reviewed stats");
            };

            return $http
                .get(appSettings.serviceUrl + "api/SubmissionReviewStats/GetColleges")
                .then(successCallback, errorCallback);
        }

        function replies(pageNumber) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to get submission replies", "Server Error"), "Get submission replies");
                    return null;
                }

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Get submission replies");
            };

            return $http
                .get(appSettings.serviceUrl + "api/replies/Replies?pageNumber=" + pageNumber)
                .then(successCallback, errorCallback);
        }
        function collegeReplies(pageNumber) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to get submission replies", "Server Error"), "Get submission replies");
                    return null;
                }

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Get submission replies");
            };

            return $http
                .get(appSettings.serviceUrl + "api/CollegeReplies/Replies?pageNumber=" + pageNumber)
                .then(successCallback, errorCallback);
        }
        function updateReviewSummary(submissionId, remarks, approve) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to update review summary", "Server Error"), "Update review summary");
                    return false;
                }

                return true;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Update review summary");
            };

            var data = {
                SubmissionId: submissionId,
                Remarks: remarks,
                Approve: approve
            };

            return $http
                .post(appSettings.serviceUrl + "api/reviewsummary/Post", data)
                .then(successCallback, errorCallback);
        }

        function reply(message, submissionId) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to update submission message", "Server Error"), "Update submission message");
                    return null;
                }

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Update submission message");
            };

            var data = {
                message: message,
                submissionId: submissionId
            };

            return $http
                .post(appSettings.serviceUrl + "api/submissionmessages/Post", data)
                .then(successCallback, errorCallback);
        }

        function loadDiscussion(submissionId) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to load discussion", "Server Error"), "Load discussion");
                    return null;
                }

                return response.data;
            };
            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Load discussion");
            };

            return $http
                .get(appSettings.serviceUrl + "api/submissionDiscussion/" + submissionId)
                .then(successCallback, errorCallback);
        }

        function closeDiscussion(submissionId) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to close discussion", "Server Error"), "Close discussion");
                    return null;
                }

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Close discussion");
            };

            return $http
                .post(appSettings.serviceUrl + "api/submissionDiscussion/Post?id=" + submissionId)
                .then(successCallback, errorCallback);
        }

        function removeFile(id) {
            var successCallback = function (response) {

                var responseData = response.data;

                //if (!responseData) {
                //    $exceptionHandler(error.create("Unable to delete submission", "Server Error"), "Delete submission");
                //    return null;
                //}

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                //$exceptionHandler(error.create(errorResponse.data, "Server Error"), "Delete submission");
                return null;
            };

            return $http
                .get(appSettings.serviceUrl + "api/submissionfiles/deleteFile?id=" + id)
                .then(successCallback, errorCallback);
        }
        function getCollegeSubmission(submissionId) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to get submission details", "Server Error"), "Get submission details");
                    return null;
                }

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Get submission details");
            };

            return $http
                .get(appSettings.serviceUrl + "api/submission/GetCollegeSubmission?id=" + submissionId)
                .then(successCallback, errorCallback);
        }
        function saveCollegeUpload(submission) {
            var successCallback = function (response) {

                var responseData = response.data;

                if (!responseData) {
                    $exceptionHandler(error.create("Unable to update submission details", "Server Error"), "Update submission details");
                    return null;
                }

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Update submission details");
            };

            return $http
                .post(appSettings.serviceUrl + "api/submission/SaveCollege/", (submission))
                .then(successCallback, errorCallback);
        }
        function previewCollegeSubmission(submissionId) {
            var successCallback = function (response) {
                //if (!response.data) {
                //    $exceptionHandler(error.create("Unable to preview submission details", "Server Error"), "Preview submission details");
                //    return null;
                //}

                return response.data;
            };

            var errorCallback = function (errorResponse) {
                return errorResponse;
                // $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Preview submission details");
            };

            return $http
                .get(appSettings.serviceUrl + "api/submission/previewcollege/" + submissionId)
                .then(successCallback, errorCallback);
        }

    };

    service.$inject = ["$http", "$exceptionHandler", "error", "appSettings", "$httpParamSerializer"];

    angular
        .module("Eportfolio")
        .service("submissionService", service);

}(angular));