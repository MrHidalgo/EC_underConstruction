(function (angular) {

    "use strict";

    var controller = function ($scope, $uibModalInstance, fileGroup, config, $timeout) {

        $scope.close = close;
        $scope.fileGroup = fileGroup;
     //  $scope.urls = "https://portfoliofiles.blob.core.windows.net/submission-history/6ae00799-a22f-4a10-88de-6c2b80f15e10/c82b5f41-43fc-48fb-9646-8903c2a74c42/2f87a2e9-578e-49e3-be6d-473030b1e129.dcm";
        $scope.urls = "";
       angular.forEach(fileGroup, function (group) {
       
           console.log(group.Filepath + " " + " ");
            $scope.urls = $scope.urls + group.Filepath + ";";
       });
       console.log($scope.urls);
       $timeout(function () {
           angular.element('#openUrls').triggerHandler('click');
       });
      
        function close() {
            $uibModalInstance.close();
        };
    };
   
  //  angular.element('#openUrls').triggerHandler('click');
    controller.$inject = ["$scope", "$uibModalInstance", "fileGroup", "config", "$timeout"];

    angular
        .module("Eportfolio")
        .controller("MediaPopupDicomController", controller);

}(angular));