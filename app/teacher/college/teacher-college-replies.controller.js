(function (angular) {

    "use strict";
    angular
       .module("Eportfolio.teacher")
       .controller("teacher-college-replies.controller", ["$scope", "submissionService", "modalService", "$translate", function TeacherRepliesController($scope, submissionService, modalService, $translate) {



           $scope.pageNumber = 1;
           $scope.totalRecords = 0;
           $scope.closeDiscussion = closeDiscussion;

           function getReplies() {
               submissionService
                   .collegeReplies($scope.pageNumber)
                   .then(function (response) {
                       if (!response) {
                           return;
                       }

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


               getReplies();
           }

       }]);
}(angular));