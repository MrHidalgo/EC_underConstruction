(function (angular) {

    "use strict";

    var controller = function ($scope, $uibModalInstance, file, config) {
        
        $scope.close = close;
        $scope.file = file;
        // console.log($scope.file);
        //$scope.blobUrl = config.blobUrl;
        function close() {
            $uibModalInstance.close();
        };
    };

    controller.$inject = ["$scope", "$uibModalInstance", "file", "config"];

    angular
        .module("Eportfolio")
        .controller("MediaPopupController", controller);

}(angular));