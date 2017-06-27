(function () {
    'use strict'
    //var controller = function ($scope) {
    //    //$scope.messages = 
    //};

    //controller.$inject = ["$scope"];

    angular.module('Eportfolio')
        .directive('messageBox', function() {
            return {
                restrict: 'AE',
                templateUrl: 'app/directives/message-box/message-box.html',
                replace: true
            }
        });
})