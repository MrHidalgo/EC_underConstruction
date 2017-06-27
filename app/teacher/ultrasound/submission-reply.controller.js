(function (angular) {

    "use strict";

    var controller = function ($scope, $localStorage, $uibModalInstance, $state, submissionService,/* statusMessage,*/ submissionId) {

        $scope.close = close;
        $scope.closeDiscussion = closeDiscussion;
        $scope.reply = reply;
        $scope.goToSubmission = goToSubmission;

        $scope.submissionId = submissionId;
        $scope.currentUser = $localStorage.user.username;

        function loadDiscussion() {
            submissionService
                .loadDiscussion(submissionId)
                .then(function (response) {
                    if (!response) {
                        return;
                    }

                    $scope.submission = response;
                });
        }

        function close() {
            $uibModalInstance.close();
        };

        function reply() {

            if (angular.isNullUndefinedOrWhitespace($scope.message)) {
               /* statusMessage.show({
                    text: "please_enter_a_message",
                    type: statusMessage.messageTypes.error,
                    translate: true
                });
                */
                return;
            }

            submissionService
                .reply($scope.message, submissionId)
                .then(function (response) {
                    if (!response) {
                        return;
                    }

                    if (!$scope.submission.messages) {
                        $scope.submission.messages = [];
                    }

                    $scope.submission.messages.push(response);
                    $scope.message = "";
                });
        }

        function closeDiscussion() {
            submissionService
                .closeDiscussion(submissionId)
                .then(function(response) {
                    if (!response) {
                        return;
                    }

                    /*statusMessage.show({
                        text: "submission_discussion_closed",
                        type: statusMessage.messageTypes.success,
                        translate: true,
                        id: "submission-discussion"
                    });*/

                    $scope.submission.closed = true;
                });
        }

        function goToSubmission() {
            $uibModalInstance.dismiss();
            $state.go("teacher.reviewSummary", { submissionId: submissionId });
        }

        loadDiscussion();
    };

    controller.$inject = ["$scope", "$localStorage", "$uibModalInstance", "$state", "submissionService", /*"statusMessage",*/ "submissionId"];

    angular
        .module("Eportfolio.teacher")
        .controller("SubmissionReplyController", controller);

}(angular));