(function (angular) {

    "use strict";

    angular
        .module("Eportfolio.admin", ["ui.router", "ngSanitize", "kendo.directives"])
        .config([
            "$stateProvider",
            function ($stateProvider) {
                $stateProvider
                    .state("admin", {
                        parent: "home",
                        abstract: true,
                        views: {
                            "": {
                                templateUrl: "app/main/main-layout.html"
                            },
                            "menu@home": {
                                templateUrl: "app/admin/admin-menu.html",
                                controller: "admin.menu.controller"
                            }
                        }, data: {
                            roles: ["Admin"]
                        }
                    })
                    .state("admin.userdb", {
                        parent: "admin",
                        title: "userdb",
                        url: "/admin-userDb",
                        views: {
                            "content@home": {
                                templateUrl: "app/admin/admin-userdb.html",
                                controller: "admin-user-db.controller"
                            }
                        },
                        params: { submissionId: null, returnState: null },
                        data: {
                            roles: ["Admin"]
                        }
                    })
                     .state("admin.formmanager", {
                         parent: "admin",
                         title: "formmanager",
                         url: "/admin-submission-summary",
                         views: {
                             "content@home": {
                                 templateUrl: "app/admin/form-manager.html",
                                 controller: "adminformmanagerCtrl"
                             }
                         },
                         params: { submission: null },
                         data: {
                             roles: ["Admin"]
                         },
                     })
                 .state("admin.us-manager", {
                     parent: "admin",
                     title: "us-manager",
                     url: "/admin-us-manager",
                     views: {
                         "content@home": {
                             templateUrl: "app/admin/us-manager.html",
                             controller: "admin-us-manger.controller"
                         }
                     },
                     params: { submission: null },
                     data: {
                         roles: ["Admin"]
                     }
                 })
                .state("admin.upload-manager", {
                    parent: "admin",
                    title: "upload-manager",
                    url: "/admin-upload-manager",
                    views: {
                        "content@home": {
                            templateUrl: "app/admin/upload-manager.html",
                            controller: "admin-upload-manger.controller"
                        }
                    },
                    params: { submission: null },
                    data: {
                        roles: ["Admin"]
                    }
                });

            }
        ]);

}(angular));