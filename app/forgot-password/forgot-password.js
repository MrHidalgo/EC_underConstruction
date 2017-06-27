(function () {
    'use strict';

    angular
        .module('Eportfolio')
        .controller('forgotPasswordCtrl', ['$scope', 'dataService', '$location', '$uibModal', function ($scope, dataService, $location, $uibModal) {
            // $scope.loading = false;
            
            // $scope.sendEmail = function () {
            //     $scope.loading = true;
            //     return dataService.sendEmailToReset($scope.email).then(function (response) {
            //         $scope.loading = false;
            //         if (response.data.Success == true)
            //         {
            //             console.debug(response.data.Message);
            //             //todo add to message box
            //             $location.path("/login");
            //
            //         }
            //         else
            //         {
            //             //todo add to message box
            //             console.error(response.data.Message)
            //         }
            //
            //     }, function (error) {
            //         $scope.loading = false;
            //         console.error(error);
            //         //todo add to message box
            //     })
            // }

            // $scope.contactUs = function () {
            //
            //     var modalInstance = $uibModal.open({
            //         templateUrl: "/app/home/contact-us.html",
            //         controller: "ContactUsCtrl"
            //     });
            // }

        }]);
})();
