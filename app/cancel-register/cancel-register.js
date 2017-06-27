(function () {
    'use strict';
    angular
        .module('Eportfolio')
        .controller('cancelRegister', ['$scope', '$uibModalInstance', '$uibModal',
            function ($scope, $uibModalInstance, $uibModal) {

            $scope.yes = function () {
                $uibModalInstance.close(true);
                
            }
            $scope.no = function () {
                $uibModalInstance.dismiss(false);
            }
        }]);
})();