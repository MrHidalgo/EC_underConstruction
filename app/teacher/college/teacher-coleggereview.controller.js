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
                               /*  statusMessage,
                                modalService,*/
                               config,
                               appSettings,
                               $filter,
                               Notification) {

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
        $scope.disabledNotifyMessage = disabledNotifyMessage;

        // console.log($rootScope);
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
                .previewCollegeSubmission($scope.submission.submissionId)
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
                        indications: response.IndicationNames,
                        remarks: response.Remarks,
                        approved: response.Approved,
                        closed: response.Closed,
                        messages: response.Messages,
                        VideoDate:response.VideoDate,
                        teacher:response.TeacherAssigned
                    };
                    updateStats();
                    isAllRejectApprove();
                });
          
        }

        function loadFileDetails(selectedFileId, self) {

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
                    $scope.selectedFileIndex = _($scope.files).findIndex({ Id: selectedFileId });
                    // var eee = !angular.isNullOrUndefin   ed($scope.selectedFile.Approved) && $scope.selectedFile.Messages && $scope.selectedFile.Messages[$scope.selectedFile.Messages.length - 1].UName !== $scope.currentUser;
                    markMessageAsRead(selectedFileId);
                });

        }

        /**
         * Selected first files after open window
         *
         * @name loadFirstFileDetails()
         * @function
         */
        function loadFirstFileDetails() {

            var currentIndexFiles = 0,
                currentImage = $(".teacher-review__image").eq(currentIndexFiles);

            currentImage.addClass("active");

            var firstFile = $scope.files[0].Id;

            $scope.selectedFile = {};
            $scope.selectedFileIndex = -1;

            submissionService
                .loadFilePreview(firstFile)
                .then(function (response) {
                    if (!response) {
                        return;
                    }

                    $scope.selectedFile = response;
                    $scope.selectedFileIndex = 0;

                    markMessageAsRead(firstFile);
                })
        }

        /**
         * Disabled btn if not all files approved || all files rejected
         *
         * @name isAllRejectApprove()
         * @function
         *
         * @return {*}
         */
        function isAllRejectApprove() {
            var file = $scope.files || {},
                filesLen = file.length || 0,
                filesReviewedLen = $scope.filesReviewed || 0;

            // var strDOM = ".shape_two .shape__name-collapse, .shape_two .shape__body-collapse";

            if (filesReviewedLen === filesLen) {
                // $(strDOM).removeClass("active");
                // return "active";
                return false;
            } else {
                // $(strDOM).addClass("active").attr("style", "");
                // return "disabled";
                return true;
            }
        }

        function disabledNotifyMessage(ev) {
            /*     var elem = $(ev.target).closest(".shape__name"),
                     elemDisabled = elem.hasClass("disabled");
     
                 if(elemDisabled) {
                     Notification.error({
                             message: $filter('translate')("please_assess_all_files_individually")
                     });
                 }*/
        }

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
                    if (!response) {
                        return;
                    }

                    $state.go($scope.returnState || "teacher.collegereviews");
                });
        }


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
                    /*
                     statusMessage.show({
                     text: "review_updated",
                     type: statusMessage.messageTypes.success,
                     translate: true
                     });*/

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

                    // $state.go("teacher.reviewSummary", { submission: $scope.submission });

                    if (!angular.isNullUndefinedOrWhitespace) {
                        var selectedFileIndex = _($scope.files).findIndex({ Id: $scope.selectedFile.FileId });
                        $scope.files[selectedFileIndex].HasUnrepliedMessages = false;

                        updateStats();
                    }
                });
        }

        function fileReply(message, fileId) {

            if (angular.isNullUndefinedOrWhitespace(message)) {
                /*  statusMessage.show({
                 text: "please_enter_a_message",
                 type: statusMessage.messageTypes.error,
                 translate: true
                 });*/

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

                    var selectedFileIndex = _($scope.files).findIndex({ Id: $scope.selectedFile.FileId });
                    $scope.files[selectedFileIndex].HasUnrepliedMessages = false;

                    updateStats();
                });
        }

        function viewSubmission() {
            $scope.selectedFile = null;
            $scope.selectedFileIndex = -1;
        }

        function goToSubmission() {
            $scope.selectedFile = null;
        }

        function markMessageAsRead(fileId) {
            submittedFileService
                .markMessageAsRead(fileId)
                .then(function (response) {
                    if (!response) {
                        return;
                    }

                    var selectedFile = _($scope.files).findWhere({ Id: fileId });
                    selectedFile.hasUnreadMessages = false;
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

        function updateStats() {
            var approvalCount = _($scope.files).countBy("Approved");

            $scope.filesReviewed = (approvalCount.true || 0) + (approvalCount.false || 0);

            $scope.filesApproved = approvalCount.true || 0;

            var unrepliedGroups = _($scope.files).countBy("HasUnrepliedMessages");
            var unreadFileMessages = unrepliedGroups.true || 0;

            var messages = $scope.submission.messages;
            var unrepliedSubmissionMessage = messages && messages.length > 0 && messages[messages.length - 1].UName !== $scope.currentUser ? 1 : 0;
            // console.log(unrepliedSubmissionMessage);
            $scope.unreadMessageCount = unreadFileMessages + unrepliedSubmissionMessage;
        }

        function close() {
            if ($scope.unreadMessageCount && $scope.unreadMessageCount > 0) {
                $state.go($scope.returnState);
                return;
            }

            $state.go($scope.returnState);
        }

        loadSubmission();
        function reportSubmission() {
            console.log($scope.submission);
            $rootScope.submission = $scope.submission.submissionId;
            var modalContainer = $(".modals"),
                       htmlBody = $("html, body");
            modalContainer.show();
            htmlBody.addClass("open-modal");
            $rootScope.contactsPath = "/app/teacher/ultrasound/report-submission.html";
        };
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
        /* "statusMessage",
         "modalService",*/
        "config",
        "appSettings",
        "$filter",
        "Notification"
    ];

    angular
        .module("Eportfolio.teacher")
        .controller("teacher-coleggereview.controller", controller);

}(angular));