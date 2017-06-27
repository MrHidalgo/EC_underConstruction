(function (angular) {

    "use strict";

    var controller = function (
        $scope,
        $timeout,
        $localStorage,
        $state,
        $uibModal,
        $stateParams,
        modalService,
        Upload,
        submissionService,
        appSettings,
        config,
        $window,
        $filter,
        Notification,
        $rootScope,
        $translate
    ) {


        //    $scope.ultrasoundSelected = ultrasoundSelected;
        //    $scope.viewSelected = viewSelected;
        $scope.loadSubmission = loadSubmission;
        $scope.updateSubmission = updateSubmission;
        $scope.uploadFiles = uploadFiles;
        $scope.loadFileDetails = loadFileDetails;
        $scope.updateFileDetails = updateFileDetails;
        //     $scope.loadFindings = loadFindings;
        $scope.enlarge = enlarge;
        $scope.closeUpload = closeUpload;
        $scope.uploadToSub = uploadToSub;
        $scope.complete = complete;
        $scope.deleteFile = deleteFile;
        $scope.assignSubmittion = assignSubmittion;
        $scope.goToFileTagging = goToFileTagging;
        $scope.goToConclusion = goToConclusion;
        //    $scope.isValidFileDetail = isValidFileDetail;
        //   $scope.deleteUsType = deleteUsType;
        //$scope.setIndicationsAndViews = setIndicationsAndViews;
        //$scope.setIndicationOnClick = setIndicationOnClick;
        //$scope.selectedIndication = selectedIndication;
        //$scope.checkGeneralValidation = checkGeneralValidation;
        //$scope.isValidGeneralForm = isValidGeneralForm;
        $scope.updateFileDuplicates = updateFileDuplicates;
        //    $scope.isValidTagForm = isValidTagForm;
        $scope.openCollapse = openCollapse;
        $scope.isDicom = isDicom;
        $scope.save = save;
        $scope.registrationDateOptions = {
            format: "dd/MM/yyyy",
            culture: $translate.use() === 'nl' ? "nl-NL" : "en-US",
            // value: new Date(),
            mask: '00/00/0000',
            // max: new Date()
        };
        $scope.whatClassIsIt = function (someValue) {
            if (someValue <= 6) {
                return "center";
            }
        };

        $scope.isClassNameCollapse = function () {
            if ($scope.allFilesTagged) {
                return;
            } else if ($scope.isValidGeneral && $scope.selectedFile) {
                return "active";
            } else if (!$scope.isValidGeneral || !$scope.selectedFile) {
                return "disabled";
            }
        };

        var extensions = config.videoExtensions.split(' ');
        var allowedVideoExtensions = extensions.join(',.');
        $scope.mFileSize = 250;
        allowedVideoExtensions = "." + allowedVideoExtensions;
        $scope.settings = {
            accept: "image/*," + allowedVideoExtensions + ",.dcm",
            pattern: "image/*," + allowedVideoExtensions + ",.dcm",
            maxFiles: 75,
            maxSize: $scope.mFileSize + 'MB',
            dropAvailable: true
        };
        $scope.subLoaded = $rootScope.subLoaded = false;

        $scope.isAuth = angular.isNullUndefinedOrWhitespace($localStorage.accessToken) ? false : true;
        $scope.EmptyGuid = "00000000-0000-0000-0000-000000000000";

        $scope.$watch($scope.subLoaded, function () { });

        init();

        function init() {
            $scope.wasSaved = false;
            $scope.wasUnsavedGeneral = false;
            $scope.wasUnsavedTagging = false;
            $scope.wasUnsavedConclusion = false;
            $scope.subLoaded = $rootScope.subLoaded = false;
            $scope.isValidGeneral = false;

            $scope.filesTagged = 0;
            $scope.filesUploaded = 0;
            $scope.duplicates = 0;
            $scope.files = null;
            $scope.uploadedFiles = [];
            $scope.selectedFile = null;
            $scope.selectedFileIndex = -1;
            $scope.allFilesTagged = false;
            var subId;
            if (!angular.isNullOrUndefined($stateParams.submissionId)) {
                subId = $stateParams.submissionId;
            } else {
                subId = $scope.EmptyGuid;

            }
            $scope.submission = {
                SubmissionId: subId,
                UltrasoundType: null,
                PatientAge: undefined,
                PatientGender: null,
                Indications: [],
                Conclusion: null
            };

            $scope.status = {
                General: true,
                Tag: true,
                Conslusion: true
            };
            $scope.oneAtATime = false;

            $scope.validationGeneral = { // invalid  = true, else valid
                UltrasoundType: false,
                PatientAge: false,
                PatientGender: false,
                Indications: false
            };
            $scope.pristineGeneral = { // form elements not changed
                UltrasoundType: true,
                PatientAge: true,
                PatientGender: true,
                Indications: true
            };


        };

        $scope.$watch($scope.disabledFileSelect, function () { });

        $scope.$on('onBeforeUnload', function (e, confirmation) {
            if (($scope.subLoaded === true && $rootScope.subLoaded === true) && $scope.isAuth) {
                confirmation.message = "All data willl be lost.";
                e.preventDefault();

            }
        });

        $scope.$parent.$on('$stateChangeStart',
             function (event, toState, toParams, fromState, fromParams) {

                 if (($scope.subLoaded === true && $rootScope.subLoaded === true) && fromState.name === "student.collegeSubmission" && $scope.isAuth) {
                     event.preventDefault();

                     if (toState && toState.name) {
                         closeUpload(toState.name);
                     } else {
                         console.log("state zero");
                         closeUpload();
                     }

                 }
             }
        );

        $scope.onChangeGeneral = function () {
            $scope.wasUnsavedGeneral = true;
        }

        $scope.onChangeTagging = function () {
            $scope.wasUnsavedTagging = true;
        }

        $scope.onChangeConclusion = function () {
            $scope.wasUnsavedConclusion = true;
        }

        function loadSubmission(files) {


            if (angular.isNullOrUndefined($scope.submission.SubmissionId) ||
                $scope.submission.SubmissionId === $scope.EmptyGuid) {

                return true;
            }
            $scope.loading = true;
            //$stateParams.submissionId = $scope.submission.SubmissionId;
            submissionService
                .getCollegeSubmission($scope.submission.SubmissionId)
                .then(function (response) {
                    $scope.loading = false;
                    //  console.log(response)

                    if (response.SubmissionId === $scope.EmptyGuid || !response) {
                        clearSubmission();
                        $scope.loading = false;
                        return;
                    }
                    if (response.Files && response.Files.length > 0) {
                        $scope.uploadedFiles = response.Files;
                        console.log(response.Files);
                        $scope.wasSaved = true;
                    }

                    console.log(response);
                    $scope.submission = {
                        SubmissionId: response.SubmissionId,
                        UltrasoundType: [],
                        HealthyTest: response.HealthyTest,
                        PatientAge: response.PatientAge,
                        PatientGender: response.PatientGender,
                        Comments: response.Comments,
                        SupervisorId: response.SupervisorId,
                        VideoDate: response.VideoDate
                    };
                    angular.forEach(response.RegistrationTypes, function (v, k) {
                        $scope.submission.UltrasoundType.push({ Id: v.Id, Name: v.Name });

                    });
                    $scope.submission
                    //$scope.submission.Indications = angular.isNullUndefinedOrWhitespace(response.Indications)
                    //    ? []
                    //    : response.Indications.split(",");


                    $scope.ultrasoundTypes = response.RegistrationTypeModel;
                    $scope.supervisors = response.Supervisors;

                    //$scope.viewsAndIndication = response.UltrasoundType;
                    //setIndicationsAndViews(response.UltrasoundType);
                    if (files && files.length > 0) {
                        uploadToSub(files, response.SubmissionId);
                    }
                    //ultrasoundSelected();
                    updateTaggedFileCount();
                    updateUploadedFileCount();
                    $scope.loading = false;
                    $scope.subLoaded = $rootScope.subLoaded = true;

                    //isValidGeneralForm();
                    //isValidTagForm();

                });
        };

        function updateSubmission() {

            var submission = $scope.submission;

            if (isValidGeneralForm()) {

                var submissionData = {
                    SubmissionId: submission.SubmissionId,
                    UltrasoundTypes: submission.UltrasoundType,
                    HealthyTest: submission.HealthyTest,
                    PatientAge: submission.PatientAge,
                    PatientGender: submission.PatientGender,
                    Conclusion: submission.Conclusion
                };

                var selectedIndications = _($scope.indications).where({ Selected: true });
                var selectedIndicationIds = _(selectedIndications).pluck("Id");

                submissionData.Indications = selectedIndicationIds && selectedIndicationIds.length > 0
                    ? selectedIndicationIds.join()
                    : "";

                $scope.loading = true;
                submissionService
                    .update(submissionData)
                    .then(function () {
                        $scope.wasSaved = true;
                        $scope.wasUnsavedGeneral = false;
                        $scope.loading = false;
                        Notification.clearAll();
                        Notification.info({ message: $filter('translate')("submission_updated") });

                        //todo clean
                        goToFileTagging();
                        var fileIndex = _($scope.uploadedFiles).findIndex({ Completed: false }); //To do

                        if (fileIndex !== -1) {
                            $scope.selectedFileIndex = fileIndex;
                            loadFileDetails(fileIndex);
                        } else {
                            fileIndex = 0;
                            $scope.selectedFileIndex = fileIndex;
                            loadFileDetails(fileIndex);
                        }

                    });
            } else { $scope.wasUnsavedGeneral = true; }
        }

        //function deleteUsType($item) {
        //    $scope.loading = true;
        //    submissionService
        //        .removeTagsFromSubmission($scope.submission.SubmissionId, $item.Id)
        //        .then(function (response) {
        //            $scope.loading = false;
        //            if (!response) {
        //                return;
        //            }
        //            var array = response.data;
        //            //untag uploadedFiles
        //            angular.forEach($scope.uploadedFiles,
        //                function (value, key) {
        //                    if (value.Id !== null && -1 !== array.indexOf(value.Id)) {
        //                        $scope.uploadedFiles[key].Completed = false;
        //                        $scope.allFilesTagged = false;
        //                        $scope.wasUnsavedTagging = true;
        //                    }
        //                });
        //            ultrasoundSelected();
        //            //loadIndications();

        //            isValidGeneralForm();

        //            updateTaggedFileCount();
        //            // todo check valid
        //        });
        //}

        //function setIndicationsAndViews(viewsAndIndicationObj) {
        //    $scope.viewsAndIndication = viewsAndIndicationObj;
        //    var indic = [];
        //    var vis = [];
        //    angular.forEach(viewsAndIndicationObj,
        //        function (value) {
        //            angular.forEach(value.Indications,
        //                function (v, k) {
        //                    if (_(indic).some({ Name: v.Name })) {
        //                        indic.push({ Id: v.Id, Name: v.Name, Selected: v.Selected, Hidden: true });
        //                    } else {
        //                        indic.push({ Id: v.Id, Name: v.Name, Selected: v.Selected, Hidden: false });
        //                    }

        //                }
        //            );

        //            angular.forEach(value.Views,
        //                function (v) {
        //                    vis.push({ Id: v.Id, Name: v.Name, Group: value.Name });
        //                }
        //            );
        //        }
        //    );

        //    $scope.indications = indic;
        //    $scope.views = vis;
        //}

        //function setIndicationOnClick(indication) {
        //    var inds = _($scope.indications).where({ Name: indication.Name });

        //    if (inds) {
        //        angular.forEach(inds,
        //            function (v, k) {
        //                var index = $scope.indications.indexOf(v);
        //                if (-1 !== index) {
        //                    $scope.indications[index].Selected = indication.Selected;
        //                }

        //            });

        //    }
        //}

        //function ultrasoundSelected() {
        //    var ultrasoundType = _($scope.submission.UltrasoundType).pluck("Id");

        //    var submissionId = $scope.submission.SubmissionId;
        //    $scope.loading = true;
        //    submissionService
        //        .loadIndicationsAndViews(submissionId, ultrasoundType)
        //        .then(function (response) {
        //            $scope.loading = false;
        //            setIndicationsAndViews(response.data);


        //        });

        //}

        //function checkGeneralValidation(objKey) {

        //    switch (objKey) {
        //        case 'UltrasoundType':
        //            {
        //                if ($scope.submission[objKey] !== null && $scope.submission[objKey].length > 0) {
        //                    $scope.validationGeneral[objKey] = false;
        //                } else {
        //                    $scope.validationGeneral[objKey] = true;
        //                }
        //                $scope.pristineGeneral[objKey] = false;
        //                break;
        //            }
        //        case 'PatientAge':
        //            {
        //                //$scope.submission[objKey] != null && $scope.submission[objKey] === parseInt($scope.submission[objKey], 10) &&
        //                if ($scope.submission[objKey] > -1 &&
        //                    $scope.submission[objKey] <= 150 &&
        //                    $scope.submission[objKey] === parseInt($scope.submission[objKey])) {
        //                    $scope.validationGeneral[objKey] = false;
        //                } else {
        //                    $scope.validationGeneral[objKey] = true;
        //                }
        //                $scope.pristineGeneral[objKey] = false;
        //                break;
        //            }
        //        case 'PatientGender':
        //            {
        //                if (!angular.isNullOrUndefined($scope.submission[objKey])) {
        //                    $scope.validationGeneral[objKey] = false;
        //                } else {
        //                    $scope.validationGeneral[objKey] = true;
        //                }
        //                $scope.pristineGeneral[objKey] = false;
        //                break;
        //            }
        //        case 'Indications':
        //            {
        //                var selected = selectedIndication();
        //                // console.log("check valid gen");
        //                if (selected) {
        //                    $scope.validationGeneral[objKey] = false;
        //                } else {
        //                    $scope.validationGeneral[objKey] = true;
        //                }
        //                $scope.pristineGeneral[objKey] = false;
        //                break;
        //            }
        //        case 'HealthyTest':
        //            {
        //                if ($scope.submission[objKey] === true) {
        //                    //                        $scope.submission.indications = [];
        //                    $scope.submission.PatientGender = null;
        //                    $scope.submission.PatientAge = undefined;
        //                    if ($scope.indications !== null || $scope.indications.length > 0) {
        //                        angular.forEach($scope.indications,
        //                            function (value) {
        //                                value.Selected = false;
        //                            });
        //                    }
        //                    $scope.validationGeneral.Indications = false;
        //                    $scope.pristineGeneral.Indications = true;

        //                    $scope.validationGeneral.PatientGender = false;
        //                    $scope.pristineGeneral.PatientGender = true;

        //                    $scope.validationGeneral.PatientAge = false;
        //                    $scope.pristineGeneral.PatientAge = true;

        //                } else {
        //                    $scope.validationGeneral.Indications = true;
        //                    $scope.pristineGeneral.Indications = true;

        //                    $scope.validationGeneral.PatientGender = true;
        //                    $scope.pristineGeneral.PatientGender = true;

        //                    $scope.validationGeneral.PatientAge = true;
        //                    $scope.pristineGeneral.PatientAge = true;

        //                }

        //                break;
        //            }

        //    }

        //    //isValidGeneralForm();

        //}

        //function selectedIndication() {
        //    var selectedIndication = _($scope.indications).some({ Selected: true });

        //    return (!selectedIndication) ? false : true;

        //}

        //function isValidGeneralForm() {

        //    var valid = $scope.submission.UltrasoundType !== null && $scope.submission.UltrasoundType.length !== 0;
        //    if (!valid) {
        //        Notification.clearAll();
        //        Notification.info({ message: $filter("translate")("choose_us_type") }); // todo 
        //        $scope.isValidGeneral = false;

        //        return $scope.isValidGeneral;
        //    }

        //    if ($scope.submission.HealthyTest === null) {

        //        $scope.isValidGeneral = false;
        //        return $scope.isValidGeneral;
        //    } else if (true === $scope.submission.HealthyTest && valid) {
        //        $scope.isValidGeneral = true;
        //        goToFileTagging();
        //        return $scope.isValidGeneral;
        //    } else if (false === $scope.submission.HealthyTest) {
        //        if (angular.isNullOrUndefined($scope.submission.PatientAge) ||
        //            $scope.submission.PatientAge > 150 ||
        //            $scope.submission.PatientAge < 0) {
        //            //todo invalid PatientAge
        //            Notification.clearAll();
        //            Notification.info({ message: $filter("translate")("enter_valid_patient_age") });
        //            $scope.isValidGeneral = false;
        //            return $scope.isValidGeneral;
        //        }
        //        if (angular.isNullOrUndefined($scope.submission.PatientGender)) {
        //            Notification.clearAll();
        //            Notification.info({ message: $filter("translate")("choose_patient_gender") });
        //            $scope.isValidGeneral = false;
        //            return $scope.isValidGeneral;
        //        }
        //        var selected = selectedIndication();

        //        if (!selected) {
        //            Notification.clearAll();
        //            Notification.info({ message: $filter("translate")("choose_indications") });
        //            $scope.isValidGeneral = false;
        //            return $scope.isValidGeneral;
        //        }
        //    }

        //    $scope.isValidGeneral = true;
        //    goToFileTagging();
        //    return $scope.isValidGeneral;
        //}

        //function isValidFileDetail() {
        //    if ($scope.selectedFile === null || angular.isNullUndefinedOrWhitespace($scope.selectedFile.Id)) {
        //        Notification.clearAll();
        //        Notification.warning({ message: "please_select_file" });

        //        return false;
        //    }

        //    if ($scope.selectedFile.ViewType === null) {
        //        Notification.clearAll();
        //        Notification.warning({ message: $filter('translate')("please_select_a_view") });

        //        return false;
        //    }
        //    if ($scope.findings !== null && $scope.findings.length !== 0) {

        //        var optionUnselected = _($scope.findings)
        //            .some(function (finding) {
        //                return !finding.SelectedOptionId || finding.SelectedOptionId === 0; //todo
        //            });

        //        if (optionUnselected) {
        //            Notification.clearAll();
        //            Notification.warning({ message: $filter('translate')("please_select_a_finding") });

        //            return false;

        //        }
        //        //return false;
        //    } else {
        //        if (angular.isNullUndefinedOrWhitespace($scope.selectedFile.Observations)) {
        //            Notification.clearAll();
        //            Notification.warning({ message: $filter('translate')("required_field_not_entered") });
        //            return false;
        //        }
        //    }


        //    return true;
        //}

        //function isValidTagForm() {
        //    if ($scope.uploadedFiles !== null && $scope.uploadedFiles.length > 0 && $scope.duplicates + $scope.filesTagged === $scope.uploadedFiles.length &&
        //        $scope.filesTagged === $scope.filesUploaded) {
        //        //todo go to conclusion
        //        $scope.allFilesTagged = true;
        //        goToConclusion();
        //        return $scope.allFilesTagged;
        //    } else {
        //        $scope.allFilesTagged = false;
        //        return $scope.allFilesTagged;
        //    }

        //}

        function uploadFiles(files) {
            if (angular.isNullOrUndefined($scope.submission.SubmissionId) ||
                $scope.submission.SubmissionId === $scope.EmptyGuid) {
                $scope.loading = true;

                submissionService
                    .create()
                    .then(function (id) {
                        $scope.submission.SubmissionId = id;
                        $scope.loading = false;
                        $scope.subLoaded = $rootScope.subLoaded = true;

                        loadSubmission(files);


                    });
            } else {

                uploadToSub(files, $scope.submission.SubmissionId);

            }

        }

        function isDicom(file) {
            if (angular.isNullOrUndefined(file.isDicom) || !file.isDicom) {
                return false;
            } else {
                return true;
            }

        }

        function uploadToSub(files, id) {
            if (id !== null || id !== $scope.EmptyGuid) {

                $scope.subLoaded = $rootScope.subLoaded = true;
                $scope.disabledFileSelect = true;
                $scope.files = files;

                var uploadedCount = $scope.uploadedFiles.length;
                updateTaggedFileCount();
                $scope.dcmFiles = [];

                angular.forEach($scope.files, function (file, index) {

                    var lastIndex = file.name.lastIndexOf(".dcm");
                    if (-1 !== lastIndex) {

                        $scope.dcmFiles.push(file);
                    }
                });

                // separating
                if ($scope.dcmFiles.length > 0) {
                    var indexFirstDcm = $scope.files.indexOf($scope.dcmFiles[0]);
                    if (-1 !== indexFirstDcm) {
                        $scope.files[indexFirstDcm] = {};
                        $scope.files[indexFirstDcm].FileGroup = [];
                        angular.forEach($scope.dcmFiles, function (file, index) {

                            $scope.files[indexFirstDcm].FileGroup.push(file);

                            var delIndex = $scope.files.indexOf(file);
                            if (-1 !== delIndex) {
                                $scope.files.splice(delIndex, 1);
                            }

                        });

                    }
                }

                angular.forEach($scope.files,
                    function (file, index) {
                        //todo add check if valid file
                        if (!file.FileGroup) {

                            if (file.size <= $scope.mFileSize * 10 ^ 6
                                && $scope.uploadedFiles.length + index < $scope.settings.maxFiles
                                && !file.Uploaded
                                && !file.Duplicate
                                ) {
                                var detail = {
                                    SubmissionId: id,
                                    Filename: !file.name ? file.FileGroup[0].name : file.name,
                                    Filesize: !file.size ? file.FileGroup[0].name : file.size,
                                    Firstbytes: []
                                };
                                submissionService
                                    .preupload(detail)
                                    .then(function (response) {

                                        var filedetail = response.data;
                                        if ($scope.status.Tag == false && $scope.status.General == false) {
                                            goToFileTagging();
                                        }

                                        file.Id = filedetail;
                                        if (angular.isVideoFile(file.name) && !angular.hasLocalVideoPreview(file.name)) {
                                            file.DisabledPreview = true;
                                        }

                                        $scope.uploadedFiles.push(file);

                                        file.upload = Upload.upload({
                                            url: appSettings.serviceUrl + "api/file/upload/" + filedetail,

                                            data: {
                                                file: file
                                            }
                                        }).then(
                                            function (response) {
                                                $timeout(function () {
                                                    if (response.data) {
                                                        $timeout(function () {
                                                            file.Id = response.data.FileId;
                                                            file.Filepath = response.data.Filepath;
                                                            file.FileType = response.data.FileType;
                                                            file.Thumbnail = response.data.Thumbnail;
                                                            file.Progress = 100;
                                                            file.DisabledPreview = false;
                                                            file.Uploaded = true;
                                                            updateUploadedFileCount();


                                                        });
                                                    }
                                                    updateUploadedFileCount();

                                                    if ((index + 1 === files.length)) {
                                                        $scope.disabledFileSelect = false;
                                                        //  isValidTagForm();
                                                    }
                                                    goToFileTagging();
                                                });
                                            },
                                            function (response) {
                                                if (response.status > 0)
                                                    $scope.errorMsg = response.status + ': ' + response.data;
                                                updateUploadedFileCount();

                                                if ((index + 1 === files.length)) {
                                                    $scope.disabledFileSelect = false;
                                                    //  isValidTagForm();
                                                }
                                                goToFileTagging();
                                            },
                                            function (evt) {
                                                file.Progress = Math.min(99,
                                                    parseInt(100.0 *
                                                        evt.loaded /
                                                        evt.total));
                                            }
                                        );



                                    })

                            }


                        }
                        else {
                            var size = 0;
                            size = _(file.FileGroup).findIndex(function (dcmFile) {
                                return (size + (!dcmFile.size ? 0 : dcmFile.size));
                            });
                            console.log(size);
                            //debugger;
                            if (size <= $scope.mFileSize * 10 ^ 6
                             && $scope.uploadedFiles.length + index < $scope.settings.maxFiles
                             && !file.Uploaded
                             && !file.Duplicate
                             ) {

                                var detail = {
                                    SubmissionId: id,
                                    Filename: file.FileGroup[0].name,
                                    Filesize: size,
                                    Firstbytes: []
                                };
                                submissionService
                                        .preupload(detail)
                                        .then(function (response) {

                                            var filedetail = response.data;
                                            if ($scope.status.Tag == false && $scope.status.General == false) {
                                                goToFileTagging();
                                            }

                                            file.Id = filedetail;
                                            file.Progress = 0;
                                            file.isDicom = true;
                                            file.Completed = false;
                                            $scope.uploadedFiles.push(file);
                                            file.Filepath = "Images/dicom_icon.png";




                                            file.upload = Upload.upload({
                                                url: appSettings.serviceUrl + "api/file/upload/" + filedetail,

                                                data: {
                                                    file: file
                                                }
                                            }).then(
                                                function (response) {
                                                    $timeout(function () {
                                                        if (response.data) {
                                                            $timeout(function () {

                                                                file.Progress = 100;
                                                                file.Uploaded = true;
                                                                file.FileGroup = response.data.FileGroup;
                                                                updateUploadedFileCount();

                                                            });
                                                        }
                                                        updateUploadedFileCount();

                                                        if ((index + 1 === files.length)) {
                                                            $scope.disabledFileSelect = false;
                                                            //isValidTagForm();
                                                        }
                                                        goToFileTagging();
                                                    });
                                                },
                                                function (response) {
                                                    if (response.status > 0)

                                                        $scope.errorMsg = response.status + ': ' + response.data;
                                                    updateUploadedFileCount();

                                                    if ((index + 1 === files.length)) {
                                                        $scope.disabledFileSelect = false;
                                                        //isValidTagForm();
                                                    }
                                                },
                                                function (evt) {
                                                    file.Progress = Math.min(99, parseInt(100.0 * evt.loaded / evt.total));

                                                }
                                            );

                                        });

                            }
                        }
                    }

                );

            }
            //user cann`t add files when files are uploading
        }

        function loadFileDetails(index) { //selectedFile

            $scope.selectedFile = $scope.uploadedFiles[index];
            if ($scope.selectedFile.Duplicate || angular.isNullUndefinedOrWhitespace($scope.selectedFile.Id)) {
                return;
            } else {
                //isValidGeneralForm();
                openCollapse(!$scope.isValidGeneral, null, 'Tag');
                $scope.loading = true;
                submissionService
                    .loadFileDetails($scope.selectedFile.Id)
                    .then(function (response) {
                        $scope.loading = false;
                        if (!response) {
                            return;
                        }

                        $scope.selectedFile.Observations = response.Observations;
                        $scope.selectedFile.Messages = response.Messages;
                        $scope.selectedFile.ViewType = response.ViewType;
                        $scope.selectedFile.Completed = response.Completed;
                        $scope.selectedFile.Approved = response.Approved;

                        // loadFindings();
                    });
            }
        }

        function updateFileDetails() {
            if (isValidFileDetail()) {
                var SelFile = $scope.selectedFile;
                if (!SelFile && !SelFile.Id) {
                    return;
                }
                $scope.loading = true;
                submissionService
                    .updateFileDetails(SelFile, $scope.findings)
                    .then(function (response) {
                        $scope.selectedFile.Completed = true;
                        $scope.wasSaved = true;
                        Notification.clearAll();
                        Notification.info({ message: $filter('translate')("file_successfully_tagged") });

                        $scope.loading = false;
                        var tf = updateTaggedFileCount();
                        var df = updateFileDuplicates();
                        var uf = updateUploadedFileCount();


                        // var validT = isValidTagForm();



                        var untaggedFileIndex = _($scope.uploadedFiles).findIndex(function (file) {
                            return (
                                !file.Completed &&
                                !file.Duplicate);
                        });

                        if (untaggedFileIndex !== -1) {
                            //loadFileDetails($scope.files[untaggedFileIndex]);
                            openCollapse(false, null, "Tag");
                            loadFileDetails(untaggedFileIndex);

                        } else {

                            goToConclusion();
                        }



                    });
            }
        }

        function deleteFile(file) {

            var index = $scope.uploadedFiles.indexOf(file);

            $scope.selectedFile = false;

            if (-1 !== index && file.Uploaded) {
                $scope.loading = true;
                var fileId = file.Id;
                return submissionService
                    .removeFile(fileId)
                    .then(function (response) {
                        $scope.wasUnsavedTagging = true;
                        $scope.loading = false;

                        if (!response) {
                            Notification.clearAll();
                            Notification.error({ message: $filter('translate')("unable_to_delete_file") });
                            //isValidTagForm();
                        } else {
                            $scope.uploadedFiles.splice(index, 1);

                            Notification.clearAll();
                            Notification.info({ message: $filter('translate')("file_successfully_deleted") });
                            updateFileDuplicates();
                            updateTaggedFileCount(); //todo update counters
                            updateUploadedFileCount();
                            //isValidTagForm();
                        }
                    });

            }

        }



        function enlarge(file) {

            if (!file) {
                Notification.clearAll();
                Notification.info({ message: $filter('translate')("please_select_a_file") })
                return;
            }
            if (file.DisabledPreview) {
                return;
            }
            var index = $scope.uploadedFiles.indexOf(file);
            if (-1 === index) {
                return;
            }
            if (!isDicom(file)) {
                var filepath;
                var isVideoFile;
                var type;
                var thumbnail = "";
                if ($scope.uploadedFiles[index].name && $scope.uploadedFiles[index].$ngfDataUrl && !$scope.uploadedFiles[index].Filepath) {
                    filepath = $scope.uploadedFiles[index].$ngfDataUrl;
                    isVideoFile = angular.isVideoFile($scope.uploadedFiles[index].name);
                    type = $scope.uploadedFiles[index].type;
                } else if ($scope.uploadedFiles[index].name && $scope.uploadedFiles[index].$ngfBlobUrl && !$scope.uploadedFiles[index].Filepath) {
                    filepath = $scope.uploadedFiles[index].$ngfBlobUrl;
                    isVideoFile = angular.isVideoFile($scope.uploadedFiles[index].name);
                    type = $scope.uploadedFiles[index].type;
                } else {
                    filepath = $scope.uploadedFiles[index].Filepath;
                    isVideoFile = angular.isVideoFile(filepath);
                    if ($scope.uploadedFiles[index].FileType !== null && $scope.uploadedFiles[index].FileType.length > 0) {
                        type = $scope.uploadedFiles[index].FileType;
                    }
                    if (isVideoFile && $scope.uploadedFiles[index].Thumbnail !== null && $scope.uploadedFiles[index].Thumbnail.length > 0) {
                        thumbnail = $scope.uploadedFiles[index].Thumbnail;
                    }
                }


                $uibModal.open({
                    templateUrl: "/app/common/media-popup.html",
                    controller: "MediaPopupController",
                    resolve: {
                        file: function () {
                            return {
                                filepath: filepath,
                                isVideo: isVideoFile,
                                FileType: type,
                                Thumbnail: thumbnail
                            }
                        }
                    }
                });
            }
            else {
                $uibModal.open({
                    templateUrl: "/app/common/media-popup-dicom.html",
                    controller: "MediaPopupDicomController",
                    resolve: {
                        fileGroup: function () {
                            return file.FileGroup

                        }
                    }
                });
            }
        }

        function assignSubmittion(assign) {

            var parameters = {
                SubmissionId: $scope.submission.SubmissionId,
                Conclusion: $scope.submission.Conclusion,
                Comments: $scope.submission.Comments,
                AssignToTeacher: assign
            };
            $scope.loading = true;
            submissionService
                .complete(parameters)
                .then(function (response) {
                    $scope.loading = false;

                    var res = response.data.Success;

                    if (res === true) {
                        $scope.subLoaded = $rootScope.subLoaded = false;
                        Notification.clearAll();
                        Notification.info({ message: $filter('translate')(response.data.Message.msg) });
                        clearSubmission();
                    } else {
                        $scope.subLoaded = $rootScope.subLoaded = false;
                        Notification.clearAll();
                        Notification.warning({ message: $filter('translate')(response.data.Message.msg) });
                        clearSubmission();
                    }



                });


        }
        /////save
        function complete(assign) {
            $scope.wasSaved = true;
            //todo check if teacher in group
            if (assign) {
                $scope.loading = true;

                assignSubmittion(true);


            }
            else {
            }
        }

        function updateTaggedFileCount() {
            $scope.filesTagged = _($scope.uploadedFiles).countBy("Completed").true;
            return $scope.filesTagged;
        }

        function updateUploadedFileCount() {
            var uploadedFiles = _($scope.uploadedFiles).where({ Progress: 100 });
            $scope.filesUploaded = angular.isNullOrUndefined(uploadedFiles) ? 0 : uploadedFiles.length;
            return $scope.filesUploaded;
        }

        function updateFileDuplicates() {
            $scope.duplicates = _($scope.uploadedFiles).countBy("Duplicate").true;
            if (!$scope.duplicates) {
                $scope.duplicates = 0;
            }
            return $scope.duplicates;
        }

        function closeUpload(toState) {
            console.log(toState + "state zero");
            if ($scope.wasUnsavedGeneral || $scope.wasUnsavedTagging || $scope.wasUnsavedConclusion) {
                if ($scope.wasSaved && $scope.uploadedFiles.length > 0) {
                    modalService
                    .confirm({
                        title: "close_submission",
                        message: "there_are_unsaved_changes_do_you_wish_to_close_the_submission_anyway",
                        okLabel: "save",
                        cancelLabel: "dont_save"
                    })
                    .then(function () {
                        if ($scope.wasUnsavedGeneral) {
                            updateSubmission();
                            //todo
                        } else if ($scope.wasUnsavedTagging) {
                            //todo
                            if ($scope.selectedFile && $scope.selectedFile.Id) {
                                updateFileDetails();
                            } else {
                                console.log("state null");
                                clearSubmission();
                            }

                        } else if ($scope.wasUnsavedConclusion) {
                            complete(false);
                            //todo
                        }
                        //clearSubmission(toState);//todo save items
                    }, function () {
                        console.log(toState + "state undef");
                        clearSubmission(toState);//just close
                    });
                } else {

                    modalService
                        .confirm({
                            title: "delete_submission",
                            message: "there_are_unsaved_changes_do_you_wish_to_delete_the_submission_anyway",
                            okLabel: "yes",
                            cancelLabel: "no"
                        })
                        .then(function () {

                            $scope.subLoaded = $rootScope.subLoaded = false;

                            clearSubmission(toState);
                        }, function () {

                        });
                }

            } else {

                clearSubmission(toState);
            }



        }
        function validSubmission() {
            if ($scope.submission.SupervisorId == null || $scope.submission.UltrasoundType.length == 0 || $scope.submission.VideoDate == null) {
                return false;
            }
            else {
                return true;
            }
        }
        function clearSubmission(toState) {
            validSubmission();
            console.log(toState + "state zero");
            clearFileObjs();
            $scope.subLoaded = $rootScope.subLoaded = false;
            if (toState == "studentcollege.submissionHistory") {
                $scope.isValidGeneral = true;
            }
            if (!(validSubmission() && $scope.uploadedFiles.length > 0)) {
                $scope.loading = true;
                submissionService
                    .remove($scope.submission.SubmissionId)
                    .then(function (response) {
                        $scope.loading = false;
                        Notification.clearAll();
                        Notification.success({ message: $filter('translate')("submission_deleted") });
                    });
            }

            $scope.uploadedFiles = [];
            $scope.files = [];
            $scope.submission = null;


            if (!angular.isNullOrUndefined(toState)) {
                $state.go(toState);
            } else if (!angular.isNullUndefinedOrWhitespace($stateParams.submissionId)) {
                $state.go("student.collegesubmissionHistory", {}, { reload: true });
            } else {
                $state.go("student.collegeSubmission", { submissionId: null });
            }
            init();

        }

        function openCollapse(invalid, event, key) {

            if (!invalid) {

                switch (key) {
                    case 'General':
                        $scope.status = {
                            General: !$scope.status[key],
                            Tag: false,
                            Conclusion: false
                        }

                        break;
                    case 'Tag':
                        $scope.status = {
                            General: false,
                            Tag: !$scope.status[key],
                            Conclusion: false
                        }

                        break;
                    case 'Conclusion':
                        $scope.status = {
                            General: false,
                            Tag: false,
                            Conclusion: !$scope.status[key]
                        }

                        break;
                }


                return $scope.status;
            }
            return;
        };

        function goToFileTagging() {

            //todo for all collapse
            if ($scope.isValidGeneral) {
                $scope.oneAtATime = true;
                $scope.status = {
                    General: false,
                    Tag: true,
                    Conclusion: false
                }
                goToConclusion();
            }
        }

        function clearFileObjs() {
            var tempFiles = angular.copy($scope.uploadedFiles);
            $scope.uploadedFiles = [];
            angular.forEach(tempFiles, function (v, k) {
                $scope.uploadedFiles.push({
                    Id: v.Id,
                    Completed: v.Completed,
                    FileType: v.FileType,
                    Filepath: v.Filepath,
                    HasUnrepliedMessages: v.HasUnrepliedMessages,
                    Messages: v.Messages,
                    Observations: v.Observations,
                    FileGroup: v.FileGroup,
                    isDicom: v.isDicom,
                    Progress: v.Progress,
                    Thumbnail: v.Thumbnail,
                    Uploaded: v.Uploaded,
                    ViewType: v.ViewType,
                    Duplicate: v.Duplicate
                })

            })

        }

        function goToConclusion() {
            var isValid = $scope.allFilesTagged && $scope.uploadedFiles !== null && $scope.uploadedFiles.length > 0
                        && $scope.duplicates + $scope.filesTagged === $scope.uploadedFiles.length
                        && $scope.filesTagged === $scope.filesUploaded;
            if (isValid) {
                $scope.oneAtATime = true;
                $scope.status = {
                    General: false,
                    Tag: false,
                    Conclusion: true
                };
                //todo  clean cache
                console.log($scope.files);
                clearFileObjs();
                console.log($scope.uploadedFiles);

                $scope.files = null;
            }
        }

        loadSubmission();

        function save() {
            console.log($scope.submission);
            console.log($scope.submission.SupervisorId);
            console.log($scope.submission.UltrasoundType);
            console.log($scope.submission.VideoDate);
            $scope.collegeUpload = {
                Id: $scope.submission.SubmissionId,
                SupervisorId: $scope.submission.SupervisorId,
                RegistrationTypes: $scope.submission.UltrasoundType,
                RegistrationDate: $scope.submission.VideoDate
            };

            //$stateParams.submissionId = $scope.submission.SubmissionId;
            submissionService
                .saveCollegeUpload($scope.collegeUpload)
                .then(function (response) {
                    console.log($scope.subLoaded);
                    console.log($rootScope.subLoaded);
                    if (response) {
                        $scope.isValidGeneral = true;
                        $scope.wasUnsavedGeneral = false; $scope.wasUnsavedTagging = false; $scope.wasUnsavedConclusion = false;
                        clearSubmission();
                    }
                });
        }

    };

    controller.$inject = [
        "$scope",
        "$timeout",
        "$localStorage",
        "$state",
        "$uibModal",
        "$stateParams",
        "modalService",
        "Upload",
        "submissionService",
        "appSettings",
        "config",
        "$window",
        "$filter",
        "Notification",
        "$rootScope",
        "$translate"
    ];

    angular
        .module("Eportfolio.student")
        .controller("studentcollege-submission.controller", controller);

}(angular));