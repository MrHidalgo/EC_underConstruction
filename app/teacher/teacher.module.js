(function (angular) {

    "use strict";

    angular
        .module("Eportfolio.teacher", ["ui.router", "ui.bootstrap", "chart.js", "daterangepicker", "ngSanitize", 'ui-notification'])
        .config([
            "$stateProvider", "NotificationProvider",
            function ($stateProvider, NotificationProvider) {
                $stateProvider
                    .state("teacher", {
                        parent: "home",
                        abstract: true,
                        views: {
                            "": {
                                templateUrl: "app/main/main-layout.html"
                            },
                            "menu@home": {
                                templateUrl: "app/teacher/teacher-menu.html",
                                controller: "TeacherMenuController"
                            }
                        },
                        data: {
                            roles: ["Teacher"]
                        }
                    })
                    .state("teacher.dashboard", {
                        parent: "teacher",
                        title: "dashboard",
                        url: "/teacher-dashboard",
                        views: {
                            "content@home": {
                                templateUrl: "app/teacher/ultrasound/teacher-dashboard.html",
                                controller: "TeacherDashboardController"
                            }
                        },
                        data: {
                            roles: ["Teacher"]
                        }
                    })
                    .state("teacher.reviews", {
                        parent: "teacher",
                        title: "review_history",
                        url: "/teacher-reviews",
                        views: {
                            "content@home": {
                                templateUrl: "app/teacher/ultrasound/teacher-reviews.html",
                                controller: "TeacherReviewsController"
                            }
                        },
                        data: {
                            roles: ["Teacher"]
                        }
                    })
                    .state("teacher.review", {
                        parent: "teacher",
                        title: "review_submission",
                        url: "/teacher-review/{submissionId}",
                        views: {
                            "content@home": {
                                templateUrl: "app/teacher/ultrasound/teacher-review.html",
                                controller: "TeacherReviewController"
                            }
                        },
                        params: { submissionId: null, fileId: null, returnState: null },
                        data: {
                            roles: ["Teacher"]
                        }
                    })
                    .state("teacher.replies", {
                        parent: "teacher",
                        title: "submission_replies",
                        url: "/teacher-replies",
                        views: {
                            "content@home": {
                                templateUrl: "app/teacher/ultrasound/teacher-replies.html",
                                controller: "TeacherRepliesController"
                            }
                        },
                        data: {
                            roles: ["Teacher"]
                        }
                    })
                    .state("teacher.search", {
                        parent: "teacher",
                        title: "search_submitted_files",
                        url: "/teacher-search",
                        views: {
                            "content@home": {
                                templateUrl: "app/teacher/ultrasound/teacher-search.html",
                                controller: "TeacherSearchController"
                            }
                        },
                        data: {
                            roles: ["Teacher"]
                        }
                    })
                    .state("teacher.progress", {
                        parent: "teacher",
                        title: "submission_progress",
                        url: "/teacher-progress",
                        views: {
                            "content@home": {
                                templateUrl: "app/teacher/ultrasound/teacher-progress.html",
                                controller: "TeacherProgressController"
                            }
                        },
                        data: {
                            roles: ["Teacher"]
                        }
                    })
                    .state("teacher.submission", {
                        parent: "teacher",
                        title: "submission",
                        url: "/teacher-submission/{submissionId}",
                        views: {
                            "content@home": {
                                templateUrl: "app/teacher/ultrasound/teacher-submission.html",
                                controller: "TeacherSubmissionController"
                            }
                        },
                        params: { submissionId: null, returnState: null },
                        data: {
                            roles: ["Teacher"]
                        }
                    })//new
                    .state("teacher.submissionHistory", {
                        parent: "teacher",
                        title: "submission_history",
                        url: "/teacher-submission-history",
                        views: {
                            "content@home": {
                                templateUrl: "app/teacher/ultrasound/teacher-submission-history.html",
                                controller: "TeacherSubmissionHistoryController"
                            }
                        },
                        data: {
                            roles: ["Teacher"]
                        }
                    })

                    .state("teacher.reviewSummary", {
                        parent: "teacher",
                        title: "review_summary",
                        url: "/teacher-review-summary",
                        views: {
                            "content@home": {
                                templateUrl: "app/teacher/ultrasound/review-summary.html",
                                controller: "ReviewSummaryController"
                            }
                        },
                        params: { submission: null, submissionId: null, unreadMessageCount: 0, returnState: null },
                        data: {
                            roles: ["Teacher"]
                        }
                    })
                    //portfolio part
                  .state("teacher.dashboard.portfolio", {
                      parent: "teacher",
                      title: "userdashboard",
                      url: "/teacher-dashboard-portfolio",
                      views: {
                          "content@home": {
                              templateUrl: "app/user/dashboard/user-dashboard.html",
                              controller: "teacher.dashboard.controller"
                          }
                      },
                      params: { submissionId: null, returnState: null },
                      data: {
                          roles: ["Teacher"]
                      }
                  })
                  .state("teacher.add", {
                      parent: "teacher",
                      title: "add",
                      url: "/teacher-add",
                      views: {
                          "content@home": {
                              templateUrl: "app/user/add/user-add.html",
                              controller: "teacher.add.controller"
                          }
                      },
                      params: { submission: null },
                      data: {
                          roles: ["Teacher"]
                      }
                  })
                  .state("teacher.add.kpb", {
                      parent: "teacher",
                      title: "kpb",
                      url: "/teacher-kpb",
                      views: {
                          "content@home": {
                              templateUrl: "app/user/add/kpb/kpb.html",
                              controller: "teacher.kpb.controller"
                          }
                      },
                      data: {
                          roles: ["Teacher"]
                      }
                  })
                  .state("teacher.epa", {
                      parent: "teacher",
                      title: "epa",
                      url: "/teacher-epa",
                      views: {
                          "content@home": {
                              templateUrl: "app/user/epa/user-epa.html",
                              controller: "teacher.epa.controller"
                          }
                      },
                      params: { submission: null },
                      data: {
                          roles: ["Teacher"]
                      }
                  })
                  .state("teacher.profile", {
                      parent: "teacher",
                      title: "profile",
                      url: "/teacher-profile",
                      views: {
                          "content@home": {
                              templateUrl: "app/user/profile/user-profile.html",
                              controller: "teacher.profile.controller"
                          }
                      },
                      params: { submission: null },
                      data: {
                          roles: ["Teacher", "Expired"]
                      }
                  })
                  .state("teacher.editprofile", {
                      parent: "teacher",
                      title: "editprofile",
                      url: "/teacher-editprofile",
                      views: {
                          "content@home": {
                              templateUrl: "app/user/profile/user-editprofile.html",
                              controller: "teacher.editprofile.controller"
                          }
                      },
                      params: { submission: null },
                      data: {
                          roles: ["Teacher", "Expired"]
                      }
                  }).
                       state("teacher.collegedashboard", {
                           parent: "teacher",
                           title: "dashboard",
                           url: "/teacher-collegedashboard",
                           views: {
                               "content@home": {
                                   templateUrl: "app/teacher/college/teacher-college-dashboard.html",
                                   controller: "teacher.collegedashboard.controller"
                               }
                           },
                           params: { submission: null },
                           data: {
                               roles: ["Teacher", "Expired"]
                           }
                       }).
                       state("teacher.collegereviews", {
                           parent: "teacher",
                           title: "Reviews",
                           url: "/teacher-collegereviews",
                           views: {
                               "content@home": {
                                   templateUrl: "app/teacher/college/teacher-college-reviews.html",
                                   controller: "teacher-coleggereviews.controller"
                               }
                           },
                           params: { submission: null },
                           data: {
                               roles: ["Teacher", "Expired"]
                           }
                       }).
                       state("teacher.collegereview", {
                           parent: "teacher",
                           title: "Review",
                           url: "/teacher-collegereview",
                           views: {
                               "content@home": {
                                   templateUrl: "app/teacher/college/teacher-college-review.html",
                                   controller: "teacher-coleggereview.controller"
                               }
                           },
                           params: { submissionId: null, fileId: null, returnState: null },
                           data: {
                               roles: ["Teacher", "Expired"]
                           }
                       }).state("teacher.collegesearch", {
                           parent: "teacher",
                           title: "search_submitted_files",
                           url: "/teachercollege-search",
                           views: {
                               "content@home": {
                                   templateUrl: "app/teacher/college/teachercollege-search.html",
                                   controller: "teachercollege-search.controller"
                               }
                           },
                           data: {
                               roles: ["Teacher"]
                           }
                       }).
                       state("teacher.collegeprogress", {
                           parent: "teacher",
                           title: "progress",
                           url: "/teacher-collegeprogress",
                           views: {
                               "content@home": {
                                   templateUrl: "app/teacher/college/teachercollege-progress.html",
                                   controller: "teachercollege-progress.controller"
                               }
                           },
                           data: {
                                 roles: ["Teacher", "Expired"]
                           }
                       }).state("teacher.collegereplies", {
                           parent: "teacher",
                           title: "progress",
                           url: "/teacher-collegereplies",
                           views: {
                               "content@home": {
                                   templateUrl: "app/teacher/college/teacher-college-replies.html",
                                   controller: "teacher-college-replies.controller"
                               }
                           },
                           data: {
                               roles: ["Teacher", "Expired"]
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
            // console.log('teacher');
        }
        );

}(angular));