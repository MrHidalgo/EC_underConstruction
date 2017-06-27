(function (angular) {

    "use strict";

    angular
        .module("Eportfolio.student", ["ui.router", "ngFileUpload",/* "chart.js", "daterangepicker",*/ "ngSanitize", "ui.select", "kendo.directives", "ui.bootstrap", 'ui-notification'])
        .config([
            "$stateProvider", "NotificationProvider",
            function ($stateProvider, NotificationProvider) {
                $stateProvider
                    .state("student", {
                        parent: "home",
                        abstract: true,
                        views: {
                            "": {
                                templateUrl: "app/main/main-layout.html"
                            },
                            "menu@home": {
                                templateUrl: "app/student/student-menu.html",
                                controller: "student.menu.controller"
                                //templateUrl: "app/ultrasound/student/student-menu.html",
                                //controller: "StudentMenuController"
                            }
                        }
                    })
                    .state("student.submission", {
                        parent: "student",
                        title: "submission",
                        url: "/student-submission/{submissionId}",
                        views: {
                            "content@home": {
                                templateUrl: "app/student/ultrasound/student-submission.html",
                                controller: "StudentSubmissionController"
                            }
                        },
                        params: { submissionId: null, returnState: null },
                        data: {
                            roles: ["Admin", "Student"]
                        }
                    })
                    .state("student.submissionHistory", {
                        parent: "student",
                        title: "submission_history",
                        url: "/student-submission-history",
                        views: {
                            "content@home": {
                                templateUrl: "app/student/ultrasound/student-submission-history.html",
                                controller: "StudentSubmissionHistoryController"
                            }
                        },
                        data: {
                            roles: ["Admin", "Student"]
                        }
                    })
                    .state("student.progress", {
                        parent: "student",
                        title: "submission_progress",
                        url: "/student-progress",
                        views: {
                            "content@home": {
                                templateUrl: "app/student/ultrasound/student-progress.html",
                                controller: "StudentProgressController"
                            }
                        },
                        data: {
                            roles: ["Admin", "Student"]
                        }
                    })
                    .state("student.search", {
                        parent: "student",
                        title: "submission_search",
                        url: "/student-search",
                        views: {
                            "content@home": {
                                templateUrl: "app/student/ultrasound/student-search.html",
                                controller: "student-search.controller"
                            }
                        },
                        data: {
                            roles: ["Admin", "Student"]
                        }
                    })

                    .state("student.submissionPreview", {
                        parent: "student",
                        title: "submission_preview",
                        url: "/student-submission-preview/{submissionId}",
                        views: {
                            "content@home": {
                                templateUrl: "app/student/ultrasound/student-submission-preview.html",
                                controller: "StudentSubmissionPreviewController"
                            }
                        },
                        params: { submissionId: null },
                        data: {
                            roles: ["Admin", "Student"]
                        }
                    })
                    //portfolio part
                  .state("student.dashboard", {
                      parent: "student",
                      title: "userdashboard",
                      url: "/student-dashboard",
                      views: {
                          "content@home": {
                              templateUrl: "app/user/dashboard/user-dashboard.html",
                              controller: "student.dashboard.controller"
                          }
                      },
                      params: { submissionId: null, returnState: null },
                      data: {
                          roles: ["Admin", "Student"]
                      }
                  })
                  .state("student.add", {
                      parent: "student",
                      title: "add",
                      url: "/student-add",
                      views: {
                          "content@home": {
                              templateUrl: "app/user/add/user-add.html",
                              controller: "student.add.controller"
                          }
                      },
                      params: { submission: null },
                      data: {
                          roles: ["Admin", "Student"]
                      }
                  })
                  .state("student.add.kpb", {
                      parent: "student",
                      title: "kpb",
                      url: "/student-kpb",
                      views: {
                          "content@home": {
                              templateUrl: "app/user/add/kpb/kpb.html",
                              controller: "student.kpb.controller"
                          }
                      },
                      data: {
                          roles: ["Admin", "Student"]
                      }
                  })
                .state("student.procedure", {
                    parent: "student",
                    title: "Procedure registration",
                    url: "/student-pocedure-register",
                    views: {
                        "content@home": {
                            templateUrl: "app/student/portfolio/procedure-register/procedure-register.html",
                            controller: "StudentProcedureRegisterController"
                        }
                    },
                    params: { submission: null },
                    data: {
                        roles: ["Admin", "Student"]
                    }
                })
                  .state("student.epa", {
                      parent: "student",
                      title: "epa",
                      url: "/student-epa",
                      views: {
                          "content@home": {
                              templateUrl: "app/user/epa/user-epa.html",
                              controller: "student.epa.controller"
                          }
                      },
                      params: { submission: null },
                      data: {
                          roles: ["Admin", "Student"]
                      }
                  })
                  .state("student.profile", {
                      parent: "student",
                      title: "profile",
                      url: "/student-profile",
                      views: {
                          "content@home": {
                              templateUrl: "app/user/profile/user-profile.html",
                              controller: "student.profile.controller"
                          }
                      },
                      params: { submission: null },
                      data: {
                          roles: ["Admin", "Student", "Expired"]
                      }
                  })
                    .state("student.formsnumber", {
                        parent: "student",
                        title: "formsnumber",
                        url: "/student-formsnumber",
                        views: {
                            "content@home": {
                                templateUrl: "app/student/portfolio/procedure-register/forms-number.html",
                                controller: "forms-number.controller"
                            }
                        },
                        params: { submission: null },
                        data: {
                            roles: ["Admin", "Student"]
                        }
                    })
                  .state("student.editprofile", {
                      parent: "student",
                      title: "editprofile",
                      url: "/student-editprofile",
                      views: {
                          "content@home": {
                              templateUrl: "app/user/profile/user-editprofile.html",
                              controller: "student.editprofile.controller"
                          }
                      },
                      params: { submission: null },
                      data: {
                          roles: ["Admin", "Student","Expired"]
                      }
                  }).state("student.collegeSubmission", {
                                 parent: "student",
                                 title: "submission",
                                 url: "/student-collegeSubmission/{submissionId}",
                                 views: {
                                     "content@home": {
                                         templateUrl: "app/student/college/studentcollege-submission.html",
                                         controller: "studentcollege-submission.controller"
                                     }
                                 },
                                 params: { submissionId: null, returnState: null },
                                 data: {
                                     roles: ["Admin", "Student"]
                                 }
                             })
                    .state("student.collegesubmissionHistory", {
                        parent: "student",
                        title: "submission_history",
                        url: "/studentcollege-submission-history",
                        views: {
                            "content@home": {
                                templateUrl: "app/student/college/studentcollege-submission-history.html",
                                controller: "studentcollege-submissionhistory.controller"
                            }
                        },
                        data: {
                            roles: ["Admin", "Student"]
                        }
                    })
                    .state("student.collegeprogress", {
                        parent: "student",
                        title: "submission_progress",
                        url: "/student-collegeprogress",
                        views: {
                            "content@home": {
                                templateUrl: "app/student/college/studentcollege-progress.html",
                                controller: "studentcollege-progress.controller"
                            }
                        },
                        data: {
                            roles: ["Admin", "Student"]
                        }
                    })
                    .state("student.collegesearch", {
                        parent: "student",
                        title: "submission_search",
                        url: "/student-collegesearch",
                        views: {
                            "content@home": {
                                templateUrl: "app/student/college/studentcollege-search.html",
                                controller: "studentcollege-search.controller"
                            }
                        },
                        data: {
                            roles: ["Admin", "Student"]
                        }
                    })

                    .state("student.collegesubmissionPreview", {
                        parent: "student",
                        title: "submission_preview",
                        url: "/studentcollege-submission-preview/{submissionId}",
                        views: {
                            "content@home": {
                                templateUrl: "app/student/college/studentcollege-submission-preview.html",
                                controller: "studentcollege-submission-preview.controller"
                            }
                        },
                        params: { submissionId: null },
                        data: {
                            roles: ["Admin", "Student"]
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
            }
        ]).run(function () {

            // console.log('student');
        }
        );

}(angular));