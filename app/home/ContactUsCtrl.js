(function () {
    'use strict';

    angular
        .module('Eportfolio')
        .controller('ContactUsCtrl', ['$scope', '$uibModalInstance', 'dataService', 'authService',
        function ($scope, $uibModalInstance, dataService, authService) {

            // $scope.subjects = [
            //         "Technical question platform remark"
            //         , "Expertfolio related question for expert"
            //         , "Question about certification"
            //         , "Other"
            // ];
            //
            // $scope.contact = {
            //     name: authService.isAuth() ? getCurrentUserGenderName() : null,
            //     email: authService.isAuth() ? authService.authentication.email : null,
            //     subject: null,
            //     message: null
            // };

            // $scope.cancel = function () {
            //     $uibModalInstance.dismiss(false);
            // };
            //
            // $scope.send = function () {
            //     if ($scope.contactForm.$valid) {
            //         $scope.loading = true;
            //       return  dataService.sendSupportMessage($scope.contact)
            //             .then(
            //                 function (response) {
            //                     $scope.loading = false;
            //                     console.log("Email was successfuly sent");
            //                     $uibModalInstance.close(false);
            //                 },
            //                 function (error) {
            //                     $scope.loading = false;
            //                 }
            //             )
            //     }
            // }

        }]);

})();