(function () {
    'use strict';
    angular
        .module('Eportfolio')
        .controller('conditions', ['$scope', '$uibModalInstance', '$uibModal', 'item', function conditions($scope, $uibModalInstance, $uibModal, item) {

            $scope.cancel = function () {
                $uibModalInstance.close();
            }
        }]);
})();