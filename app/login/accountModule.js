(function (angular) {

    "use strict";

    angular
        .module("Eportfolio.account", ["ui.router", "ui.bootstrap", 'ui-notification'])
        .config([
            "$stateProvider","NotificationProvider",
            function ($stateProvider, NotificationProvider) {
                $stateProvider
                    .state("login", {
                        title: "login",
                        url: "/login",
                        templateUrl: "app/login/login.html",
                        controller: "loginCtrl",
                        data: {
                            roles: []
                        }
                    })
                    .state("register", {
                        // title: "register",
                        // url: "/register",
                        // templateUrl: "app/login/register.html",
                        // controller: "registerCtrl"
                    })
                    .state("forgot", {
                        // title: "forgot password",
                        // url: "/forgot",
                        // templateUrl: "app/forgot-password/forgot-password.html",
                        // controller: "forgotPasswordCtrl"
                    })
                    .state("resetpwd", {
                        title: "change password",
                        url: "/resetpwd/{token}",
                        templateUrl: "app/change-password/change-password.html",
                        controller: "changePasswordCtrl",
                        data: {
                            roles: []
                        }
                    })
                    .state("confirm-register", {
                        title: "confirm registration",
                        url: "/confirm-register/{token}",
                        templateUrl: "app/confirm-register/confirm-register.html",
                        controller: "confirmRegisterCtrl",
                        data: {
                            roles: []
                        }
                    });

                NotificationProvider.setOptions({
                    delay: 10000,
                    startTop: 20,
                    startRight: 10,
                    verticalSpacing: 20,
                    horizontalSpacing: 20,
                    positionX: 'right',
                    positionY: 'top',
                });
            },
               
           
        ]);
}(angular));