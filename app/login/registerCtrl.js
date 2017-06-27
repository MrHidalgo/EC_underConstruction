(function () {
    'use strict';

    angular
        .module('Eportfolio')
        .controller('registerCtrl', ['$scope', '$location', 'dataService', "$uibModal", function ($scope, $location, dataService, $uibModal) {
            // $scope.error = "";
            // $scope.emailExist = false;
            // $scope.loading = false;
            //
            // function init() {
            //     getSpecialities();
            //     getLevels();
            //     getHospitals();
            //     getCountries();
            //     getTitles();
            // }
            //
            // init();
            //
            // function getSpecialities() {
            //     return dataService.getSpecialities().then(function (response) {
            //         $scope.specialities = response.data;
            //         return $scope.specialities;
            //     });
            // }
            //
            // function getLevels() {
            //     return dataService.getLevels().then(function (response) {
            //         $scope.levelOfTainings = response.data;
            //         return $scope.levelOfTainings;
            //     });
            // }
            // function getTitles() {
            //     dataService.getUserTitles().then(function (data) {
            //         $scope.userTitles = data.data;
            //         return $scope.userTitles;
            //     });
            // }
            // function getHospitals() {
            //     return dataService.getHospitals().then(function (response) {
            //         $scope.hospitals = response.data;
            //         return $scope.hospitals;
            //     });
            // }
            //
            // function getCountries() {
            //     return dataService.getCountries().then(function (response) {
            //         $scope.countries = response.data;
            //         return $scope.countries;
            //     });
            // }
            //
            // $scope.register = function () {
            //     $scope.loading = true;
            //     return dataService.registerUser($scope.user).then(function (response) {
            //         $scope.loading = false;
            //         if (response.data.Success) {
            //
            //             //todo add to message box
            //             $location.path('/login');
            //         }
            //         else if (response.data.Message.user_exist) {
            //
            //             $scope.userForm.email.$invalid = true;
            //             $scope.emailExist = true;
            //         }
            //         else {
            //             console.error(response.data.Message);
            //         }
            //
            //     }, function (error) {
            //
            //         console.error(error);
            //         return;
            //     });
            // };

            // $scope.backToLogin = function () {
            //     $location.path('/login');
            // };

            // $scope.contactUs = function () {
            //
            //     var modalInstance = $uibModal.open({
            //         templateUrl: "/app/home/contact-us.html",
            //         controller: "ContactUsCtrl"
            //     });
            // };
        }]);
})();