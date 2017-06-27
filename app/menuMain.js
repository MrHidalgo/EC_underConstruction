(function (angular) {

    angular
        .module("Eportfolio")
        .controller("menuController",
            ["$scope", "$rootScope", "authService", "$localStorage", "$state",
                function ($scope, $rootScope, authService, $localStorage, $state) {

                    // console.log("menuController");
                    $rootScope.loading = false;
                    /**
                     * @property {string} defaults.menu_light - /app/menu/menu_light.html
                     * @property {string} defaults.menu       - /app/menu/menu.html
                     *
                     * @type {string}
                     */
                    $rootScope.menuPath = "/app/menu/menu_light.html";

                    /**
                     * @property {string} default.admin     - /app/admin/admin-menu.html
                     * @property {string} default.teacher   - /app/teacher/teacher-menu.html
                     * @property {string} default.student   - /app/student/student-menu.html
                     *
                     * @type {string}
                     */
                    $rootScope.menuRole = "";

                    /**
                     * Link location href
                     *
                     * @type {*|Object}
                     */
                    $scope.location = $localStorage;

                    /**
                     * Link location href
                     *
                     * @type {*|Object}
                     */
                    $scope.state = $state;

                    if (authService.isAuth() === false) {
                        $rootScope.menuPath = "/app/menu/menu_light.html";
                    } else {
                        $rootScope.menuPath = "/app/menu/menu.html";
                    }

                    // console.log("$localStorage.userRoles: ", $localStorage.userRoles);


                    if($localStorage.userRoles !== undefined) {

                        /**
                         * @type {boolean}
                         */
                        $scope.teacherPortfolio = $localStorage.userRoles.teacherPortfolio;
                        $scope.teacherUS        = $localStorage.userRoles.teacherUltasound;
                        $scope.studentPortfolio = $localStorage.userRoles.studentPortfolio;
                        $scope.studentUS = $localStorage.userRoles.studentUltasound;
                        $scope.studentCollege = $localStorage.userRoles.studentCollege;
                        $scope.teacherCollege = $localStorage.userRoles.teacherCollege;
                        /**
                         *
                         * @type {boolean}
                         */
                        $rootScope.isPTeacher   = false;
                        $rootScope.isUsTeacher  = false;
                        $rootScope.isPStudent   = false;
                        $rootScope.isUsStudent  = false;
                        $rootScope.isCollegeUser = false;
                        $rootScope.isteacherCollege = false;
                        if($scope.teacherPortfolio && $scope.teacherUS) {
                            $rootScope.isPTeacher   = true;
                            $rootScope.isUsTeacher  = true;
                        } else if ($scope.teacherPortfolio) {
                            $rootScope.isPTeacher   = true;
                        } else if ($scope.teacherUS) {
                            $rootScope.isUsTeacher  = true;
                        }

                        if($scope.studentPortfolio && $scope.studentUS) {
                            $rootScope.isPStudent   = true;
                            $rootScope.isUsStudent  = true;
                        } else if ($scope.studentPortfolio) {
                            $rootScope.isPStudent   = true;
                        } else if ($scope.studentUS) {
                            $rootScope.isUsStudent  = true;
                        }
                        else if ($scope.studentCollege) {
                          
                            $rootScope.isCollegeUser = true;
                        }
                        else if ($scope.teacherCollege) {

                            $rootScope.isteacherCollege = true;
                        }

                        if ($localStorage.userRoles.studentUltasound || $scope.studentCollege) {
                            $rootScope.menuRole = "/app/student/student-menu.html";
                        } else if ($localStorage.userRoles.teacherUltasound) {
                            $rootScope.menuRole = "/app/teacher/teacher-menu.html";
                        } else if ($localStorage.userRoles.admin) {
                            $rootScope.menuRole = "/app/admin/admin-menu.html";
                        } else if ($localStorage.userRoles.teacherPortfolio) {
                            $rootScope.menuRole = "/app/teacher/teacher-menu.html";
                        } else if ($localStorage.userRoles.teacherCollege) {
                            $rootScope.menuRole = "/app/teacher/teacher-menu.html";
                        }
                        else {
                            $rootScope.menuRole = "/app/student/student-menu.html";
                        }
                    } else {
                        $state.go("login");
                    }
                }]);
}(angular));