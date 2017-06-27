(function (angular) {

    "use strict";

    var controller = function ($scope,
                               $rootScope,
                               $state,
                               $stateParams,
                               $uibModal,
                               $localStorage,
                               submissionService,
                               submittedFileService,
                               config) {

        $scope.baseUrl = config.blobUrl;
        $scope.selectedFileIndex = -1;
        $scope.currentUser = $localStorage.user.username;
        $scope.returnState = $stateParams.returnState;

        $scope.loadSubmission = loadSubmission;
        $scope.loadFileDetails = loadFileDetails;
        $scope.reviewFile = reviewFile;
        $scope.fileReply = fileReply;
        $scope.viewSubmission = viewSubmission;
        $scope.enlarge = enlarge;
        $scope.goToSubmission = goToSubmission;
        $scope.close = close;
        $scope.loadFirstFileDetails = loadFirstFileDetails;
        $scope.isAllRejectApprove = isAllRejectApprove;
        $scope.review = review;
        $scope.reportSubmission = reportSubmission;


        /**
         *
         * @param someValue
         * @return {string}
         */
        $scope.whatClassIsIt = function (someValue) {
            return (someValue <= 6) ? "center" : "";
        };


        /**
         * @name $scope.submission
         * @type {{submissionId, ultrasoundType: string, patientAge: number, patientGender: boolean, indications: Array, conclusion: boolean}}
         */
        $scope.submission = {
            submissionId: $stateParams.submissionId,
            ultrasoundType: "0",
            patientAge: 0,
            patientGender: false,
            indications: [],
            conclusion: false
        };


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

                    $scope.files = response.Files;

                    $scope.submission = {
                        submissionId: response.SubmissionId,
                        ultrasoundType: response.UltrasoundType,
                        patientAge: response.PatientAge,
                        patientGender: response.PatientGender,
                        conclusion: response.Conclusion,
                        remarks: response.Remarks,
                        approved: response.Approved,
                        indications: response.IndicationNames,
                        messages: response.Messages
                    };

                    updateStats();
                    isAllRejectApprove();
                });
        }


        /**
         * @name loadFileDetails
         * @function
         *
         * @param selectedFileId
         * @param self
         */
        function loadFileDetails(selectedFileId, self) {
            var allImage = document.querySelectorAll(".swap__image-list > div"),
                currentImage = allImage[self.$index];

            allImage.forEach(function(item, i, arr){
                item.classList.remove("selected");
            });

            currentImage.classList.add("selected");

            submissionService
                .loadFilePreview(selectedFileId)
                .then(function (response) {
                    if (!response) { return; }

                    $scope.selectedFile = response;
                    $scope.selectedFileIndex = _($scope.files).findIndex({ Id: selectedFileId });

                    markMessageAsRead(selectedFileId);
                });
        }


        /**
         * Add class "selected" for first file, after load page
         *
         * @name loadFirstFileDetails
         * @function
         */
        function loadFirstFileDetails() {

            var firstFile = $scope.files[0].Id,
                currentImage = document.querySelectorAll(".swap__image-list > div")[0];

            currentImage.classList.add("selected");

            submissionService
                .loadFilePreview(firstFile)
                .then(function (response) {
                    if (!response) { return; }

                    console.log(response);

                    $scope.selectedFile = response;
                    $scope.selectedFileIndex = 0;

                    markMessageAsRead(firstFile);
                })
        }


        /**
         * @name showBtnRotate
         * @function
         *
         * @return {boolean}
         */
        $scope.showBtnNextPrev = function() {
            var filesLen = $scope.files ? $scope.files.length : {};

            return (filesLen > 1);
        };


        /**
         * Disabled btn if not all files approved || all files rejected
         *
         * @name isAllRejectApprove()
         * @function
         *
         * @return {boolean}
         */
        function isAllRejectApprove() {
            var filesLen = $scope.files ? $scope.files.length : {},
                filesReviewedLen = $scope.filesReviewed || 0;

            return (filesLen !== filesReviewedLen);
        }


        /**
         * @name fileName
         * @function
         *
         * @param file
         * @return {string}
         */
        $scope.fileName = function(file) {
            return (file.FileType.trim("") === "application/octet-stream")
                ? "DICOM"
                : file.FileType;
        };


        /**
         * @name review()
         * @function
         *
         * @param approve
         */
        function review(approve) {
            submissionService
                .updateReviewSummary($scope.submission.submissionId, $scope.submission.message, approve)
                .then(function (response) {
                    if (!response) { return; }

                    $state.go($scope.returnState || "teacher.reviews");
                });
        }


        /**
         * @name reviewFile
         * @function
         *
         * @param fileId
         * @param approve
         */
        function reviewFile(fileId, approve) {

            var remarks = angular.isNullOrUndefined($scope.selectedFile)
                ? ""
                : $scope.selectedFile.Remarks;

            submittedFileService
                .review(fileId, approve, remarks)
                .then(function (response) {
                    if (!response) {
                        return;
                    }

                    var updatedFile = _($scope.files).findWhere({ Id: $scope.selectedFile.FileId });

                    updatedFile.Approved = approve;

                    updateStats();

                    if (!angular.isNullUndefinedOrWhitespace(response.text)) {
                        $scope.selectedFile.Messages.push(response);
                    }

                    $scope.selectedFile.remarks = "";

                    var nextFileIndex = _($scope.files).findIndex(function (file) {
                        return angular.isNullOrUndefined(file.Approved);
                    });

                    if (nextFileIndex !== -1) {
                        loadFileDetails($scope.files[nextFileIndex].Id);
                        return;
                    }

                    if (!angular.isNullUndefinedOrWhitespace) {
                        var selectedFileIndex = _($scope.files).findIndex({ Id: $scope.selectedFile.FileId });

                        $scope.files[selectedFileIndex].HasUnrepliedMessages = false;

                        updateStats();
                    }
                });
        }


        /**
         * @name fileReply
         * @function
         *
         * @param message
         * @param fileId
         */
        function fileReply(message, fileId) {

            if (angular.isNullUndefinedOrWhitespace(message)) {
                return;
            }

            submittedFileService
                .reply(message, fileId)
                .then(function (response) {
                    if (!response) {
                        return;
                    }

                    $scope.selectedFile.Messages.push(response);
                    $scope.selectedFile.Remarks = "";

                    var selectedFileIndex = _($scope.files).findIndex({
                            Id: $scope.selectedFile.FileId
                        }
                    );

                    $scope.files[selectedFileIndex].HasUnrepliedMessages = false;

                    updateStats();
                });
        }


        /**
         * @name viewSubmission
         * @function
         */
        function viewSubmission() {
            $scope.selectedFile = null;
            $scope.selectedFileIndex = -1;
        }


        /**
         * @name goToSubmission
         * @function
         */
        function goToSubmission() {
            $scope.selectedFile = null;
        }


        /**
         * @name markMessageAsRead
         * @function
         *
         * @param fileId
         */
        function markMessageAsRead(fileId) {
            submittedFileService
                .markMessageAsRead(fileId)
                .then(function (response) {
                    if (!response) { return; }

                    var selectedFile = _($scope.files).findWhere({ Id: fileId });

                    selectedFile.hasUnreadMessages = false;
                });
        }


        /**
         * Show full image/video in popup
         *
         * @name enlarge
         * @function
         *
         * @param filePath
         */
        function enlarge(filePath) {
            var isVideoFile = angular.isVideoFile(filePath);

            $uibModal.open({
                templateUrl: "/app/common/media-popup.html",
                controller: "MediaPopupController",
                resolve: {
                    file: function () {
                        return {
                            filepath: filePath,
                            isVideo: isVideoFile
                        }
                    }
                }
            });
        }


        /**
         * @name updateStats
         * @function
         */
        function updateStats() {
            var approvalCount = _($scope.files).countBy("Approved");

            $scope.filesReviewed = (approvalCount.true || 0) + (approvalCount.false || 0);

            $scope.filesApproved = approvalCount.true || 0;

            var unrepliedGroups = _($scope.files).countBy("HasUnrepliedMessages");

            var unreadFileMessages = unrepliedGroups.true || 0,
                messages = $scope.submission.messages;

            var unrepliedSubmissionMessage =
                ((messages && messages.length > 0) && (messages[messages.length - 1].UName !== $scope.currentUser))
                    ? 1
                    : 0;

            $scope.unreadMessageCount = unreadFileMessages + unrepliedSubmissionMessage;
        }


        /**
         * @name close
         * @function
         */
        function close() {
            if ($scope.unreadMessageCount && $scope.unreadMessageCount > 0) {
                $state.go($scope.returnState);
                return;
            }

            $state.go($scope.returnState);
        }


        loadSubmission();


        /**
         * @name reportSubmission
         * @function
         */
        function reportSubmission() {
            $rootScope.submission = $scope.submission.submissionId;

            var modalContainer = $(".modals"),
                       htmlBody = $("html, body");

            modalContainer.show();
            htmlBody.addClass("open-modal");
            $rootScope.contactsPath = "/app/teacher/ultrasound/report-submission.html";
        }
    };


    controller.$inject = [
        "$scope",
        "$rootScope",
        "$state",
        "$stateParams",
        "$uibModal",
        "$localStorage",
        "submissionService",
        "submittedFileService",
        "config",
        "appSettings",
        "$filter",
        "Notification"
    ];

    angular
        .module("Eportfolio.teacher")
        .controller("TeacherReviewController", controller);

}(angular));