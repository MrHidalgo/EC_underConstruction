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
        $rootScope
    ) {


        $scope.ultrasoundSelected = ultrasoundSelected;
        $scope.viewSelected = viewSelected;
        $scope.loadSubmission = loadSubmission;
        $scope.updateSubmission = updateSubmission;
        $scope.uploadFiles = uploadFiles;
        $scope.loadFileDetails = loadFileDetails;
        $scope.updateFileDetails = updateFileDetails;
        $scope.loadFindings = loadFindings;
        $scope.enlarge = enlarge;
        $scope.closeUpload = closeUpload;
        $scope.loadNextFile = loadNextFile;
        $scope.loadPreviousFile = loadPreviousFile;
        $scope.uploadToSub = uploadToSub;
        $scope.complete = complete;
        $scope.deleteFile = deleteFile;
        $scope.assignSubmittion = assignSubmittion;
        $scope.goToFileTagging = goToFileTagging;
        $scope.goToConclusion = goToConclusion;
        $scope.isValidFileDetail = isValidFileDetail;
        $scope.deleteUsType = deleteUsType;
        $scope.setIndicationsAndViews = setIndicationsAndViews;
        $scope.setIndicationOnClick = setIndicationOnClick;
        $scope.selectedIndication = selectedIndication;
        $scope.checkGeneralValidation = checkGeneralValidation;
        $scope.isValidGeneralForm = isValidGeneralForm;
        $scope.updateFileDuplicates = updateFileDuplicates;
        $scope.isValidTagForm = isValidTagForm;
        $scope.openCollapse = openCollapse;

        /**
         *
         * @param someValue
         * @return {string}
         */
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

        //settings strart

        //$scope.storage = $localStorage.$default({
        //    submission: {
        //        id: $scope.EmptyGuid
        //    }
        //});
        var extensions = config.videoExtensions.split(' ');
        var allowedVideoExtensions = extensions.join(',.');
        $scope.mFileSize = 250;
        allowedVideoExtensions = "." + allowedVideoExtensions;
        $scope.settings = {
            accept: "image/*," + allowedVideoExtensions,
            pattern: "image/*," + allowedVideoExtensions,
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
            // $rootScope.contactPath = '/app/home/contact-us.html';

            //console.log($rootScope.contactPath);
            console.log($scope.isAuth);
            $scope.subLoaded = $rootScope.subLoaded = false;
            $scope.isValidGeneral = false;
            $scope.GeneralSaved = false;
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
                //if (angular.isNullOrUndefined($localStorage.submission)) {
                subId = $scope.EmptyGuid;
                //} else {
                //    subId = $localStorage.submission.id;
                //}
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
        // on close brouser window
        $scope.$on('onBeforeUnload', function (e, confirmation) {
            if (($scope.subLoaded == true && $rootScope.subLoaded == true) && $scope.isAuth) {
                confirmation.message = "All data willl be lost.";
                e.preventDefault();

            }
        });


        $scope.$parent.$on('$stateChangeStart',
             function (event, toState, toParams, fromState, fromParams) {

                 if (($scope.subLoaded == true && $rootScope.subLoaded == true) && fromState.name === "teacher.submission" && $scope.isAuth) {
                     event.preventDefault();

                     if (toState && toState.name) {
                         closeUpload(toState.name);
                     } else {
                         closeUpload();
                     }


                 }
             }
        );

        // modal close

        //settings end
        // --- general --- start
        function loadSubmission(files) {


            if (angular.isNullOrUndefined($scope.submission.SubmissionId) ||
                $scope.submission.SubmissionId === $scope.EmptyGuid) {

                return true;
            }
            $scope.loading = true;
            //$stateParams.submissionId = $scope.submission.SubmissionId;
            submissionService
                .getFull($scope.submission.SubmissionId)
                .then(function (response) {
                    $scope.loading = false;
                    console.log(response)

                    if (response.SubmissionId === $scope.EmptyGuid || !response) {
                        clearSubmission();
                        $scope.loading = false;
                        return;
                    }
                    if (response.Files && response.Files.length > 0) {
                        $scope.uploadedFiles = response.Files;
                    }


                    $scope.submission = {
                        SubmissionId: response.SubmissionId,
                        UltrasoundType: [],
                        HealthyTest: response.HealthyTest,
                        PatientAge: response.PatientAge,
                        PatientGender: response.PatientGender,
                        Comments: response.Comments,
                        Approved: response.Approved,
                        Conclusion: response.Conclusion
                    };
                    angular.forEach(response.UltrasoundType, function (v, k) {
                        $scope.submission.UltrasoundType.push({ Id: v.Id, Name: v.Name });

                    });
                    $scope.submission.Indications = angular.isNullUndefinedOrWhitespace(response.Indications)
                        ? []
                        : response.Indications.split(",");


                    $scope.ultrasoundTypes = response.UsTypes;
                    //$scope.viewsAndIndication = response.UltrasoundType;
                    setIndicationsAndViews(response.UltrasoundType);
                    if (files && files.length > 0) {
                        uploadToSub(files, response.SubmissionId);
                    }
                    ultrasoundSelected();
                    updateTaggedFileCount();
                    updateUploadedFileCount();
                    $scope.loading = false;
                    $scope.subLoaded = $rootScope.subLoaded = true;
                    updateNavigation();

                    isValidGeneralForm();
                    isValidTagForm();
                    loadNextFile();


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

                        $scope.loading = false;
                        Notification.clearAll();
                        Notification.info({ message: $filter('translate')("submission_updated") });
                        $scope.GeneralSaved = true;
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
            }
        }

        function deleteUsType($item) {
            $scope.loading = true;
            submissionService
                .removeTagsFromSubmission($scope.submission.SubmissionId, $item.Id)
                .then(function (response) {
                    $scope.loading = false;
                    if (!response) {
                        return;
                    }
                    var array = response.data;
                    //untag uploadedFiles
                    angular.forEach($scope.uploadedFiles,
                        function (value, key) {
                            if (value.Id !== null && -1 !== array.indexOf(value.Id)) {
                                $scope.uploadedFiles[key].Completed = false;
                                $scope.allFilesTagged = false;
                            }
                        });
                    ultrasoundSelected();
                    //loadIndications();

                    //isValidGeneralForm();

                    updateTaggedFileCount();
                    // todo check valid
                });
        }

        function setIndicationsAndViews(viewsAndIndicationObj) {
            $scope.viewsAndIndication = viewsAndIndicationObj;
            var indic = [];
            var vis = [];
            angular.forEach(viewsAndIndicationObj,
                function (value) {
                    angular.forEach(value.Indications,
                        function (v, k) {
                            if (_(indic).some({ Name: v.Name })) {
                                indic.push({ Id: v.Id, Name: v.Name, Selected: v.Selected, Hidden: true });
                            } else {
                                indic.push({ Id: v.Id, Name: v.Name, Selected: v.Selected, Hidden: false });
                            }

                        }
                    );

                    angular.forEach(value.Views,
                        function (v) {
                            vis.push({ Id: v.Id, Name: v.Name, Group: value.Name });
                        }
                    );
                }
            );

            $scope.indications = indic;
            $scope.views = vis;
            //console.log($scope.views);
        }

        function setIndicationOnClick(indication) {
            var inds = _($scope.indications).where({ Name: indication.Name });

            if (inds) {
                angular.forEach(inds,
                    function (v, k) {
                        var index = $scope.indications.indexOf(v);
                        if (-1 !== index) {
                            $scope.indications[index].Selected = indication.Selected;
                        }

                    });

            }
        }

        function loadIndicationsAndViews() {

        }

        function ultrasoundSelected() {
            var ultrasoundType = _($scope.submission.UltrasoundType).pluck("Id");

            var submissionId = $scope.submission.SubmissionId;
            $scope.loading = true;
            submissionService
                .loadIndicationsAndViews(submissionId, ultrasoundType)
                .then(function (response) {
                    $scope.loading = false
                    //$scope.viewsAndIndication = response.data;
                    setIndicationsAndViews(response.data);


                });

            //loadIndications();
            //isValidGeneralForm();

        }
        // --- general --- end

        // --- events on Change --- start
        function checkGeneralValidation(objKey) {

            switch (objKey) {
                case 'UltrasoundType':
                    {
                        if ($scope.submission[objKey] !== null && $scope.submission[objKey].length > 0) {
                            $scope.validationGeneral[objKey] = false;
                        } else {
                            $scope.validationGeneral[objKey] = true;
                        }
                        $scope.pristineGeneral[objKey] = false;
                        break;
                    }
                case 'PatientAge':
                    {
                        //$scope.submission[objKey] != null && $scope.submission[objKey] === parseInt($scope.submission[objKey], 10) &&
                        if ($scope.submission[objKey] > -1 &&
                            $scope.submission[objKey] <= 150 &&
                            $scope.submission[objKey] === parseInt($scope.submission[objKey])) {
                            $scope.validationGeneral[objKey] = false;
                        } else {
                            $scope.validationGeneral[objKey] = true;
                        }
                        $scope.pristineGeneral[objKey] = false;
                        break;
                    }
                case 'PatientGender':
                    {
                        if (!angular.isNullOrUndefined($scope.submission[objKey])) {
                            $scope.validationGeneral[objKey] = false;
                        } else {
                            $scope.validationGeneral[objKey] = true;
                        }
                        $scope.pristineGeneral[objKey] = false;
                        break;
                    }
                case 'Indications':
                    {
                        var selected = selectedIndication();
                        // console.log("check valid gen");
                        if (selected) {
                            $scope.validationGeneral[objKey] = false;
                        } else {
                            $scope.validationGeneral[objKey] = true;
                        }
                        $scope.pristineGeneral[objKey] = false;
                        break;
                    }
                case 'HealthyTest':
                    {
                        if ($scope.submission[objKey] === true) {
                            //                        $scope.submission.indications = [];
                            $scope.submission.PatientGender = null;
                            $scope.submission.PatientAge = undefined;
                            if ($scope.indications !== null || $scope.indications.length > 0) {
                                angular.forEach($scope.indications,
                                    function (value) {
                                        value.Selected = false;
                                    });
                            }
                            $scope.validationGeneral.Indications = false;
                            $scope.pristineGeneral.Indications = true;

                            $scope.validationGeneral.PatientGender = false;
                            $scope.pristineGeneral.PatientGender = true;

                            $scope.validationGeneral.PatientAge = false;
                            $scope.pristineGeneral.PatientAge = true;

                        } else {
                            $scope.validationGeneral.Indications = true;
                            $scope.pristineGeneral.Indications = true;

                            $scope.validationGeneral.PatientGender = true;
                            $scope.pristineGeneral.PatientGender = true;

                            $scope.validationGeneral.PatientAge = true;
                            $scope.pristineGeneral.PatientAge = true;

                        }

                        break;
                    }

            }

            //isValidGeneralForm();

        }

        function selectedIndication() {
            var selectedIndication = _($scope.indications).some({ Selected: true });

            return (!selectedIndication) ? false : true;

        }
        // --- events on Change --- end


        // --- check validation staps events --- start 
        function isValidGeneralForm() {

            var valid = $scope.submission.UltrasoundType !== null && $scope.submission.UltrasoundType.length !== 0;
            if (!valid) {
                Notification.clearAll();
                Notification.info({ message: $filter("translate")("choose_us_type") }); // todo 
                $scope.isValidGeneral = false;

                return $scope.isValidGeneral;
            }

            if ($scope.submission.HealthyTest === null) {

                $scope.isValidGeneral = false;
                return $scope.isValidGeneral;
            } else if (true === $scope.submission.HealthyTest && valid) {
                $scope.isValidGeneral = true;
                goToFileTagging();
                return $scope.isValidGeneral;
            } else if (false === $scope.submission.HealthyTest) {
                if (angular.isNullOrUndefined($scope.submission.PatientAge) ||
                    $scope.submission.PatientAge > 150 ||
                    $scope.submission.PatientAge < 0) {
                    //todo invalid PatientAge
                    Notification.clearAll();
                    Notification.info({ message: $filter("translate")("enter_valid_patient_age") });
                    $scope.isValidGeneral = false;
                    return $scope.isValidGeneral;
                }
                if (angular.isNullOrUndefined($scope.submission.PatientGender)) {
                    Notification.clearAll();
                    Notification.info({ message: $filter("translate")("choose_patient_gender") });
                    $scope.isValidGeneral = false;
                    return $scope.isValidGeneral;
                }
                var selected = selectedIndication();

                if (!selected) {
                    Notification.clearAll();
                    Notification.info({ message: $filter("translate")("choose_indications") });
                    $scope.isValidGeneral = false;
                    return $scope.isValidGeneral;
                }
            }

            $scope.isValidGeneral = true;
            goToFileTagging();
            return $scope.isValidGeneral;
        }

        function isValidFileDetail() {

            if ($scope.selectedFile === null || $scope.selectedFile.ViewType === null) {
                Notification.clearAll();
                Notification.warning({ message: $filter('translate')("please_select_a_view") });

                return false;
            }
            if ($scope.findings === null || $scope.findings.length === 0) {
                return false;
            }
            var optionUnselected = _($scope.findings)
                .some(function (finding) {
                    return !finding.SelectedOptionId || finding.SelectedOptionId === 0; //todo
                });

            if (optionUnselected) {
                Notification.clearAll();
                Notification.warning({ message: $filter('translate')("please_select_a_finding") });

                return false;

            }

            return true;
        }

        function isValidTagForm() {
            if ($scope.uploadedFiles !== null && $scope.uploadedFiles.length > 0 && $scope.duplicates + $scope.filesTagged === $scope.uploadedFiles.length &&
                $scope.filesTagged === $scope.filesUploaded) {
                //todo go to conclusion
                $scope.allFilesTagged = true;
                goToConclusion();
                return $scope.allFilesTagged;
            } else {
                $scope.allFilesTagged = false;
                return $scope.allFilesTagged;
            }

        }

        // --- check validation staps events --- end 


        // --- tagging --- start
        function uploadFiles(files) {
            if (angular.isNullOrUndefined($scope.submission.SubmissionId) ||
                $scope.submission.SubmissionId === $scope.EmptyGuid) {
                $scope.loading = true;

                submissionService
                    .create()
                    .then(function (id) {
                        //$state.submissionId = id;
                        //$scope.storage.submission = { id: id };
                        $scope.submission.SubmissionId = id;
                        $scope.loading = false;
                        $scope.subLoaded = $rootScope.subLoaded = true;

                        loadSubmission(files);


                    });
            } else {

                uploadToSub(files, $scope.submission.SubmissionId);

            }

        }

        //function checkDisablingUpload() {
        //    isValidTagForm
        //}

        function uploadToSub(files, id) {
            if (id !== null || id !== $scope.EmptyGuid) {

                $scope.subLoaded = $rootScope.subLoaded = true;
                $scope.disabledFileSelect = true;
                $scope.files = files; //todo
                //$scope.selectedFiles = selectedFiles;
                // check if files exist
                var uploadedCount = $scope.uploadedFiles.length;
                updateTaggedFileCount();
                angular.forEach(files,
                    function (file, index) {
                        if (file.size <= $scope.mFileSize * 10 ^ 6 && $scope.uploadedFiles.length + index < $scope.settings.maxFiles) {

                            $scope.uploadedFiles.push(file);
                            //file = $scope.uploadedFiles[uploadedCount + index];
                            if (!file.Uploaded && !file.Duplicate) {

                                var detail = {
                                    SubmissionId: id,
                                    Filename: file.name,
                                    Filesize: file.size,
                                    Firstbytes: []
                                };
                                submissionService
                                    .preupload(detail)
                                    .then(function (response) {

                                        var filedetail = response.data;
                                        if ($scope.status.Tag == false && $scope.status.General == false) {
                                            goToFileTagging();
                                        }
                                        // $timeout(function () {
                                        //if (filedetail === $scope.EmptyGuid) {
                                        //    // console.debug("duplicate");
                                        //    file.Id = filedetail;
                                        //    file.Duplicate = true;
                                        //    updateFileDuplicates();
                                        //    Notification.warning({ message: $filter('translate')("duplicate") });
                                        //    if ((index + 1 === files.length)) {// && (file.Duplicate || (file.Progress === 100 && file.Uploaded))) {
                                        //        $scope.disabledFileSelect = false;
                                        //        isValidTagForm();
                                        //    }
                                        //}
                                        //else
                                        //{
                                        //file.Complete = false;
                                        file.Id = filedetail
                                        if (angular.isVideoFile(file.name) && !angular.hasLocalVideoPreview(file.name)) {
                                            file.DisabledPreview = true;
                                        }
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
                                                            //file.uoload.abort();
                                                            updateUploadedFileCount();
                                                            updateNavigation();
                                                            if ((index + 1 === files.length)) {// && (file.Duplicate || (file.Progress === 100 && file.Uploaded))) {
                                                                console.log(file)
                                                                $scope.disabledFileSelect = false;
                                                                isValidTagForm();
                                                            }
                                                        });
                                                    } else {
                                                        //todo show message

                                                        updateUploadedFileCount();
                                                        updateNavigation();
                                                        if ((index + 1 === files.length)) {// && (file.Duplicate || (file.Progress === 100 && file.Uploaded))) {
                                                            $scope.disabledFileSelect = false;
                                                            isValidTagForm();
                                                        }
                                                    }

                                                });
                                            },
                                            function (response) {
                                                if (response.status > 0)
                                                    $scope.errorMsg = response.status + ': ' + response.data;
                                            },
                                            function (evt) {
                                                file.Progress = Math.min(99,
                                                    parseInt(100.0 *
                                                        evt.loaded /
                                                        evt.total));
                                            }
                                        );

                                        //}

                                        //});

                                    })
                                console.log(index);
                                console.log(files.length)
                            }

                        }
                    }

                );

            }
            //user cann`t add files when files are uploading
        }
        $scope.$watch($scope.disabledFileSelect, function () {
            //console.log($scope.disabledFileSelect)
        });


        function loadFileDetails(index) { //selectedFile


            $scope.selectedFile = $scope.uploadedFiles[index];
            // console.log($scope.selectedFile);
            // console.log("duplicate");
            if ($scope.selectedFile.Duplicate) {
                return;
            }
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

                    $scope.selectedFileIndex = _($scope.uploadedFiles).findIndex({ Id: $scope.selectedFile.Id });

                    //loadViews();
                    loadFindings();
                    updateNavigation();
                });
        }

        function updateFileDetails() {
           
            if (isValidFileDetail()) {
                $scope.loading = true;
                submissionService
                    .updateFileDetails($scope.selectedFile, $scope.findings)
                    .then(function (response) {
                        $scope.loading = false;
                        //                        if (!response) {
                        //                            return;
                        //                        }
                        Notification.clearAll();
                        Notification.info({ message: $filter('translate')("file_successfully_tagged") });

                        $scope.selectedFile.Completed = true;
                       
                        var tf = updateTaggedFileCount();
                        var df = updateFileDuplicates();
                        var uf = updateUploadedFileCount();

                        var validT = isValidTagForm();

                        var untaggedFileIndex = _($scope.uploadedFiles).findIndex(function (file) {
                            return (
                                !file.Completed &&
                                !file.Duplicate);
                        });

                        if (untaggedFileIndex !== -1) {
                            //loadFileDetails($scope.files[untaggedFileIndex]);
                            loadFileDetails(untaggedFileIndex);

                        }

                        goToConclusion();



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
                        $scope.loading = false;
                        if (!response) {
                            Notification.clearAll();
                            Notification.error({ message: $filter('translate')("unable_to_delete_file") });
                            //isValidTagForm();
                        } else {
                            $scope.uploadedFiles.splice(index, 1);
                            loadNextFile();
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

        function loadFindings() {

            $scope.findings = [];
            if ($scope.selectedFile.ViewType === null) {
                return;
            }
            var viewType = $scope.selectedFile.ViewType;

            if (!viewType) {
                return;
            }
            $scope.loading = true;
            submissionService
                .loadFindings($scope.selectedFile.Id, viewType)
                .then(function (response) {
                    $scope.loading = false;
                    if (!response) {
                        return;
                    }

                    $scope.findings = response;

                });
        }

        function viewSelected() {
            $scope.isDirty = true;
            loadFindings();
        }

        function enlarge(file) {

            if (!file) {
                return;
            }
            if (file.DisabledPreview) {
                Notification.info({ message: "File has not local preview" })
            }
            var index = $scope.uploadedFiles.indexOf(file);
            if (-1 === index) {
                return;
            }
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
        // --- tagging --- end


        // ---conclusions  start---
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

                    if (res == true) {
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

        function complete(assign) {

            if (assign) {
                modalService
                    .confirm({
                        title: "assessed_by_teacher",
                        message: "are_you_realy_want_assign_submission_to_teacher",
                        okLabel: "yes",
                        cancelLabel: "no"
                    })
                    .then(function () {
                        assignSubmittion(true);

                    },
                        function () {
                            //assignSubmittion(false);

                        });
            } else {
                assignSubmittion(assign);

            }

        }

        // --- file counters --- start
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
        // --- file counters --- end

        // --- closing upload --- s
        function closeUpload(toState) {
            var title;
            var message;
            if ($scope.isValidGeneral && $scope.uploadedFiles.length > 0) {
                title = "close_submission";
                message = "there_are_unsaved_changes_do_you_wish_to_close_the_submission_anyway";
            } else {
                title = "delete_submission";
                message = "there_are_unsaved_changes_do_you_wish_to_delete_the_submission_anyway";
            }
            modalService
                        .confirm({
                            title: title,
                            message: message,
                            okLabel: "yes",
                            cancelLabel: "no"
                        })
                        .then(function () {

                            $scope.subLoaded = $rootScope.subLoaded = false;

                            clearSubmission(toState);
                        }, function () {

                        });



        }

        function clearSubmission(toState) {
            clearFileObjs();
            $scope.subLoaded = $rootScope.subLoaded = false;
            if (!($scope.isValidGeneral && $scope.uploadedFiles.length > 0)) {
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
                $state.go("teacher.submissionHistory", {}, { reload: true });
            } else {
                $state.go("teacher.submission", { submissionId: null });
            }
            init();

        }

        // --  navigation -- start
        function loadPreviousFile() {
            var previousFileIndex = _($scope.uploadedFiles).findLastIndex(function (file, index) {
                return index < $scope.selectedFileIndex /*&& file.Progress === 100*/ && file.Id;
            });
            if (previousFileIndex) {
                //loadFileDetails($scope.uploadedFiles[previousFileIndex]);
                loadFileDetails(previousFileIndex);
            } else {
                //$scope.selectedFile = null;
            }
        }

        function loadNextFile() {
            var nextFileIndex = _($scope.uploadedFiles).findIndex(function (file, index) {
                return index > $scope.selectedFileIndex /*&& file.Progress === 100 && file.Id;*/;
            });
            if (nextFileIndex) {
                //loadFileDetails($scope.files[nextFileIndex]);
                loadFileDetails(nextFileIndex);
            } else {
                //$scope.selectedFile = null;
            }
        }

        function updateNavigation() {
            $scope.nextEnabled = _($scope.uploadedFiles).some(function (file, index) {
                return index > $scope.selectedFileIndex /*&& file.Progress === 100*/ && file.Id && !file.Duplicate;
            });

            $scope.previousEnabled = _($scope.uploadedFiles).some(function (file, index) {
                return index < $scope.selectedFileIndex /*&& file.Progress === 100*/ && file.Id && !file.Duplicate;
            });
            return $scope.nextEnabled && $scope.previousEnabled;
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
        // --  navigation -- end



        loadSubmission();

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
        "$rootScope"
    ];

    angular
        .module("Eportfolio.teacher")
        .controller("TeacherSubmissionController", controller);

}(angular));