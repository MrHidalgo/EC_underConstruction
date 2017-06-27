(function (angular) {

    "use strict";

    var controller = function ($scope, $state, $stateParams, $localStorage, submissionService/* modalService, statusMessage*/) {

        $scope.review = review;
        $scope.submissionReply = submissionReply;
        $scope.closeDiscussion = closeDiscussion;
        $scope.close = close;

        $scope.submission = $stateParams.submission;
        $scope.unreadMessageCount = $stateParams.unreadMessageCount;
        $scope.returnState = $stateParams.returnState;
        $scope.currentUser = $localStorage.user.username;

        function loadSubmission() {
            // console.log($stateParams.submissionId);
            submissionService
                .preview($stateParams.submissionId)
                .then(function (response) {
                    if (!response) {
                        return;
                    }

                    $scope.submission = {
                        submissionId: response.SubmissionId,
                        ultrasoundType: response.UltrasoundType,
                        patientAge: response.PatientAge,
                        patientGender: response.PatientGender,
                        conclusion: response.Conclusion,
                        indications: response.IndicationNames,
                        remarks: response.Remarks,
                        approved: response.Approved,
                        messages: response.Messages
                    };
                });
        }

        function review(approve) {
            // console.log($stateParams.submissionId);
            // console.log($scope.submission.submissionId);
            // console.log($scope.submission);
            submissionService
                .updateReviewSummary($scope.submission.submissionId, $scope.submission.message, approve)
                .then(function (response) {
                    if (!response) {
                        return;
                    }

                    //statusMessage.show({
                    //    text: "review_updated",
                    //    type: statusMessage.messageTypes.success,
                    //   // translate: true
                    //});

                    $state.go($scope.returnState || "teacher.reviews");
                });
        }

        function submissionReply() {

            if (angular.isNullUndefinedOrWhitespace($scope.submission.message)) {
                //statusMessage.show({
                //    text: "please_enter_a_message",
                //    type: statusMessage.messageTypes.error,
                //   // translate: true
                //});

                return;
            }

            submissionService
                .reply($scope.submission.message, $scope.submission.submissionId)
                .then(function (response) {
                    if (!response) {
                        return;
                    }

                    if (!$scope.submission.messages) {
                        $scope.submission.messages = [];
                    }

                    $scope.submission.messages.push(response);
                    $scope.submission.message = "";

                    $scope.unreadMessageCount--;
                });
        }

        function closeDiscussion() {
            /*
            modalService
                .confirm({
                    title: "close_discussion",
                    message: "are_you_sure_you_want_to_close_the_discussion",
                    okLabel: "yes",
                    cancelLabel: "no"
                })
                .then(function () {
                    submissionService
                        .closeDiscussion($scope.submission.submissionId)
                        .then(function (response) {
                            if (!response) {
                                return;
                            }

                            statusMessage.show({
                                text: "submission_discussion_closed",
                                type: statusMessage.messageTypes.success,
                                translate: true,
                                id: "submission-discussion"
                            });

                          
                           
                        });
                });*/
            $scope.submission.closed = true;
            $state.go($scope.returnState || "teacher.replies");
        }

        function close() {
            if ($scope.unreadMessageCount && $scope.unreadMessageCount > 0) {
               /* modalService
                    .confirm({
                        title: "close_upload",
                        message: "there_are_unread_messages_are_you_sure_you_want_to_close_the_upload",
                        okLabel: "yes",
                        cancelLabel: "no"
                    })
                    .then(function () {
                        $state.go($scope.returnState || "teacher.reviews");
                    });
                    */
                return;
            }

            $state.go($scope.returnState || "teacher.reviews");
        }

        if (!$scope.submission && $stateParams.submissionId) {
            loadSubmission($stateParams.submissionId);
        }
    };

    controller.$inject = ["$scope", "$state", "$stateParams", "$localStorage", "submissionService"/*, "modalService", "statusMessage"*/];

    angular
        .module("Eportfolio.teacher")
        .controller("ReviewSummaryController", controller);

}(angular));