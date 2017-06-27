(function (angular) {

    "use strict";

    var controller = function (
        $scope,
        $stateParams,
        $uibModal,
        $localStorage,
        submissionService,
        submittedFileService,
        /*statusMessage,*/
        config, authService, $translate, $state) {

        $scope.baseUrl = config.blobUrl;
        $scope.selectedFileIndex = -1;
        $scope.currentUser = $localStorage.user.username;

        $scope.loadSubmission = loadSubmission;
        $scope.loadFileDetails = loadFileDetails;
        $scope.submissionReply = submissionReply;
        $scope.fileReply = fileReply;
        $scope.enlarge = enlarge;
        $scope.goToSubmission = goToSubmission;

        $scope.submission = {
            submissionId: $stateParams.submissionId,
            ultrasoundType: "0",
            patientAge: 0,
            patientGender: false,
            indications: [],
            messages: [],
            conclusion: false
        };

        /**
         *
         * @param someValue
         * @return {string}
         */
        $scope.whatClassIsIt = function (someValue) {
            if (someValue <= 6) {
                return "center";
            }
        };

        $scope.isAdmin = authService.isAdmin();

        $scope.goToRoleState = function () {
            if (!$scope.isAdmin) {
                $state.go("student.submissionHistory")
            }
            else {
                $state.go("admin.upload-manager")
            }
        }
        function loadSubmission() {

            if (!$scope.submission || !$scope.submission.submissionId) {
                return;
            }

            submissionService
                .preview($scope.submission.submissionId)
                .then(function (response) {
                    if (!response) {
                        return;
                    }
                    // console.log(response);
                    $scope.files = response.Files;

                    $scope.submission = {
                        submissionId: response.SubmissionId,
                        ultrasoundType: _(response.UltrasoundType).pluck("Name"),
                        patientAge: response.PatientAge,
                        patientGender: response.PatientGender,
                        conclusion: response.Conclusion,
                        indications: response.IndicationNames,
                        remarks: response.Remarks,
                        approved: response.Approved,
                        closed: response.Closed,
                        messages: response.Messages
                    };
                    $scope.submission.ultrasoundTypes = [];
                    angular.forEach($scope.submission.ultrasoundType, function (name) {
                        $scope.submission.ultrasoundTypes.push($translate.instant(name));
                    });
                    $scope.filesTagged = _($scope.files).countBy(function (file) {
                        return file.completed;
                    }).true;

                    var messages = response.Messages;

                    var recentMessage = !messages || messages.length === 0 ? [] : messages[messages.length - 1];

                    if (recentMessage.username === $scope.currentUser) {
                        var fileWithMessage = _($scope.files).find({ HasUnrepliedMessages: true });
                        if (fileWithMessage) {
                            loadFileDetails(fileWithMessage.id);
                        }
                    }
                });
        }

        function loadFileDetails(selectedFileId, self) {

            console.log(self.$index || 0);

            var currentIndexFiles = self.$index || 0,
                allImage = $(".teacher-review__image"),
                currentImage = allImage.eq(currentIndexFiles);

            allImage.removeClass("active");
            currentImage.addClass("active");

            $scope.selectedFile = {};
            $scope.selectedFileIndex = -1;

            submissionService
                .loadFilePreview(selectedFileId)
                .then(function (response) {
                    if (!response) {
                        return;
                    }

                    $scope.selectedFile = response;
                    //console.log(response);
                    $scope.selectedFileIndex = _($scope.files).findIndex({ Id: selectedFileId });

                    markFileMessageAsRead(selectedFileId);
                });
        }

        function fileReply(message, fileId) {

            if (angular.isNullUndefinedOrWhitespace(message)) {
                //statusMessage.show({
                //    text: "please_enter_a_message",
                //    type: statusMessage.messageTypes.error,
                //   // translate: true
                //});

                return;
            }

            submittedFileService
                .reply(message, fileId)
                .then(function (response) {
                    if (!response) {
                        return;
                    }
                    // console.log(response);
                    $scope.selectedFile.Messages.push(response);
                    $scope.selectedFile.Remarks = "";
                    $scope.selectedFile.HasUnrepliedMessages = false;

                    var selectedFileIndex = _($scope.files).findIndex({ Id: $scope.selectedFile.FileId });
                    $scope.files[selectedFileIndex].HasUnrepliedMessages = false;
                });
        }

        function submissionReply() {

            if (angular.isNullUndefinedOrWhitespace($scope.submission.message)) {


                return;
            }

            submissionService
                .reply($scope.submission.message, $scope.submission.submissionId)
                .then(function (response) {
                    if (!response) {
                        return;
                    }
                    // console.log(response);
                    if (!$scope.submission.messages) {
                        $scope.submission.messages = [];
                    }

                    $scope.submission.messages.push(response);
                    $scope.submission.message = "";
                });
        }

        function goToSubmission() {
            $scope.selectedFile = null;
        }

        function markFileMessageAsRead(fileId) {
            submittedFileService
                .markMessageAsRead(fileId)
                .then(function (response) {
                    if (!response) {
                        return;
                    }

                    var selectedFile = _($scope.files).findWhere({ Id: fileId });
                    selectedFile.HasUnreadMessages = false;
                });
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

        loadSubmission();
    };

    controller.$inject = [
        "$scope",
        "$stateParams",
        "$uibModal",
        "$localStorage",
        "submissionService",
        "submittedFileService",
       // "statusMessage",
        "config", "authService", "$translate", "$state"
    ];

    angular
        .module("Eportfolio.student")
        .controller("StudentSubmissionPreviewController", controller);

}(angular));