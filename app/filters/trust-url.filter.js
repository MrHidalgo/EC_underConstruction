(function (angular) {

    "use strict";

    angular
        .module("Eportfolio")
        .filter("trustUrl", ['$sce', function ($sce) {
            return function (recordingUrl) {
                return $sce.trustAsResourceUrl(recordingUrl);
            };
        }]);

}(angular));