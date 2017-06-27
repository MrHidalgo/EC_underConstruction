angular
     .module('Eportfolio.admin')
     .controller('admin-upload-manger.controller', ['$window', '$state', '$scope', '$uibModal', 'authService', 'appSettings', 'adminService', 'dataService', 'userService', '$localStorage', function adminUserDbCtrl($window, $state, $scope, $uibModal, authService, appSettings, adminService, dataService, userService, $localStorage) {


         $scope.view = {
             archive: false,
             deleteUpload: false,
             reactivateUpload: false
         };

         $scope.urldata = appSettings.serviceUrl + 'api/Upload/Get';
         $scope.gridUploadSource = new kendo.data.DataSource({
             transport: {
                 read: {
                     url: $scope.urldata,
                     type: "GET",
                     //  dataType: "json",
                     beforeSend: function (xhr) {
                         xhr.setRequestHeader('Authorization', 'Bearer ' + $localStorage.accessToken);
                     },
                     cache: false
                 }
             },
             schema: {
                 data: "Data",
                 total: function (response) {
                     console.log(response);
                     return response.Total;
                 },

                 model: {

                     fields: {
                         Id: {
                             type: "string"
                         },
                         User: {
                             type: "string"
                         },
                         Type: {
                             type: "string"
                         },
                         UploadDate: {
                             type: "date"
                         },
                         Status: {
                             type: "string"
                         },
                         Size: {
                             type: "number"
                         },
                         FilesIncludePatient: {
                             type: "boolean"
                         },
                         FilesNotSubject: {
                             type: "boolean"
                         },
                         Other: {
                             type: "string"
                         },
                     }
                 }
             },

             pageSize: 10
         });

         approvalOptions = [
            { name: "Approved", Id: 1 },
            { name: "Rejected", Id: 2 },
            { name: "Pending assessment", Id: 3 },
            { name: "Not supervised", Id: 4 },
            { name: "None", Id: 5 }
         ];

         $scope.mainGridOptions = {
             dataSource: $scope.gridUploadSource,
             dataBound: function (e) {
                 var grid = e.sender;
                 grid.tbody.find("tr").dblclick(function (e) {
                     $scope.modify();
                     $scope.$apply();
                 });
                 var dataItems = grid.dataSource.data();
             },
             change: function (e) {
                 var grid = e.sender;
                 var currentDataItem = grid.dataItem(this.select());
                 $scope.$apply();
             },
             sortable: true,
             refresh: true,
             selectable: 'single',
             groupable: false,
             resizable: true,
             reorderable: true,
             filterable: true,
             scrollable: true,
             columnMenu: true,
             //   sortable: true,
             pageable: true,
             serverPaging: false,
             serverSorting: false,
             serverFiltering: false,
             pageable: {
                 refresh: true,
                 pageSizes: [5, 10, 20, 50],
                 buttonCount: 5
             },
             columns: [
                 {
                     field: "Id",
                     title: "Id",
                     width: "5%"
                 }, {
                     field: "User",
                     title: "User",
                     width: "5%"
                 }, {
                     field: "Type",
                     title: "Upload Type",

                     width: "5%"
                 }, {
                     field: "UploadDate",
                     template: '#= kendo.toString(UploadDate, "dd/MM/yyyy HH:MM:s") #',
                     width: "5%"
                 }, {
                     field: "Status",
                     template: '#=Status!=5 ? approvalOptions[Status-1].name : "-" #',
                     width: "5%"
                 }, {
                     field: "Size",
                     title: "Size (Mb)",
                     width: "5%"
                 },
                 {
                     title: "Reported",
                     attributes: { style: "text-align:center;" },
                     columns: [{
                         template: '<input type="checkbox" #= FilesIncludePatient ? "checked=checked" : "" # disabled="disabled" ></input>',
                         width: 50,
                         field: "FilesIncludePatient",
                         title: "Files included patient information",
                     }, {
                         field: "FilesNotSubject",
                         title: "Files not on subject",
                         template: '<input type="checkbox" #= FilesNotSubject ? "checked=checked" : "" # disabled="disabled" ></input>',
                         width: 50
                     }, {
                         field: "Other",
                         title: "Other",

                         width: 50
                     }]
                 },


                 {
                     command: [
                       //  { text: "View Details", className: "fa fa-map-marker" }, //title: " ", width: "180px"}
                           { template: "<button class='k-button' title='View'style='min-width:30px;' ng-click='viewSubmissiom($event)'><span class='fa fa-eye'></span></button>" },
                           { template: "<button class='k-button' title='Archive'style='min-width:30px;' ng-click='archiveFile($event)'><span class='fa fa-file-archive-o'></span></button>" },
                           { template: "<button class='k-button' title='Delete'style='min-width:30px;' ng-click='deleteSubmission($event)'><span class='fa fa-times'></span></button>" },
                     ], width: "5%"
                 }
             ]
         };




         $scope.viewSubmissiom = function (e) {
             var element = $(e.currentTarget);
             var row = element.closest("tr"),
               dataItem = $scope.uploadsGrid.dataItem(row);
             console.log(dataItem);
             $state.go("student.submissionPreview", { submissionId: dataItem.Id });
         }

         $scope.viewSubmissionArchive = function (e) {
             var element = $(e.currentTarget);
             var row = element.closest("tr"),
               dataItem = $scope.archivedGrid.dataItem(row);
             console.log(dataItem);
             $state.go("student.submissionPreview", { submissionId: dataItem.Id });
         }

         $scope.archiveFile = function (e) {
             var element = $(e.currentTarget);
             var row = element.closest("tr"),
               dataItem = $scope.uploadsGrid.dataItem(row);
             $scope.submissionId = dataItem.Id;
             $scope.view.archive = true;
             $scope.submitWind.center().open();
         };
         $scope.archiveUpload = function () {
             adminService.archiveUpload($scope.submissionId).then(function (response) {
                 if (response.data) {
                     $scope.submitWind.close();
                     $scope.uploadsGrid.dataSource.read();
                     $scope.archivedGrid.dataSource.read();
                 }
             });

         };
         $scope.reactivate = function () {
             adminService.reactivate($scope.submissionId).then(function (response) {
                 if (response.data) {
                     $scope.submitWind.close();
                     $scope.uploadsGrid.dataSource.read();
                     $scope.archivedGrid.dataSource.read();
                 }
             });

         };
         $scope.deleteSubmission = function (e) {
             var element = $(e.currentTarget);
             var row = element.closest("tr"),
               dataItem = $scope.uploadsGrid.dataItem(row);
             $scope.submissionId = dataItem.Id;
             $scope.view.deleteUpload = true;
             $scope.submitWind.center().open();
         };
         $scope.deleteUpload = function () {
             adminService.deleteUpload($scope.submissionId).then(function (response) {
                 if (response.data) {
                     $scope.submitWind.close();
                     $scope.uploadsGrid.dataSource.read();
                     $scope.archivedGrid.dataSource.read();
                 }
             });
         };
         $scope.deleteSubmissionArchive = function (e) {
             var element = $(e.currentTarget);
             var row = element.closest("tr"),
               dataItem = $scope.archivedGrid.dataItem(row);
             $scope.submissionId = dataItem.Id;
             $scope.view.deleteUpload = true;
             $scope.submitWind.center().open();

         };
         $scope.reActivate = function (e) {
             var element = $(e.currentTarget);
             var row = element.closest("tr"),
               dataItem = $scope.archivedGrid.dataItem(row);
             $scope.submissionId = dataItem.Id;
             $scope.view.reactivateUpload = true;
             $scope.submitWind.center().open();
         }

         $scope.closeSubmitwnd = function () {
             $scope.view.archive = false;
             $scope.view.deleteUpload = false;
             $scope.view.reactivateUpload = false;
         };
         $scope.cancelSubmit = function () {
             $scope.submitWind.close();
         };


         /////////archive part/////////////////

         $scope.urldata = appSettings.serviceUrl + 'api/Upload/GetArchive';
         $scope.gridarchiveUploadSource = new kendo.data.DataSource({
             transport: {
                 read: {
                     url: $scope.urldata,
                     type: "GET",
                     //  dataType: "json",
                     beforeSend: function (xhr) {
                         xhr.setRequestHeader('Authorization', 'Bearer ' + $localStorage.accessToken);
                     },
                     cache: false
                 }
             },
             schema: {
                 data: "Data",
                 total: function (response) {
                     console.log(response);
                     return response.Total;
                 },

                 model: {

                     fields: {
                         Id: {
                             type: "string"
                         },
                         User: {
                             type: "string"
                         },
                         Type: {
                             type: "string"
                         },
                         UploadDate: {
                             type: "date"
                         },
                         Status: {
                             type: "string"
                         },
                         Size: {
                             type: "string"
                         },
                         FilesIncludePatient: {
                             type: "boolean"
                         },
                         FilesNotSubject: {
                             type: "boolean"
                         },
                         Other: {
                             type: "string"
                         },
                     }
                 }
             },

             pageSize: 10
         });

         $scope.archivedGridOptions = {
             dataSource: $scope.gridarchiveUploadSource,
             dataBound: function (e) {
                 var grid = e.sender;
                 grid.tbody.find("tr").dblclick(function (e) {
                     $scope.modify();
                     $scope.$apply();
                 });
                 var dataItems = grid.dataSource.data();



             },
             change: function (e) {
                 var grid = e.sender;
                 var currentDataItem = grid.dataItem(this.select());
                 $scope.$apply();
             },
             sortable: true,
             refresh: true,
             selectable: 'single',
             groupable: false,
             resizable: true,
             reorderable: true,
             filterable: true,
             scrollable: true,
             columnMenu: true,
             pageable: {
                 refresh: true,
                 pageSizes: [5, 10, 20, 50],
                 buttonCount: 5
             },
             columns: [
                 {
                     field: "Id",
                     title: "Id",
                     width: "5%"
                 }, {
                     field: "User",
                     title: "User",
                     width: "5%"
                 }, {
                     field: "Type",
                     title: "Upload Type",
                     width: "5%"
                 }, {
                     field: "UploadDate",
                     template: '#= kendo.toString(UploadDate, "dd/MM/yyyy HH:MM:s") #',
                     width: "5%"
                 }, {
                     field: "Status",
                     template: '#=Status!=5 ? approvalOptions[Status-1].name : "-" #',
                     width: "5%"
                 }, {
                     field: "Size",
                     title: "Size (Mb)",
                     width: "5%"
                 }, {
                     title: "Reported",
                     attributes: { style: "text-align:center;" },
                     columns: [{
                         template: '<input type="checkbox" #= FilesIncludePatient ? "checked=checked" : "" # disabled="disabled" ></input>',
                         width: 50,
                         field: "FilesIncludePatient",
                         title: "Files included patient information",
                     }, {
                         field: "FilesNotSubject",
                         title: "Files not on subject",
                         template: '<input type="checkbox" #= FilesNotSubject ? "checked=checked" : "" # disabled="disabled" ></input>',
                         width: 50
                     }, {
                         field: "Other",
                         title: "Other",

                         width: 50
                     }]
                 },
                 {
                     command: [
                           { template: "<button class='k-button' title='View'style='min-width:30px;' ng-click='viewSubmissionArchive($event)'><span class='fa fa-eye'></span></button>" },
                           { template: "<button class='k-button' title='Reactivate'style='min-width:30px;' ng-click='reActivate($event)'><span class='fa fa-exchange'></span></button>" },
                           { template: "<button class='k-button' title='Delete'style='min-width:30px;' ng-click='deleteSubmissionArchive($event)'><span class='fa fa-times'></span></button>" },
                     ], width: "8%"
                 }
             ]
         };


     }]);