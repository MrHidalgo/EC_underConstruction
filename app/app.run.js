(function (angular, undefined) {

    "use strict";

    angular
        .module("Eportfolio")
        .factory('beforeUnload', function ($rootScope, $window) {
            // Events are broadcast outside the Scope Lifecycle

            $window.onbeforeunload = function (e) {
                var confirmation = {};
                var event = $rootScope.$broadcast('onBeforeUnload', confirmation);
                if (event.defaultPrevented) {
                    return confirmation.message;
                }
            };

            $window.onunload = function () {
                $rootScope.$broadcast('onUnload');
            };
            return {};
        })

        .run([
                "$rootScope",
                "$document",
                "$http",
                "$state",
                "$localStorage",
                '$log',
                "authService",
                "dataService",
                "config",
                "beforeUnload",
                "Idle",
              // "$uibModal",
                "Notification",
                "$filter",
        function (
                $rootScope,
                $document,
                $http,
                $state,
                $localStorage,
                $log,
                authService,
                dataService,
                config,
                beforeUnload,
                 Idle,
           // $uibModal
                Notification,
               $filter
        ) {

            $rootScope.$on("IdleStart", IdleStart);
            $rootScope.$on("IdleEnd", IdleEnd);
            $rootScope.$on("IdleTimeout", IdleTimeout);

            $rootScope.$on("$stateChangeStart", stateChangeStart);
            $rootScope.$on("$stateChangeSuccess", stateChangeSuccess);

            angular.isNullUndefinedOrWhitespace = $rootScope.isNullUndefinedOrWhitespace = function (value) {
                return angular.isUndefined(value) || value === null || value.toString().trim() === "";
            };

            angular.isNullOrUndefined = $rootScope.isNullOrUndefined = function (value) {
                return angular.isUndefined(value) || value === null;
            };

            angular.IsNullOrEmpty = function (value) {
                var isNullOrEmpty = true;
                if (value) {
                    if (typeof (value) == 'string') {
                        if (value.length > 0)
                            isNullOrEmpty = false;
                    }
                }
                return isNullOrEmpty;
            }

            angular.toLocalDate = $rootScope.toLocalDate = function (value) {
                return new Date(value);
            };

            function checkRoles(state) {

                var rest = authService.getUserRole();
                var mayGo = false;
                if (angular.equals(rest, {})) {
                    mayGo = true;
                    return mayGo;
                }
                for (var item in state.data.roles) {
                    if (rest == state.data.roles[item]) {
                        mayGo = true;
                    }
                }

                return mayGo;
            }

            function IdleStart() {
            }

            function IdleEnd() {
            }

            function IdleTimeout() {
                authService.logOut();
                Idle.unwatch();
                Notification.warning({ message: $filter('translate')("your_session_is_expired") });
            }

            function stateChangeStart(event, toState) {
                var isLogin = toState.name !== "login"
                            && toState.name !== "register"
                            && toState.name !== "confirm-register"
                            && toState.name !== "forgot"
                            && toState.name !== "resetpwd"
                            && !authService.isAuth();

                if (isLogin) {
                    event.preventDefault();
                    $state.go("login");

                } else if (toState.name === "login" && authService.isAuth()) {
                    if (!checkRoles(toState)) {
                        event.preventDefault();
                    }
                    event.preventDefault();
                    authService.checkHome();


                } else if (toState.name === "main") {

                    if (!checkRoles(toState)) {


                        event.preventDefault();
                    }

                    event.preventDefault();
                    authService.checkHome();
                }
                else if (!isLogin && !checkRoles(toState)) {
                    event.preventDefault();
                }

            };

            /**
             *
             * @param event
             * @param toState
             */
            function stateChangeSuccess(event, toState) {

                if (toState.title) {
                    //todo add title
                }

                $localStorage.currentState = toState.name;
                $localStorage.$apply();
            }

            angular.isVideoFile = $rootScope.isVideoFile = function (filename) {

                if (!filename) {
                    return false;
                }

                var extensionIndex = filename.lastIndexOf(".");
                var extension = filename.slice(extensionIndex + 1).toLowerCase();
                var videoExtensions = config.videoExtensions.split(" ");

                return _(videoExtensions).contains(extension);
            };

            angular.hasLocalVideoPreview = $rootScope.hasLocalVideoPreview = function (filename) {
                if (!filename) {
                    return false;
                }

                var extensionIndex = filename.lastIndexOf(".");
                var extension = filename.slice(extensionIndex + 1).toLowerCase();

                return extension == "mp4";
            };
            /**
             *
             */
            $rootScope.resizeTableUploadHistory = function () {
                /**
                 *
                 * @param nameNode
                 */
                function addStyleWidth(nameNode) {
                    nameNode.each(function (idx, val) {
                        $(val).css({
                            "width": tableCellWidthArr[idx]
                        });
                    });
                }

                var tableHiddenCell = $(".upload--history__table-header tr th"),
                    tableCellWidthArr = [],
                    filterBlock = $(".upload--history__filter--block"),
                    headerBlock = $(".upload--history__header--block");

                tableHiddenCell.each(function (idx, val) {
                    var valWidth = $(val).outerWidth(true);

                    tableCellWidthArr.push(valWidth);
                });

                if ($(window).width() > '1024') {
                    addStyleWidth(filterBlock);
                }
                addStyleWidth(headerBlock);
            };

            $rootScope.$on('$translateChangeEnd', function () {
                if ($(window).width() > '767') {
                    $rootScope.resizeTableUploadHistory();
                }
            });
        }]);

})(angular);