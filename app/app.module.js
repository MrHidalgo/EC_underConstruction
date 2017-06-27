
(function (angular) {

	"use strict";

	var modules = [
        "ngdicomviewer",
        "oc.lazyLoad",
        "ui.router",
        "ngSanitize",
        "ui.bootstrap",
        "ngStorage",
        "pascalprecht.translate",
        "Eportfolio.home",
        "Eportfolio.account",
        "Eportfolio.teacher",
        "Eportfolio.student",
        "Eportfolio.admin",
        'ngIdle'

	];

	angular.module("Eportfolio", modules);

})(angular);