(function () {

    "use strict";
    angular
      .module('Eportfolio.student')
      .controller('forms-number.controller', ['$window', '$state', '$scope', '$uibModal', 'formService', function ($window, $state, $scope, $uibModal, formService) {

          formService.GetProcedures().then(function (response) {
              if (!response.data) {

              } else {


                  $scope.procedures = response.data;

              }
          });

      }]);

})();