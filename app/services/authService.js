'use strict';
(function () {

    angular
        .module('Eportfolio')
        .factory('authService', AuthService)
        .run(['authService', function (authService) {
            authService.fillAuthData();
        }]);

    AuthService.$inject = ['$http', '$q', '$localStorage', '$exceptionHandler', 'appSettings', '$state', '$rootScope'];

    function AuthService($http, $q, $localStorage, $exceptionHandler, appSettings, $state, $rootScope) {
        var serviceBase = appSettings.serviceUrl;

        var authentication = {
            isAuth: false,
            id: "",
            email: "",
            name: "",
            accessToken: null
        };

        return {
            login: login,
            logOut: logOut,
            fillAuthData: fillAuthData,
            authentication: authentication,
            isAuth: isAuth,
            userDbGridData: userDbGridData,
            getLogedUserRoles: getLogedUserRoles,
            getCurrentUserHospital: getCurrentUserHospital,
            getCurrentUserSpeciality: getCurrentUserSpeciality,
            getCurrentUserGenderName: getCurrentUserGenderName,
            isAdmin: isAdmin,
            hasUltrasoundType: hasUltrasoundType,
            isUsStudent: isUsStudent,
            isUsTeacher: isUsTeacher,
            getHeaderTypesNames: getHeaderTypesNames,
            getUserInfo: getUserInfo,
            isPTeacher: isPTeacher,
            isPStudent: isPStudent,
            goTo: goTo,
            checkHome: checkHome,
            isStudent: isStudent,
            isTeacher: isTeacher,
            updateUser: updateUser,
            getUserRole: getUserRole,
            isExpired: isExpired,
            isCollegeUser: isCollegeUser,
            isCollegeTeacher: isCollegeTeacher
            //  checkPermissions:checkPermissions
        };


        function logOut() {

            $localStorage.accessToken = null;
            $localStorage.user = null;
            $localStorage.userRoles = [];
            authentication.isAuth = false;
            authentication.id = "";
            authentication.name = "";
            authentication.email = "";
            authentication.accessToken = null;
            $localStorage.langBool = null;
            console.log($rootScope.isUsTeacher + " teacher US");
            console.log($rootScope.isteacherCollege + "teacher college");
            $state.go("login");
        };


        function login(loginData) {
            var data = "grant_type=password&username=" + loginData.userName + "&password=" + escape(loginData.password);


            function successCallback(response) {
                if (!response || !response.data.access_token) {
                    // console.log(response);
                    //$exceptionHandler(error.create("Unable to login", "Server error"), "Login User");
                    return response;
                }
                authentication.isAuth = true;
                authentication.name = response.name;
                authentication.email = loginData.username;
                authentication.id = response.id;
                authentication.accessToken = response.data.access_token;

                $localStorage.userRoles = JSON.parse(response.data.userRoles);
               console.log($localStorage.userRoles);
                $localStorage.accessToken = response.data.access_token;
                $localStorage.user = {
                    username: response.data.userEmail,
                    userGenderName: response.data.userGenderName,
                    userFirstName: response.data.userFirstName,
                    userMiddleName: response.data.userMiddleName,
                    userSecondName: response.data.userSecondName,
                    userSpeciality: JSON.parse(response.data.userSpeciality),
                    userHospital: JSON.parse(response.data.userHospital),
                    userExpired: JSON.parse(response.data.userExpired)
                };

                $rootScope.setLanguage(response.data.userLanguage);
                $localStorage.$apply();
             
                return true;
            };

            function errorCallback(response) {
                // console.log(response+"error");
                logOut();
                return response;
            };

            var url = serviceBase + 'token';


            return $http.post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback);
        }

        function fillAuthData() {
            var authData = null;
            if (authData) {
                authentication.isAuth = true;
                authentication.name = authData.name;
                authentication.id = authData.id;
                authentication.email = authData.email;
            }
        };
        function updateUser(user) {
            $localStorage.user = {
                username: user.Email,
                userGenderName: user.Title,
                userFirstName: user.Name,
                userMiddleName: user.MiddleName,
                userSecondName: user.Surname,
                userSpeciality: user.Speciality,
                userHospital: user.Hospital
            };
            $localStorage.$apply();
        }

        function userDbGridData() {

            return $http({
                method: 'GET',
                url: appSettings.serviceUrl + "api/admin/GetDataforUserDb"

            });
        }

        function isAuth() {
            return $localStorage.accessToken != null;
        };

        function getLogedUserRoles() {
            return $localStorage.userRoles;
        }

        function getCurrentUserHospital() {
            if ($localStorage.user != null) {
                return $localStorage.user.userHospital;
            }
            return null;
        }

        function getCurrentUserSpeciality() {
            if ($localStorage.user != null) {
                return $localStorage.user.userSpeciality;
            }
            return null;
        }

        function getCurrentUserGenderName() {
            if ($localStorage.user != null) {
                return $localStorage.user.userMiddleName + " " + $localStorage.user.userSecondName + ", " + $localStorage.user.userGenderName;
            }
            return null;
        }

        function isAdmin() {
            return $localStorage.userRoles.admin;
        }

        function hasUltrasoundType() {
            return $localStorage.userRoles.studentUltasound
                || $localStorage.userRoles.teacherUltasound;
        }

        function isUsStudent() {
            return $localStorage.userRoles.studentUltasound;
        }
        function isCollegeUser() {
            return $localStorage.userRoles.studentCollege || $localStorage.userRoles.teacherCollege;
        }

        function isUsTeacher() {
            return $localStorage.userRoles.teacherUltasound;
        }

        function isPTeacher() {
            return $localStorage.userRoles.teacherPortfolio;
        }

        function isPStudent() {
            return $localStorage.userRoles.studentPortfolio;
        }

        function isTeacher() {
            return $localStorage.userRoles.teacherPortfolio || $localStorage.userRoles.teacherUltasound ;
        }

        function isStudent() {
            return $localStorage.userRoles.studentPortfolio || $localStorage.userRoles.studentUltasound || $localStorage.userRoles.studentCollege;
        }
        function isCollegeTeacher() {
            return $localStorage.userRoles.teacherCollege;
        }

        function getHeaderTypesNames() {
            var names = '';

            if ($localStorage.userRoles.admin)
                names += "Admin ";
            if ($localStorage.userRoles.studentPortfolio || $localStorage.userRoles.studentUltasound || $localStorage.userRoles.studentCollege)
                names += "Student ";
            if ($localStorage.userRoles.teacherPortfolio || $localStorage.userRoles.teacherUltasound || $localStorage.userRoles.teacherCollege)
                names += "Teacher ";

            return names;
        }

        function getUserInfo() {
            return $localStorage.user;
        }


        function goTo(name, checkType) {
            if (checkType) {
                if (isTeacher()) {
                    $state.go('teacher.' + name);
                } else if (isStudent()) {
                    $state.go('student.' + name);
                }
                return;
            }
            $state.go(name);
            return;
        }
        function setStatate(userRoles) {
            var statename;
            var teacherPortfolio = userRoles.teacherPortfolio;
            var teacherUS = userRoles.teacherUltasound;
            var studentPortfolio = userRoles.studentPortfolio;
            var studentCollege = userRoles.studentCollege;
            var studentUS = userRoles.studentUltasound;
            if (teacherPortfolio || teacherUS || userRoles.teacherCollege) {
                statename = "teacher.profile";

            }
            if (studentUS || studentPortfolio || studentCollege) {
                statename = "student.profile";
            }
            return statename;
        }
        function isExpired() {
            var maygo = true;
            if ($localStorage.user !=null) {
                if ($localStorage.user.userExpired) {
                    maygo = false;
                }
            }
            return maygo;
        }
        function checkHome() {
          //  console.log("expired " + $localStorage.user.userExpired);
            if ($localStorage.user.userExpired) {
                var statename = setStatate($localStorage.userRoles);
                $rootScope.headerPath = "/app/header/header.html";
                $rootScope.menuPath = "/app/menu/menu_light.html";
                $state.go(statename);
            }
            else {
                $rootScope.headerPath = "/app/header/header.html";
                $rootScope.menuPath = "/app/menu/menu.html";
                $rootScope.userMainInfo();

                /**
                 *
                 * @type {*}
                 */
                var teacherPortfolio = $localStorage.userRoles.teacherPortfolio;
                var teacherUS = $localStorage.userRoles.teacherUltasound;
                var studentPortfolio = $localStorage.userRoles.studentPortfolio;
                var studentUS = $localStorage.userRoles.studentUltasound;
                var studentCollege = $localStorage.userRoles.studentCollege;
                var teacherCollege = $localStorage.userRoles.teacherCollege;
                if (teacherPortfolio && teacherUS) {
                    $rootScope.isPTeacher = true;
                    $rootScope.isUsTeacher = true;
                } else if (teacherPortfolio) {
                    $rootScope.isPTeacher = true;
                } else if (teacherUS) {
                    $rootScope.isUsTeacher = true;
                }

                if (studentPortfolio && studentUS) {
                    $rootScope.isPStudent = true;
                    $rootScope.isUsStudent = true;
                } else if (studentPortfolio) {
                    $rootScope.isPStudent = true;
                } else if (studentUS) {
                    $rootScope.isUsStudent = true;
                }
                else if (studentCollege) {
                    $rootScope.isCollegeUser = true;
                }
                else if (teacherCollege) {
                   
                    $rootScope.isteacherCollege = true;
                }

                if ($localStorage.userRoles.studentUltasound) {
                    // console.log("student.submission");

                    $rootScope.menuRole = "/app/student/student-menu.html";
                    $state.go("student.submission");
                } else if ($localStorage.userRoles.teacherUltasound) {
                    // console.log("teacher.dashboard");

                    $rootScope.menuRole = "/app/teacher/teacher-menu.html";
                    $state.go("teacher.dashboard");
                } else if ($localStorage.userRoles.admin) {
                    // console.log("admin.userdb");

                    $rootScope.menuRole = "/app/admin/admin-menu.html";
                    $state.go("admin.userdb");
                } else if ($localStorage.userRoles.teacherPortfolio) {
                    // console.log("teacher.profile");

                    $rootScope.menuRole = "/app/teacher/teacher-menu.html";
                    $state.go("teacher.profile");
                }
                else if ($localStorage.userRoles.studentCollege) {
                    $rootScope.menuRole = "/app/student/student-menu.html";
                    $state.go("student.collegeSubmission");
                }
                else if ($localStorage.userRoles.teacherCollege) {
                    $rootScope.menuRole = "/app/teacher/teacher-menu.html";
                    $state.go("teacher.collegedashboard");
                }
                else { //studentPortfolio
                    // console.log("student.dashboard");

                    $rootScope.menuRole = "/app/student/student-menu.html";
                    $state.go("student.dashboard");
                }
            }
        }
        function getUserRole() {
            var userRoles = {};

            if ($localStorage.userRoles === undefined) {
                return userRoles;
            }
            if ($localStorage.userRoles.studentPortfolio || $localStorage.userRoles.studentUltasound || $localStorage.userRoles.studentCollege) {
                var userRoles = "Student";
                return userRoles;
            }
            if ($localStorage.userRoles.teacherPortfolio || $localStorage.userRoles.teacherUltasound || $localStorage.userRoles.teacherCollege) {
                var userRoles = "Teacher";
                return userRoles;
            }
            if ($localStorage.userRoles.admin) {
                var userRoles = "Admin";
                return userRoles;
            }
            if (!isExpired()) {
                var userRoles = "Expired";
                return userRoles;
            } 
            return userRoles;
        }
    };
})();

