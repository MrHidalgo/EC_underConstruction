(function (angular) {

    "use strict";
    angular
       .module("Eportfolio.teacher")
       .controller("TeacherRepliesController", ["$scope", "submissionService", "modalService", "$translate", function TeacherRepliesController($scope, submissionService, modalService, $translate) {
    
  

        $scope.pageNumber = 1;
        $scope.totalRecords = 0;

       // $scope.getReplies = getReplies;
       // $scope.openReplies = openReplies;
        $scope.closeDiscussion = closeDiscussion;
        //getReplies();
        function getReplies() {
            submissionService
                .replies($scope.pageNumber)
                .then(function(response) {
                    if (!response) {
                        return;
                    }
                    // console.log(response);
                    angular.forEach(response.Submissions, function (submission) {
                        submission.UltrasoundTypeNames = [];
                        angular.forEach(submission.UltrasoundTypeName, function (name) {

                            submission.UltrasoundTypeNames.push($translate.instant(name));

                        });
                        submission.UltrasoundTypeName = submission.UltrasoundTypeNames;
                        console.log(submission.UltrasoundTypeName);

                    });
                    $scope.submissions = response.Submissions;
                    $scope.pageNumber = response.PageNumber;
                    $scope.totalRecords = response.TotalRecords;
                });
        }

        //function openReplies(submissionId) {
        //    var modalInstance = $uibModal.open({
        //        templateUrl: "/app/teacher/submission-reply.html",
        //        controller: "SubmissionReplyController",
        //        resolve: {
        //            submissionId: function() {
        //                return submissionId;
        //            }
        //        }
        //    });

        //    modalInstance.result.then(function() {
            
        //    });
        //}
        getReplies();
        function closeDiscussion(submissionId) {

            modalService
                .confirm({
                    title: "Close discussion",
                    message: "Are you sure you want to close the discussion?",
                    okLabel: "Yes",
                    cancelLabel: "No"
                })
                .then(function () {
                    submissionService
                        .closeDiscussion(submissionId)
                        .then(function (response) {
                            if (!response) {
                                return;
                            }

                            /*statusMessage.show({
                                text: "submission_discussion_closed",
                                type: statusMessage.messageTypes.success,
                                translate: true,
                                id: "submission-discussion"
                            });*/

                           getReplies();
                                            });
                                  });
                            //}

                            getReplies();
                        }
                    
          //  }

    //controller.$inject = ["$scope", "submissionService"/*, "statusMessage"*/];

    //angular
    //    .module("Eportfolio.teacher")
    //    .controller("TeacherRepliesController", controller);
       }]);
}(angular));