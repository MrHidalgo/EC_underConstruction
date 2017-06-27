(function (angular) {

    "use strict";
    angular
    .module("Eportfolio.student").
    directive("attachment", function () {
        return {
            restrict: "AE",
            template: "<b>Hello world</b>",
            controller: function (scope) {
                // console.log("true");
            }
        }
    })
})