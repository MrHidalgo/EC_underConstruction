(function (angular) {

	"use strict";

	function controller($scope, $state, $stateParams, $localStorage) {};

	controller.$inject = ["$scope", "$state", "$stateParams", "$localStorage"];

	angular
    .module("Eportfolio.teacher")
    .controller("teacher.dashboard.controller", controller);
	angular
        .module("Eportfolio.student")
        .controller("student.dashboard.controller", controller);

}(angular));