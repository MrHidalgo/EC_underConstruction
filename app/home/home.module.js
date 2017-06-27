(function (angular) {

    "use strict";

    angular
        .module("Eportfolio.home", ["ui.router"])
        .config([
            "$stateProvider",
            function ($stateProvider) {
                $stateProvider
                    .state("home", {
                        "abstract": true,
                        "views": {
                            "": {
                                templateUrl: "app/main/main-layout.html"
                            },
                            "header@home": {
                                templateUrl: "app/home/header.html",
                                controller: "headerCtrl"
                            },
                            "menu@home": {
                                templateUrl: "app/home/header.html"
                                // controller: "header"
                            },
                            "footer@home": {
                                templateUrl: "app/home/footer.html"
                                //controller: "footer"
                            }
                        },
                        data: {
                            roles: []
                        }
                    })
                    .state("main", {
                        parent: "home",
                        url: "/home",
                        views: {
                            "content@home": {
                                template: "",
                                controller: "homeCtrl"
                            }
                        },
                        data: {
                            roles: []
                        }
                    });
            }
        ]);

}(angular));