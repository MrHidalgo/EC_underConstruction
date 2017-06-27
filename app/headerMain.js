(function (angular) {

    angular
        .module("Eportfolio")
        .controller("headerController", ["$scope", "$rootScope", "authService", "$translate", "$timeout", "$localStorage", "$state","Idle",
    function ($scope, $rootScope, authService, $translate, $timeout, $localStorage, $state,Idle) {

                // console.log("headerController");

                /**
                 * @property {string} defaults.header_light - /app/header/header_light.html
                 * @property {string} defaults.header       - /app/header/header.html
                 *
                 * @type {string}
                 */

                /**
                 * The Navigation Timing API [window.performance.navigation.type] provides data that can be used to measure the performance of a website.
                 * @returns {Number} 0   - Navigation started by clicking on a link, or entering the URL...
                 * @returns {Number} 1   - Navigation through the reload operation or the location.reload() method.
                 * @returns {Number} 2   - Navigation through a history traversal operation.
                 * @returns {Number} 255 - Any navigation types not defined by values above.
                 *
                 * @name IsReload()
                 * @constructor
                 */
                function IsReload() {
                    var result      = window.performance.navigation.type,
                        langCurr    = $localStorage.langBool || "en";

                    if (result === 1 || result === 0) {
                        $translate.use(langCurr);
                    }
                }
                IsReload();

                /**
                 *
                 * @type {string}
                 */
                $rootScope.headerPath = "";

                /**
                 * User name information
                 *
                 * @name userMainInfo()
                 * @function
                 * @returns {string}    User name & user type
                 */
                $rootScope.userMainInfo = function () {
                    $scope.userInfo = authService.getUserInfo();
                    $scope.userName = $scope.userInfo.userFirstName + " " + $scope.userInfo.userMiddleName + " " + $scope.userInfo.userSecondName + ", ";
                    $scope.userTypes = authService.getHeaderTypesNames();

                    return $scope.userName + " " + $scope.userTypes;
                };

                /**
                 *
                 * @type {*}
                 */
                $scope.currentLang = $localStorage.langBool || "en";

                /**
                 *
                 * @param language
                 */
                $rootScope.setLanguage = function (language) {
                    $translate.use(language);
                    $translate.refresh();
                    $timeout(function () {
                        // console.log()
                    }, 5000);

                    $localStorage.langBool = language;
                    $scope.currentLang = $localStorage.langBool;
                  

                };
                /**
                 * Sign Out
                 *
                 * @name logout()
                 * @function
                 */
                $scope.logout = function () {
                    $rootScope.headerPath = "/app/header/header_light.html";
                    $rootScope.menuPath = "/app/menu/menu_light.html";

                    //$localStorage.langBool = null;

                    authService.logOut();

                    Idle.unwatch();
                };

                /**
                 * Edit profile
                 *
                 * @name editProfile()
                 * @function
                 */
                $scope.editProfile = function () {
                    authService.goTo('editprofile', true);
                };

                if (authService.isAuth() === false) {
                    $rootScope.headerPath = "/app/header/header_light.html";
                } else {
                    $rootScope.userMainInfo();
                    $rootScope.headerPath = "/app/header/header.html";
                }

                $scope.showProfile = showProfile;

                /**
                 * Show student or teacher profile
                 *
                 * @name showProfile()
                 * @function
                 */
                function showProfile() {
                    var currentRole = $scope.userTypes;

                    if (currentRole.trim(" ") === "Teacher") {
                        $state.go("teacher.profile");
                    } else if (currentRole.trim(" ") === "Student") {
                        $state.go("student.profile");
                    }
                }
            }]);
}(angular));