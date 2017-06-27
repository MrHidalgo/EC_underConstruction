(function (angular, window) {

    "use strict";
    angular
    .module("Eportfolio")
    .config([
        '$ocLazyLoadProvider',
            "$provide",
            '$qProvider',
            "$compileProvider",
            "$stateProvider",
            "$urlRouterProvider",
            "$httpProvider",
            "$logProvider",
            "$locationProvider",
            "$translateProvider",
            'KeepaliveProvider',
            'IdleProvider',
            function (
                    $ocLazyLoadProvider,
                    $provide,
                    $qProvider,
                    $compileProvider,
                    $stateProvider,
                    $urlRouterProvider,
                    $httpProvider,
                    $logProvider,
                    $locationProvider,
                    $translateProvider, KeepaliveProvider, IdleProvider) {
                $urlRouterProvider.otherwise("/home");
                $qProvider.errorOnUnhandledRejections(false);
                $translateProvider.useUrlLoader('http://eportfolio-api.azurewebsites.net' + '/api/Translate/Get');
                $translateProvider.useSanitizeValueStrategy("sanitize");
                //IdleProvider.idle(5);
                //IdleProvider.timeout(5);
                //KeepaliveProvider.interval(10);
                IdleProvider.idle(1800);
                IdleProvider.timeout(30);
                KeepaliveProvider.interval(300);
                $ocLazyLoadProvider.config({
                    debug: true,
                    events: true
                });
            }
    ]);

})(angular, window);

