(function (angular) {

    angular
        .module("Eportfolio")
        .controller("contactController", ["$scope", "$rootScope", "authService", "dataService", "$localStorage", "$filter", "Notification","$state",
            function ($scope, $rootScope, authService, dataService, $localStorage, $filter, Notification, $state) {

                // console.log("contactController");

                /**
                 * @property {string} default.admin     - /app/home/contact-us.html
                 *
                 * @type {string}
                 */
              //  $rootScope.contactsPath = "";

                /**
                 *
                 * @type {*}
                 */
                var modalContainer = $(".modals"),
                    htmlBody = $("html, body");

                /**
                 * Select date
                 *
                 * @type {[*]}
                 */
                $scope.subjects = [
                    "technical_question_platform_remark"
                    , "ultrasound_related_question_for_expert"
                    , "question_about_certification"
                    , "request_linking_of_supervisor"
                    , "other"
                ];
               
                /**
                 * Reset contacts filed
                 *
                 * @name reset()
                 * @function
                 * @type {{name: null, email: null, subject: null, message: null}}
                 */
                var resetFiled = function () {
                    $scope.contact = {
                        name: authService.isAuth() ? authService.getCurrentUserGenderName() : null,
                        email: authService.isAuth() ? $localStorage.user.username : null,
                        subject: null,
                        message: null
                    };
                };

                /**
                 * Contact Us form open
                 *
                 * @name contactUs()
                 * @function
                 */
                $rootScope.contactUs = function () {
                    modalContainer.show();
                    htmlBody.addClass("open-modal");
                    console.log("contactUs()");
                    resetFiled();

                    $rootScope.contactsPath = "/app/home/contact-us.html";
                };

                /**
                 * Cancel or close modal contacts
                 *
                 * @name cancel()
                 * @function
                 */

                $scope.cancelReport = function () {
                    modalContainer.hide();
                    htmlBody.removeClass("open-modal");
                    $rootScope.contactsPath = "";
                    console.log("cancelReport");
                };
                $scope.sendReport = function () {
                    $scope.$$childHead.report.SubmissionId = $rootScope.submission;
                    console.log($rootScope);
                    dataService.reportSubmission($scope.$$childHead.report).then(function (response) {
                        if (response.data) {
                            $scope.cancelReport();
                            Notification.success(
                                {
                                    message: $filter('translate')("submission_has_been_reported")
                                }
                            );
                            $state.go("teacher.reviews");
                        }
                    });
                  
                }
                $scope.cancel = function () {
                    modalContainer.hide();
                    htmlBody.removeClass("open-modal");
                    console.log("cancel");
                    resetFiled();

                    $rootScope.contactsPath = "";
                };

                /**
                 * Send for contacts
                 *
                 * @name send()
                 * @function
                 */
                $scope.send = function () {
                    if ($scope.$$childHead.contactForm.$valid) {
                        return dataService.sendSupportMessage($scope.contact)
                            .then(function (response) {
                                    Notification.success(
                                        {
                                            message: $filter('translate')("your_message_has_been_submitted_thank_you_for_contacting_us_you_can_expect_a_response_within_5_days")
                                        }
                                    );
                                    // console.log("Email was successfuly sent");
                                    $scope.cancel();
                                }, function (error) {
                                    // console.error(error);
                                }
                            )
                    }
                };
            }]);
}(angular));