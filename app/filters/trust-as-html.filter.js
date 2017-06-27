(function (angular) {

    "use strict";

    angular
        .module("Eportfolio")
        .filter("trustAsHtml", ['$sce', function ($sce) {
            return function (htmlContent) {
                return $sce.trustAsHtml(htmlContent);
            };
        }]);

}(angular));