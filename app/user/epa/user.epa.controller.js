(function (angular) {

    "use strict";

    var controller = function ($scope, $state, $stateParams, $localStorage) {


    };

    controller.$inject = ["$scope", "$state", "$stateParams", "$localStorage"];

    angular
        .module("Eportfolio.student")
        .controller("student.epa.controller", controller);
    angular
       .module("Eportfolio.teacher")
       .controller("teacher.epa.controller", controller);

}(angular));