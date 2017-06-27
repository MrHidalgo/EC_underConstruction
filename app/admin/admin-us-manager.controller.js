(function () {

    // "use strict";
    angular
      .module('Eportfolio.admin')
      .controller('admin-us-manger.controller', ['$window', '$state', '$scope', '$uibModal', 'authService', 'appSettings', 'adminService', 'dataService', 'userService', '$localStorage', '$filter', 'specificConclusionService',
          function adminUserDbCtrl($window, $state, $scope, $uibModal, authService, appSettings, adminService, dataService, userService, $localStorage, $filter, specificConclusionService) {
          $scope.view = {
              IsUStypes: false,
              IsViews: false,
              IsIndications: false,
              IsTags: false,
              IsModify: false,
              IsConfirm: false,
              AddUS: false,
              IsView: false,
              EditUSItem: false,
              EditIndication: false,
              EditView: false,
              DeleteView: false,
              DeleteIndication: false,
              EditTags: false,
              DeleteTags: false,
              editIndications: false,
              editView: false,
              editTag: false,
              editAnsw: false,
              AddNewUs: false
          };
          $scope.typeSelected = {};
          $scope.current = {};
          $scope.us = {};
          $scope.us.Views = [];
          $scope.us.Indications = [];
          $scope.UsType = null;
          $scope.v = { Speciality: null };
          $scope.in = { Speciality: null };
          $scope.specialitySelected = {};
          $scope.Answers = [
                { Id: 0, Value: null }];

          $scope.Indications = [];
          $scope.maxPoints = 15;
          $scope.fixedAnswer = "Not Assessable";

          $scope.specialitylDataSource = {
              transport: {
                  read: {
                      url: appSettings.serviceUrl + "api/Specialities/GetSpecialities",
                      type: "GET",
                      dataType: "json",
                      cache: false
                  }
              }
          };
          $scope.viewsDataSource = {
              transport: {
                  read: {
                      url: appSettings.serviceUrl + "api/Ultrasound/GetViews",
                      type: "GET",
                      dataType: "json",
                      cache: false
                  }
              }
          };
          $scope.answersDataSource = {
              transport: {
                  read: {
                      url: appSettings.serviceUrl + "api/Ultrasound/GetAnswers",
                      type: "GET",
                      dataType: "json",
                      cache: false
                  }
              }
          }

          $scope.specialiytyDDLOptions = {
              dataSource: $scope.specialitylDataSource,
              autoBind: false,
              dataTextField: "Name",
              dataValueField: "Id",
              template: "{{ dataItem.Name | translate }}",
              dataBound: function (e) {
                  var items = e.sender.dataSource.data();

                  this.select(0);

              },

              select: function (e) {
                  var dataItem = this.dataItem(e.item.index());
                  if ($scope.specialiytyDDL == e.sender) {
                      $scope.specialitySelected = dataItem;
                      $filter('translate')($scope.specialitySelected.Name);
                      //  $filter('translate')(dataItem.Name);
                      $scope.ultrasoundtypesGrid.dataSource.read();
                      // console.log($scope.specialitySelected);
                      $scope.$apply();
                  }
              }
          };
          $scope.endHandler = function (e) {
              console.log(e);
          }
          $scope.readInputs = function () {
              $scope.linksDDl.dataSource.read();
              $scope.ultrasoundtypesGrid.dataSource.read();
          }

          $scope.specialityLinkslDataSource = [
                          { Name: "", Id: 0 },
                          { Name: "Ultrasound types", Id: 1 },
                          { Name: "Views", Id: 2 },
                          { Name: "Indications", Id: 3 },
                          { Name: "Tags", Id: 4 }];


          $scope.specialityLinksDDLOptions = {
              dataSource: $scope.specialityLinkslDataSource,
              dataTextField: "Name",
              dataValueField: "Id",
              dataBound: function (e) {
                  var items = e.sender.dataSource.data();
                  if ($scope.typeSelected != undefined) {
                      for (var i = 0, max = items.length; i < max; i++) {
                          elem = items[i];
                          if (elem['Name'] == $scope.typeSelected) {
                              $scope.specialityLinksDDL.select(parseInt(i))
                          }
                          //  $scope.$apply();
                      }
                  }

                  else {
                      this.select(1);
                  }

              },

              select: function (e) {
                  var dataItem = this.dataItem(e.item.index());
                  if ($scope.specialityLinksDDL == e.sender) {
                      $scope.typeSelected = dataItem;
                      // console.log($scope.typeSelected.Id);
                  }
                  if ($scope.typeSelected != null && $scope.specialitySelected != null) {
                      $scope.linksDDl.dataSource.read();
                      $scope.ultrasoundtypesGrid.dataSource.read();
                  }
                  $scope.$apply();
              },

          };


          $scope.ultrasoundtypesTbOptions = {
              items: [

                  {

                      template: "<button class='k-button' title='Create Ultrasound' ng-disabled='IsSelectedSpec()' ng-click='AddNewUS()'><i class='fa fa-plus-circle' aria-hidden='true'></button>"
                  },
                  //{
                  //    template: "<button class='k-button' title='Remove' ng-click='deleteType()' ng-disabled='isSelectedRow()'><i class='fa fa-times' aria-hidden='true'></i></button>"

                  //}
              ]
          };
          $scope.ultrasoundTbOptions = {
              items: [

                {

                    template: "<button class='k-button' title='add' ng-click='AddItem(1)'><i class='fa fa-plus-circle' aria-hidden='true'></i></button>"
                },
                 {
                     template: "<button class='k-button' title='Edit'ng-click='modifyUSItem(1)' ><i class='fa fa-pencil-square-o' aria-hidden='true'></i></button>"

                 },
                {
                    template: "<button class='k-button' title='Remove' ng-click='deleteUsType()'><i class='fa fa-times' aria-hidden='true'></i></button>"

                },
              ]
          };

          $scope.indicationsTbOptions = {
              items: [

                {

                    template: "<button class='k-button' title='add' ng-click='AddItem(3)'><i class='fa fa-plus-circle' aria-hidden='true'></i></button>"
                },
                 {
                     template: "<button class='k-button' title='Edit' ng-click='modifyUSItem(3)'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></button>"

                 },
                {
                    template: "<button class='k-button' title='Remove' ng-click='deleteIndicationConfirm()'><i class='fa fa-times' aria-hidden='true'></i></button>"

                },
              ]
          };

          $scope.viewsTbOptions = {
              items: [

                {

                    template: "<button class='k-button' title='add' ng-click='AddItem(2)'><i class='fa fa-plus-circle' aria-hidden='true'></i></button>"
                },
                 {
                     template: "<button class='k-button' title='Edit' ng-click='modifyUSItem(2)'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></button>"

                 },
                {
                    template: "<button class='k-button' title='Remove' ng-click='deleteViewConfirm()'><i class='fa fa-times' aria-hidden='true'></i></button>"

                },
              ]
          };

          $scope.tagsGridTbOptions = {
              items: [

                {

                    template: "<button class='k-button' title='add'  ng-click='AddItem(4)'><i class='fa fa-plus-circle' aria-hidden='true'></i></button>"
                },
                 {
                     template: "<button class='k-button' title='Edit' ng-click='modifyUSItem(4)'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></button>"

                 },
                {
                    template: "<button class='k-button' title='Remove' ng-click='confirmDeleteTag()'><i class='fa fa-times' aria-hidden='true'></i></button>"

                },
              ]
          };

          $scope.addUsItem = function () {

              $scope.SpecialityID = _($scope.Speciality).pluck("Id");
              adminService.addUSItem($scope.ustype, $scope.SpecialityID).then(function (dataResponse) {
                  if (dataResponse.status == 200) {
                      $scope.specialityWnd.close();
                      $scope.ultrasoundGrid.dataSource.read();
                  }
                  else {
                      // console.log(dataResponse.data);
                  }
              })

          };
          $scope.modifyItems = function (e) {
              var element = $(e.currentTarget);
              var row = element.closest("tr"),
                dataItem = $scope.ultrasoundtypesGrid.dataItem(row);
              $scope.ustypeName = dataItem.UsName;
              $scope.UsId = dataItem.Id;
              $scope.specialityWnd.setOptions({
                  title: "Edit USType",
              });
              $scope.view.IsModify = true;
              $scope.specialityWnd.center().open();
          };
          $scope.deleteUs = function (e) {
              var element = $(e.currentTarget);
              var row = element.closest("tr"),
                dataItem = $scope.ultrasoundtypesGrid.dataItem(row);
              $scope.ustypeName = dataItem.UsName;
              $scope.UsId = dataItem.Id;
              adminService.deleteUsType($scope.UsId).then(function (response) {
                  $scope.resp = response;
                  $scope.ultrasoundtypesGrid.dataSource.read();
              });
          };
          $scope.deleteIndications = function (e) {
              var element = $(e.currentTarget);
              var row = element.closest("tr"),
                dataItem = $scope.ultrasoundtypesGrid.dataItem(row);
              $scope.USId = dataItem.Id;
              var array = dataItem.Indications.split(",");
              for (var item in array) {

                  $scope.Indications.push({ Id: item, Value: array[item] });
              }
          }
          $scope.deleteView = function (e) {
              var element = $(e.target);
              // console.log();
              var row = element.closest("td");
              $scope.viewId = element.closest("td").prev()[0].textContent;
              // console.log($scope.viewId);
              dataItem = $scope.ultrasoundtypesGrid.dataItem(row[0]);
              $scope.viewname = row[0].textContent;
              adminService.deleteView($scope.viewId).then(function (response) {
                  $scope.resp = response;
                  $scope.ultrasoundtypesGrid.dataSource.read();
              });

          };

          $scope.removeTag = function (e) {
              var element = $(e.target);
              var row = element.closest("td");
              $scope.TagId = element.closest("td").prev()[0].textContent;
              // $scope.TagName = row[0].textContent;
              adminService.removeTag($scope.TagId).then(function (response) {
                  $scope.resp = response;
                  $scope.ultrasoundtypesGrid.dataSource.read();
              });
          }
          $scope.removeAnswers = function (e) {
              var element = $(e.target);
              $scope.Answers = [];
              var row = element.closest("td");
              $scope.findingid = element.closest("td").prev().prev()[0].textContent;
              console.log($scope.findingid);
              //var asws = row[0].textContent.split(",");
              //for (var item in asws) {
              //    $scope.Answers.push({ Id: item, Value: asws[item] });
              //}
          }
          $scope.SaveUltrasound = function () {
              adminService.saveUS($scope.UsId, $scope.ustypeName, $scope.specialitySelected.Id, 1, null, 0).then(function (response) {
                  if (!response) {
                      return;
                  }
                  // console.log(response);
                  $scope.specialityWnd.close();
                  $scope.ultrasoundtypesGrid.dataSource.read();
              });

          }

          $scope.modifyIndication = function (e) {
              var element = $(e.currentTarget);
              var row = element.closest("tr"),
                dataItem = $scope.ultrasoundtypesGrid.dataItem(row);
              $scope.USId = dataItem.Id;
              var array = dataItem.Indications.split(",");
              for (var item in array) {

                  $scope.Indications.push({ Id: item, Value: array[item] });
              }

              $scope.specialityWnd.setOptions({
                  title: "Edit Indications",
              });
              $scope.view.editIndications = true;
              $scope.specialityWnd.center().open();
          }
          $scope.moveUp = function (index) {
              if (index == 0) {
                  return;
              }
              for (var ind in $scope.Indications) {
                  if (ind == index) {
                      var tmp = $scope.Indications[ind];
                      var indexUp = $scope.Indications[ind - 1];
                      $scope.Indications[ind] = indexUp;
                      $scope.Indications[ind - 1] = tmp;
                  }
              }
          }
          $scope.moveDown = function (index) {
              if (index == $scope.Indications.length-1) {
                  return;
              }
              for (var ind in $scope.Indications) {
                  if (ind == index) {
                      var tmp = $scope.Indications[index];
                      var indexUp = $scope.Indications[index + 1];
                      $scope.Indications[index] = indexUp;
                      $scope.Indications[index + 1] = tmp;
                  }
              }
              //console.log($scope.Indications);
          }
          $scope.modifyView = function (e) {
              var element = $(e.target);
              var row = element.closest("td");
              $scope.viewId = row.prev().text();
              $scope.viewname = row.text();
              $scope.viewSort = row.next().text();

              $scope.specialityWnd.setOptions({
                  title: "Edit View",
              });
              $scope.view.editView = true;
              $scope.specialityWnd.center().open();
          }
          $scope.SaveView = function () {
              adminService.saveUS(0, $scope.viewname, $scope.specialitySelected.Id, 2, null, $scope.viewId, null, $scope.viewSort).then(function (response) {
                  if (!response) {
                      return;
                  }

                  // console.log(response);
                  $scope.specialityWnd.close();
                  $scope.ultrasoundtypesGrid.dataSource.read();
              });
          }
          $scope.modifyTags = function (e) {
              var element = $(e.target);
              var row = element.closest("td");
              $scope.TagId = element.closest("td").prev()[0].textContent;
              $scope.TagName = row.text();
              $scope.tagSortCriteria = row.next().text();//Content;
              $scope.specialityWnd.setOptions({
                  title: "Edit Tag",
              });
              $scope.view.editTag = true;
              $scope.specialityWnd.center().open();
          };

          $scope.EditTag = function () {
              // var aswrs = _($scope.Answers).pluck("Value");
              adminService.editTag($scope.TagId, $scope.TagName, null, null, $scope.tagSortCriteria).then(function (dataResponse) {
                  if (dataResponse.status == 200) {
                      $scope.specialityWnd.close();
                      $scope.ultrasoundtypesGrid.dataSource.read();
                  }
              });
          };
          $scope.SaveIndication = function () {
              var indications = _($scope.Indications).pluck("Value");
              adminService.saveUS($scope.USId, null, $scope.specialitySelected.Id, 3, null, 0, indications, 0).then(function (response) {
                  if (!response) {
                      return;
                  }

                  // console.log(response);
                  $scope.specialityWnd.close();
                  $scope.ultrasoundtypesGrid.dataSource.read();
              });

          }
          $scope.modifyAnswers = function (e) {
              var element = $(e.target);
              $scope.Answers = [];
              var row = element.closest("td");
              $scope.findingid = element.closest("td").prev().prev().prev()[0].textContent;

              console.log($scope.findingid);
              var asws = row[0].textContent.split(",");
              for (var item in asws) {
                  $scope.Answers.push({ Id: item, Value: asws[item] });
              }
              //    dataItem = $scope.ultrasoundtypesGrid.dataItem(row[0]);
              //;
             
              $scope.specialityWnd.setOptions({
                  title: "Edit Answers",
              });
              $scope.view.editAnsw = true;
              $scope.specialityWnd.center().open();
          };
          $scope.modifyAsws = function () {
              var ans = _($scope.Answers).pluck("Value");
              adminService.editTag($scope.findingid, null, null, ans).then(function (dataResponse) {
                  if (dataResponse.status == 200) {
                      $scope.specialityWnd.close();
                      $scope.ultrasoundtypesGrid.dataSource.read();
                  }
              });

          }
          $scope.moveUpAnswer = function (index) {
              if (index == 0) {
                  return;
              }
              for (var ind in $scope.Answers) {
                  if (ind == index) {
                      var tmp = $scope.Answers[ind];
                      var indexUp = $scope.Answers[ind - 1];
                      $scope.Answers[ind] = indexUp;
                      $scope.Answers[ind - 1] = tmp;
                  }
              }
          };
          $scope.moveDownAnswer = function (index) {
              if (index == $scope.Answers.length - 1) {
                  return;
              }
              for (var ind in $scope.Answers) {
                  if (ind == index) {
                      var tmp = $scope.Answers[index];
                      var indexUp = $scope.Answers[index + 1];
                      $scope.Answers[index] = indexUp;
                      $scope.Answers[index + 1] = tmp;
                  }
              }
          }

          $scope.deleteUsType = function () {

              //$scope.notfadmin.show("Hi!");

              adminService.deleteUsType($scope.currentUSItem).then(function (response) {
                  $scope.resp = response;
                  $scope.ultrasoundGrid.dataSource.read();
                  // $scope.ultrasoundGrid.dataSource.read();
              });

          };

          $scope.modifyIndicationsItems = function () {
              $scope.specialityWnd.setOptions({
                  title: "Edit USType",
              });
              $scope.view.Indications = true;
              $scope.specialityWnd.center().open();
          }
          $scope.modifyUsItem = function (name, typeId, id) {
              adminService.modifyTypeItem(name, typeId).then(function (dataResponse) {
                  $scope.resp = dataResponse.data;
                  // console.log($scope.resp);
              });
          };

          $scope.AddItem = function (type) {

              if (type == 1) {
                  $scope.view.IsUStypes = true;
                  $scope.specialityWnd.center().open();
              }
              if (type == 2) {
                  $scope.view.IsView = true;
                  $scope.specialityWnd.center().open();
              }
              if (type == 3) {
                  $scope.view.IsIndications = true;
                  $scope.ultrasoundIndicationsDDL.dataSource.read({ specialityId: $scope.in.Speciality });
                  $scope.specialityWnd.center().open();
              }
              if (type == 4) {
                  $scope.view.IsTags = true;
                  //  $scope.ultrasoundIndicationsDDL.dataSource.read({ specialityId: $scope.in.Speciality });
                  $scope.specialityWnd.center().open();
              }
          }

          $scope.modifySpeciality = function () {

              $scope.specialityWnd.setOptions({
                  title: "Edit Speciality",
              });
              $scope.view.IsUStypes = true;
              $scope.ultrasoundGrid.dataSource.read();
              $scope.specialityWnd.center().open();

          };
          $scope.modifyViews = function () {
              $scope.specialityWnd.setOptions({
                  title: "Edit Speciality",
                  width: 690,
                  resizable: false

              });
              $scope.view.IsViews = true;

              $scope.specialityWnd.center().open();

          }
          $scope.IsSelectedType = function () {
              if (angular.isNullOrUndefined($scope.multiselectedTypes)) {
                  return true;
              }
              else {
                  return false;
              }
          }
          $scope.confirmAdd = function () {
              var tempArray = [];
              // console.log($scope.typeSelected);
              for (var item in $scope.multiselectedTypes) {
                  tempArray.push($scope.multiselectedTypes[item].Id);
              }

              adminService.addUsItems($scope.specialitySelected.Id, $scope.typeSelected.Id, tempArray).then(function (dataResponse) {
                  if (dataResponse.status == 200) {
                      $scope.specialityWnd.close();
                      // $scope.linksDDl.value([]);
                      $scope.ultrasoundtypesGrid.dataSource.read();
                  }
                  else {
                      // console.log(dataResponse);
                  }
              });
              $scope.specialityWnd.close();
              $scope.linksDDl.value([]);
              $scope.ultrasoundtypesGrid.dataSource.read();
          };

          $scope.cancelAdd = function () {
              $scope.specialityWnd.close();
          }
          $scope.addType = function () {
              $scope.specialityWnd.setOptions({
                  title: "Add Item",
              });
              $scope.view.IsConfirm = true;
              $scope.specialityWnd.center().open();
          }
          $scope.usTypesurl = appSettings.serviceUrl + 'api/USTypes/GetSpecialityTypes';
          $scope.gridUSGroupsSource = new kendo.data.DataSource({
              transport: {
                  read: {
                      url: $scope.usTypesurl,
                      type: "GET",
                      data: function () {
                          if (!angular.isNullOrUndefined($scope.specialitySelected.Id)) {
                              return { specialityId: $scope.specialitySelected.Id, id: null }
                          }

                      },
                      beforeSend: function (xhr) {
                          xhr.setRequestHeader('Authorization', 'Bearer ' + $localStorage.accessToken);
                      },

                      cache: false
                  },

              },
              schema: {
                  data: "Data",

                  total: function (response) {
                      console.log(response);
                      return response.Total;
                  },

                  model: {
                      Id: 'Id',

                      fields: {
                          Id: { type: "number" },
                          UsName: {
                              type: "string"
                          },
                          SortingId: {
                              type: "number"
                          },
                          Indications: {
                              type: "string"
                          },

                      }
                  }
              },
              sort: { field: "SortingId", dir: "asc" },

              pageSize: 10 // limits result set
          });

          $scope.USTypesGroupsSource = new kendo.data.DataSource({
              transport: {
                  read: {
                      url: function () { return appSettings.serviceUrl + "api/USTypes/GetUSTypes" },
                      type: "GET",
                      beforeSend: function (xhr) {
                          xhr.setRequestHeader('Authorization', 'Bearer ' + $localStorage.accessToken);
                      },
                      cache: false
                  }
              },

              schema: {
                  data: "Data",
                  total: function (response) {
                      return response.Total;
                  },
                  model: {
                      fields: {
                          Id: {
                              editable: false,
                              type: "number"
                          },
                          Name: {
                              type: "string"
                          },
                          SpecialityName: {
                              type: "string"
                          }
                      }
                  }
              },

              pageSize: 10 // limits result set
          });

          $scope.USTypesGroupsOptions = {

              dataSource: $scope.USTypesGroupsSource,

              dataBound: function (e) {
                  var grid = e.sender;
                  var dataItems = grid.dataSource.data();
              },
              change: function (e) {
                  var grid = e.sender;
                  var currentDataItem = grid.dataItem(this.select());
                  $scope.currentUSItem = currentDataItem.Id;
                  $scope.us.Name = currentDataItem.Name;
                  $scope.us.Speciality = currentDataItem.SpecialityName;

                  $scope.$apply();

              },
              scrollable: false,
              sortable: true,
              pageable: true,
              pageable: {
                  refresh: true,
                  pageSizes: [5, 10, 20, 50],
                  buttonCount: 5
              },


              columns: [
                   {
                       field: "Id",
                       width: "50px",
                   },
                  {
                      field: "Name",
                      width: "70%",
                  },
                    {
                        field: "SpecialityName",
                        title: "Speciality",
                        width: "70%",
                    },

              ]
          };
          //////Views
          $scope.ViewSource = new kendo.data.DataSource({
              transport: {
                  read: {
                      url: function () { return appSettings.serviceUrl + "api/USTypes/GetViews" },
                      type: "GET",
                      beforeSend: function (xhr) {
                          xhr.setRequestHeader('Authorization', 'Bearer ' + $localStorage.accessToken);
                      },
                      cache: false
                  }
              },

              schema: {
                  data: "Data",
                  total: function (response) {
                      return response.Total;
                  },
                  model: {
                      fields: {
                          Id: {
                              editable: false,
                              type: "number"
                          },
                          Name: {
                              type: "string"
                          },
                          SpecialityName: {
                              type: "string"
                          },
                          UltrasoundType: {
                              type: "string"
                          }
                      }
                  }
              },

              pageSize: 10 // limits result set
          });

          $scope.modifyUSItem = function (type) {
              if (type == 1) {
                  $scope.specialityWnd.setOptions({
                      title: "Modify Ultrasound type"
                  });
                  $scope.view.EditUSItem = true;
                  $scope.specialityModifyUS.dataSource.read();
                  $scope.specialityWnd.center().open();
              }
              if (type == 2) {
                  $scope.specialityWnd.setOptions({
                      title: "Modify view"
                  });
                  $scope.view.EditView = true;
                  $scope.editViewDDL.dataSource.read();

                  $scope.specialityWnd.center().open();
              }
              if (type == 3) {
                  $scope.specialityWnd.setOptions({
                      title: "Modify indication"
                  });
                  $scope.view.EditIndication = true;
                  $scope.specialityIndicationsDDL.dataSource.read();
                  $scope.specialityWnd.center().open();
              }
              if (type == 4) {
                  $scope.specialityWnd.setOptions({
                      title: "Modify Tag"
                  });
                  $scope.view.EditTags = true;

                  $scope.specialityWnd.center().open();

              }


          }
          $scope.viewsGridOptions = {
              // autoBind: false,
              dataSource: $scope.ViewSource,

              dataBound: function (e) {
                  var grid = e.sender;
                  var dataItems = grid.dataSource.data();
              },
              change: function (e) {
                  var grid = e.sender;
                  var currentDataItem = grid.dataItem(this.select());
                  $scope.v.Id = currentDataItem.Id;
                  $scope.v.Name = currentDataItem.Name;
                  $scope.v.Speciality = currentDataItem.SpecialityName;
                  $scope.v.Ultrasound = currentDataItem.UltrasoundType;
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
                       width: "50px",
                   },
                  {
                      field: "Name",
                      width: "70%",
                  }, {
                      field: "SpecialityName",
                      width: "70%",
                  }, {
                      field: "UltrasoundType",
                      width: "70%",
                  }
              ]
          };
          $scope.updateSorting = function (arr) {
              adminService.updateSorting(arr).then(function (response) {
                  if (response.data) {
                      $scope.ultrasoundtypesGrid.dataSource.read();
                  }
              });

          }
          $scope.ultrasoundtypesGridOptions = {

              dataSource: $scope.gridUSGroupsSource,
              autoBind: false,
              scrollable: false,

              dataBound: function (e) {

                  var grid = e.sender;
                  var dataItems = grid.dataSource.data();
                  this.expandRow(this.tbody.find("tr.k-master-row").first());
                  $scope.$apply();
                  $scope.ultrasoundtypesGrid.table.kendoDraggable({
                      filter: "tbody>tr",
                      group: "gridGroup",
                      cursorOffset: {
                          top: $('.k-grid .k-widget').height() - ($('.k-grid .k-widget').height() - 15),
                          left: $('.k-grid .k-widget').width() - ($('.k-grid .k-widget').width() - 15)
                      },
                      hint: function (e) {

                          return $('<div class="k-grid k-widget"><table><tbody><tr>' + e.html() + '</tr></tbody></table></div>');

                      }
                  });
                  $scope.ultrasoundtypesGrid.table.find("tbody > tr").kendoDropTarget({
                      group: "gridGroup",
                      drop: function (e) {
                          var target = $(e.draggable.currentTarget);
                          var targetvalue = target.attr("data-uid"),
                               dest = $(e.target);
                          if (dest.is("th")) {
                              return;
                          }
                          var destvalue = dest.closest("tr").attr("data-uid");
                          if (targetvalue !== destvalue) {
                              var elementtarget = $(e.currentTarget);
                              var row = target.closest("tr"),
                                dataTarget = $scope.ultrasoundtypesGrid.dataItem(row);
                              $scope.targetSortId = dataTarget.SortingId;
                              var destId = dest.closest("tr"),
                                dataDest = $scope.ultrasoundtypesGrid.dataItem(destId);
                              $scope.destSortId = dataDest.SortingId;
                              var tmp = $scope.targetSortId;
                              $scope.targetSortId = $scope.destSortId;
                              $scope.destSortId = tmp;
                              $scope.changedCurrrent = { Id: dataTarget.Id, SortingId: $scope.targetSortId };
                              $scope.changeddest = { Id: dataDest.Id, SortingId: $scope.destSortId };
                              var arr = [];
                              arr.push($scope.changedCurrrent);
                              arr.push($scope.changeddest);
                              $scope.updateSorting(arr);
                              $scope.gridUSGroupsSource.sort({ field: "SortingId", dir: "asc" });
                          }
                      }
                  });


              },
              change: function (e) {
                  var grid = e.sender;
                  var currentDataItem = grid.dataItem(this.select());
                  $scope.ustypeName = currentDataItem.UsName;

                  $scope.Indications = currentDataItem.Indications.split(',');

                  $scope.$apply();
              },
              sortable: true,
              detailInit: $scope.detailGridOptions,
              scrollable: false,

              sortable: true,
              pageable: true,
              serverPaging: true,
              serverSorting: true,
              serverFiltering: true,
              pageable: {
                  refresh: true,
                  pageSizes: [5, 10, 20, 50],
                  buttonCount: 5
              },


              columns: [
                   {
                       field: "Id",
                       hidden: true
                   },
                   {
                       field: "SortingId",
                       hidden: true
                   },
                  {
                      field: "UsName",
                      //  template: "",
                      title: "Ultrasound type",


                      template: "#=UsName === null? '':'{{dataItem.UsName | translate }}'# <a title='Modify' style='float: right;' ng-click='modifyItems($event)'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></span></a><a title='Remove' style='float:right; margin-right:15px;' ng-click='deleteUs($event)'><i class='fa fa-times' aria-hidden='true'></i></span></a>",
                      //template: "<button class='k-button' title='Remove' ng-click='confirmDeleteTag()'><i class='fa fa-times' aria-hidden='true'></i></button>",
                      attributes: { style: 'min-width:100px;' }
                  },
                  {
                      field: "Indications",
                      template: "#=Indications === null? '':Indications# <a title='Modify' style='float: right;' ng-click='modifyIndication($event)'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></span></a><a title='Remove' style='float:right; margin-right:15px;' ng-click='deleteIndications($event)'><i class='fa fa-times' aria-hidden='true'></i></span></a>",
                  },
              ]
          };

          $scope.detailGridOptions = function (dataItem) {
              return {
                  dataSource: {
                      transport: {
                          read: appSettings.serviceUrl + 'api/USTypes/GetViewByUsId?id=' + dataItem.Id
                      },
                      schema: {
                          data: "Data",
                          total: function (response) {
                              // console.log(response);
                              return response.Total;
                          },
                          model:
                             {
                                 id: "Id",
                                 fields: {
                                     Id: {
                                         type: "string"
                                     },
                                     ViewName: {
                                         type: "string"
                                     },
                                     SortingId: {
                                         type: "number"
                                     }
                                 }
                             },

                      },
                      sort: { field: "SortingId", dir: "asc" },
                      serverPaging: true,
                      //serverSorting: true,
                      //serverFiltering: true,
                      pageSize: 5,
                      //filter: { field: "id", operator: "eq", value: dataItem.Id }
                  },
                  dataBound: function (e) {
                      var grid = e.sender;

                      var dataItems = grid.dataSource.data();
                      // console.log(dataItems);
                  },
                  scrollable: false,
                  //   selectable: true,
                  sortable: true,
                  pageable: true,
                  columns: [
                    { field: "Id", hidden: true },
                    { field: "ViewName", title: "View", template: "#=ViewName === null? '':ViewName# <a title='Modify' style='float: right;' ng-click='modifyView($event)'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></span></a><a title='Remove' style='float:right; margin-right:15px;' ng-click='deleteView($event)'><i class='fa fa-times' aria-hidden='true'></i></span></a>", },
                    { field: "SortingId", title: "Sort Criteria" },
                  ]
              };

          };

          $scope.detailTagGridOptions = function (dataItem) {
              return {
                  dataSource: {
                      transport: {
                          read: appSettings.serviceUrl + 'api/USTypes/GetTagByViewId?id=' + dataItem.Id
                      },
                      schema: {
                          data: "Data",
                          total: function (response) {
                              // console.log(response);
                              return response.Total;
                          },
                          model: {
                              id: "Id",
                              fields: {
                                  Id: {

                                      type: "string"
                                  },

                                  TagName: {
                                      type: "string"
                                  },
                                  SortingId: {
                                      type: "number"
                                  },
                                  Answers: {
                                      type: "string"
                                  },
                              }
                          }
                      },
                      //serverPaging: true,
                      //serverSorting: true,
                      //serverFiltering: true,
                      pageSize: 5,

                  },
                  dataBound: function () {
                  },
                  scrollable: false,
                  sortable: true,
                  columns: [
                    { field: "Id", hidden: true, attributes: { "class": "tag_class", } },
                    { field: "TagName", title: "Tag", template: "#=TagName === null? '':TagName# <a title='Modify' style='float: right;' ng-click='modifyTags($event)'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></span></a><a title='Remove' style='float:right; margin-right:15px;' ng-click='removeTag($event)'><i class='fa fa-times' aria-hidden='true'></i></span></a>", },
                     { field: "SortingId", title: "Sort Criteria" },
                   { field: "Answers", title: "Answers", template: "#=Answers === null? '':Answers# <a title='Modify' style='float: right;' ng-click='modifyAnswers($event)'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></span></a><a title='Modify' style='float:right; margin-right:15px;' ng-click='removeAnswers($event)'><i class='fa fa-times' aria-hidden='true'></i></span></a>", },
                  ]
              };
          }

          $scope.indicationsurl = appSettings.serviceUrl + 'api/USTypes/GetIndications';
          $scope.gridIndicationsSource = new kendo.data.DataSource({
              transport: {
                  read: {
                      url: $scope.indicationsurl,
                      type: "GET",
                      beforeSend: function (xhr) {
                          xhr.setRequestHeader('Authorization', 'Bearer ' + $localStorage.accessToken);
                      },
                      cache: false
                  },

              },
              schema: {
                  data: "Data",
                  total: function (response) {
                      return response.Total;
                  },
                  batch: true,
                  model: {
                      id: "Id",
                      fields: {
                          Id: {
                              type: "number"
                          },
                          Name: {
                              type: "string"
                          },
                          SpecialityName: {
                              type: "string"
                          },
                          UltrasoundType: {
                              type: "string"
                          }
                      }
                  }
              },

              pageSize: 10
          });


          $scope.indicationsGridOptions = {
              dataSource: $scope.gridIndicationsSource,
              dataBound: function (e) {
                  var grid = e.sender;
                  var dataItems = grid.dataSource.data();
                  $scope.$apply();
              },
              change: function (e) {
                  var grid = e.sender;
                  var currentDataItem = grid.dataItem(this.select());
                  $scope.in.Name = currentDataItem.Name;
                  $scope.in.Id = currentDataItem.Id;
                  $scope.in.Speciality = currentDataItem.SpecialityName;
                  $scope.in.Ultrasound = currentDataItem.UltrasoundType;
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
                       width: "50px",
                   },
                  {
                      field: "Name",
                      width: "50px",
                  },
                  {
                      field: "SpecialityName",
                      width: "50px",
                  },
                  {
                      field: "UltrasoundType",
                      width: "50px",
                  }

              ]
          };
          $scope.addIndication = function () {
              adminService.addIndication($scope.indicationName, $scope.UsType, $scope.specialityId).then(function (dataResponse) {
                  $scope.responseIn = dataResponse;
                  if (dataResponse.statusText == "OK") {
                      $scope.specialityWnd.close();
                      $scope.indicationsGrid.dataSource.read();
                  }
                  else {
                      // console.log(dataResponse);
                  }
                  // console.log($scope.responseIn);
                  $scope.specialityWnd.close();

                  // console.log($scope.indicationName);
                  // console.log($scope.UsType);
                  // console.log($scope.specialityId);
              });
          }
          $scope.addView = function () {
              adminService.addView($scope.viewName, $scope.UsTypeId, $scope.specialityId).then(function (response) {
                  if (response.status == 200) {
                      $scope.specialityWnd.close();
                      $scope.viewsGrid.dataSource.read();
                  }
              });
          }
          $scope.closespecialityWnd = function () {
              $scope.view.IsUStypes = false;
              $scope.view.IsViews = false;
              $scope.view.IsIndications = false;
              $scope.view.IsTags = false;
              $scope.view.IsConfirm = false;
              $scope.view.AddUS = false;
              $scope.view.IsModify = false;
              $scope.view.IsView = false;
              $scope.view.EditUSItem = false;
              $scope.view.EditIndication = false;
              $scope.view.EditView = false;
              $scope.view.DeleteView = false;
              $scope.view.DeleteIndication = false;
              $scope.view.EditTags = false;
              $scope.view.DeleteTags = false;
              $scope.view.editIndications = false;
              $scope.view.editView = false;
              $scope.view.editTag = false;
              $scope.view.editAnsw = false;
              $scope.view.AddNewUs = false;
              $scope.Indications = [];
              $scope.us = {};
              $("body, html").removeClass("open-modal");
              $(".create").unwrap();
          }
          $scope.linksDataSource = {
              transport: {
                  read: {
                      url: appSettings.serviceUrl + "api/USTypes/GetLinks",
                      data: function () {
                          if (!angular.isNullOrUndefined($scope.specialitySelected.Id) && !angular.isNullOrUndefined($scope.typeSelected.Id)) {
                              return { specialityId: $scope.specialitySelected.Id, typeId: $scope.typeSelected.Id };
                          }
                      },
                      type: "GET",
                      dataType: "json",
                      cache: false
                  }
              }
          };


          $scope.linksDDlOptions = {
              dataSource: $scope.linksDataSource,
              dataTextField: "Name",
              dataValueField: "Id",
              dataBound: function (e) {
                  var items = e.sender.dataSource.data();
                  // console.log($scope.multiselectedTypes);
                  $scope.$apply();
              },
              select: function (e) {
                  var dataItem = this.dataItem(e.item.index());
                  // console.log($scope.multiselectedTypes);
                  $scope.$apply();
              }
          };
          $scope.specialitylDataSource = {
              transport: {
                  read: {
                      url: appSettings.serviceUrl + "api/Specialities/GetSpecialities",
                      type: "GET",
                      dataType: "json",
                      cache: false
                  }
              }
          };


          $scope.specialityDDLOptions = {
              dataSource: $scope.specialitylDataSource,
              autoBind: false,
              dataTextField: "Name",
              dataValueField: "Id",
              dataBound: function (e) {
              },
              select: function (e) {
                  var dataItem = this.dataItem(e.item.index());
                  if ($scope.specialityIndicationDDL == e.sender) {
                      $scope.specialityId = dataItem.Id;
                      $scope.InitUsDDl();
                      $scope.$apply();
                  }
              }
          };

          $scope.ViewspecialityDDLOptions = {
              dataSource: $scope.specialitylDataSource,
              autoBind: false,
              dataTextField: "Name",
              dataValueField: "Id",
              dataBound: function (e) {
              },
              select: function (e) {
                  var dataItem = this.dataItem(e.item.index());
                  if ($scope.specialityViewDDL == e.sender) {

                      $scope.specialityId = dataItem.Id;

                      $scope.InitViewsUsDDl();
                      $scope.$apply();
                  }
              }
          };
          $scope.InitEditViewsUsDDl = function () {
              $scope.ultrasoundViewsDDL.dataSource.read({ specialityName: $scope.v.Speciality });
              // $scope.ultrasoundIndicationsDDL.dataSource.read({ specialityName: $scope.in.Speciality });
          }
          $scope.editViewDDLOptions = {
              dataSource: $scope.specialitylDataSource,
              autoBind: false,
              dataTextField: "Name",
              dataValueField: "Id",
              dataBound: function (e) {
                  var items = e.sender.dataSource.data();
                  if ($scope.v.Speciality != undefined) {
                      for (var i = 0, max = items.length; i < max; i++) {
                          elem = items[i];
                          if (elem['Name'] == $scope.v.Speciality) {

                              // console.log($scope.v.Speciality);
                              $scope.InitEditViewsUsDDl();
                              $scope.editViewDDL.select(parseInt(i));

                          }
                      }
                  } else {
                      this.select(0);
                  }

              },
              select: function (e) {
                  var dataItem = this.dataItem(e.item.index());
                  if ($scope.editViewDDL == e.sender) {

                      $scope.v.Speciality = dataItem.Name;
                      // console.log($scope.specialityId);
                      $scope.InitEditViewsUsDDl();
                      $scope.$apply();
                  }
              }
          }
          $scope.UsDdllDataSource = {
              transport: {
                  read: {
                      url: appSettings.serviceUrl + "api/Ultrasound/GetUsTypes",
                      type: "GET",
                      dataType: "json",
                  },
                  cache: false
              }
          };
          $scope.UsByNameDDLDataSource = {
              transport: {
                  read: {
                      url: appSettings.serviceUrl + "api/Ultrasound/GetUltrasoundsTypes",
                      type: "GET",
                      dataType: "json",
                  },
                  cache: false
              }
          };


          $scope.USDDLOptions = {
              dataSource: $scope.UsDdllDataSource,
              autoBind: false,
              dataTextField: "Name",
              dataValueField: "Id",
              dataBound: function (e) {
                  if ($scope.USDDl == e.sender) {
                      $scope.USDDl.select(0);
                      // console.log($scope.UsType);
                  }
                  $scope.$apply();
              },
              select: function (e) {
                  var dataItem = this.dataItem(e.item.index());
                  if ($scope.USDDl == e.sender) {
                      $scope.UsType = dataItem.Id;

                      $scope.$apply();
                  }
              }
          };

          $scope.InitUsDDl = function () {
              $scope.USDDl.dataSource.read({ specialityId: $scope.specialityId });
          }
          $scope.InitViewsUsDDl = function () {
              $scope.ViewUSDDl.dataSource.read({ specialityId: $scope.specialityId });
          }
          $scope.USViewsDDLOptions = {
              dataSource: $scope.UsDdllDataSource,
              autoBind: false,
              dataTextField: "Name",
              dataValueField: "Id",
              dataBound: function (e) {
                  var items = e.sender.dataSource.data();
                  //if ($scope.ViewUSDDl == e.sender) {
                  // console.log($scope.v.Ultrasound);
                  if ($scope.v.Ultrasound != null && $scope.v.Ultrasound != undefined) {
                      for (var i = 0, max = items.length; i < max; i++) {
                          elem = items[i];
                          if (elem['Name'] == $scope.v.Ultrasound) {
                              $scope.ViewUSDDl.select(parseInt(i));
                          }
                      }

                  } else {
                      $scope.ViewUSDDl.value("");
                  }
                  //$scope.ViewUSDDl.select(0);
                  // }
                  // console.log(e);
                  $scope.$apply();
              },
              select: function (e) {
                  var dataItem = this.dataItem(e.item.index());
                  if ($scope.ViewUSDDl == e.sender) {
                      $scope.UsTypeId = dataItem.Id;
                      // console.log($scope.UsTypeId);
                      $scope.$apply();
                  }
              }
          };
          $scope.specialityModifyUSDDLOptions = {
              dataSource: $scope.specialitylDataSource,
              autoBind: false,
              dataTextField: "Name",
              dataValueField: "Id",
              dataBound: function (e) {
                  var items = e.sender.dataSource.data();
                  if ($scope.us.Speciality != undefined) {
                      for (var i = 0, max = items.length; i < max; i++) {
                          elem = items[i];
                          if (elem['Name'] == $scope.us.Speciality) {

                              // console.log($scope.us.Speciality);
                              $scope.specialityModifyUS.select(parseInt(i));
                          }
                      }
                  } else {
                      this.select(0);
                  }
                  $scope.$apply();
              },
              select: function (e) {
                  var dataItem = this.dataItem(e.item.index());
                  if ($scope.specialityModifyUS == e.sender) {
                      $scope.us.Speciality = dataItem.Name;
                      $scope.$apply();
                  }
              }
          }

          $scope.specialityIndicationsDDLOptions = {
              dataSource: $scope.specialitylDataSource,
              dataTextField: "Name",
              dataValueField: "Id",
              dataBound: function (e) {
                  var items = e.sender.dataSource.data();
                  if ($scope.in.Speciality != undefined) {
                      for (var i = 0, max = items.length; i < max; i++) {
                          elem = items[i];
                          if (elem['Name'] == $scope.in.Speciality) {

                              // console.log($scope.in.Speciality);
                              $scope.InitIndicationUsDDl();
                              $scope.specialityIndicationsDDL.select(parseInt(i));

                          }
                      }
                  } else {
                      this.select(0);
                  }
              },
              select: function (e) {
                  var dataItem = this.dataItem(e.item.index());
                  if ($scope.specialityIndicationsDDL == e.sender) {
                      $scope.in.Speciality = dataItem.Name;
                      $scope.InitIndicationUsDDl();
                      $scope.$apply();
                  }
              }
          }
          $scope.InitIndicationUsDDl = function () {
              $scope.ultrasoundIndicationsDDL.dataSource.read({ specialityName: $scope.in.Speciality });
          }
          $scope.ultrasoundIndicationsDDLOptions = {
              dataSource: $scope.UsByNameDDLDataSource,
              autoBind: false,
              dataTextField: "Name",
              dataValueField: "Id",
              dataBound: function (e) {
                  var items = e.sender.dataSource.data();
                  if ($scope.in.Ultrasound != undefined) {
                      for (var i = 0, max = items.length; i < max; i++) {
                          elem = items[i];
                          if (elem['Name'] == $scope.in.Ultrasound) {

                              // console.log($scope.in.Speciality);
                              $scope.ultrasoundIndicationsDDL.select(parseInt(i));
                              //$scope.$apply();
                          }
                      }
                  } else {
                      this.select(0);
                  }
              },
              select: function (e) {
                  var dataItem = this.dataItem(e.item.index());
                  if ($scope.ultrasoundIndicationsDDL == e.sender) {
                      $scope.in.Ultrasound = dataItem.Name;
                      // console.log($scope.in.Ultrasound);
                      $scope.$apply();
                  }
              }
          }

          ////////////////////////Views
          $scope.specialityViewsDDLOptions = {
              dataSource: $scope.specialitylDataSource,
              dataTextField: "Name",
              dataValueField: "Id",
              dataBound: function (e) {
                  var items = e.sender.dataSource.data();
                  if ($scope.v.Speciality != undefined) {
                      for (var i = 0, max = items.length; i < max; i++) {
                          elem = items[i];
                          if (elem['Name'] == $scope.v.Speciality) {

                              // console.log($scope.v.Speciality);
                              $scope.InitViewsDDl();
                              $scope.specialityViewsDDL.select(parseInt(i));

                          }
                      }
                  } else {
                      this.select(0);
                  }
              },
              select: function (e) {
                  var dataItem = this.dataItem(e.item.index());
                  if ($scope.specialityViewsDDL == e.sender) {
                      $scope.v.Speciality = dataItem.Name;
                      $scope.InitViewsDDl();
                      $scope.$apply();
                  }
              }
          }
          $scope.InitViewsDDl = function () {
              $scope.ultrasoundViewsDDL.dataSource.read({ specialityName: $scope.v.Speciality });
          }
          $scope.ultrasoundViewsDDLOptions = {
              dataSource: $scope.UsByNameDDLDataSource,
              autoBind: false,
              dataTextField: "Name",
              dataValueField: "Id",
              dataBound: function (e) {
                  var items = e.sender.dataSource.data();
                  if ($scope.v.Ultrasound != undefined) {
                      for (var i = 0, max = items.length; i < max; i++) {
                          elem = items[i];
                          if (elem['Name'] == $scope.v.Ultrasound) {
                              $scope.ultrasoundViewsDDL.select(parseInt(i));
                              //$scope.$apply();
                          }
                      }
                  } else {
                      this.select(0);
                  }
              },
              select: function (e) {
                  var dataItem = this.dataItem(e.item.index());
                  if ($scope.ultrasoundViewsDDL == e.sender) {
                      $scope.v.Ultrasound = dataItem.Name;

                      $scope.$apply();
                  }
              }
          }
          $scope.SaveUS = function () {
              adminService.saveUS($scope.currentUSItem, $scope.us.Name, $scope.us.Speciality, 1, null, 0, 0).then(function (response) {
                  if (!response) {
                      return;
                  }

                  // console.log(response);
                  $scope.specialityWnd.close();
                  $scope.ultrasoundGrid.dataSource.read();
              });

          }

          $scope.SaveIndications = function () {
              adminService.saveUS(0, $scope.in.Name, $scope.in.Speciality, 3, $scope.in.Ultrasound, $scope.in.Id, 0).then(function (response) {
                  if (!response) {
                      return;
                  }

                  // console.log(response);
                  $scope.specialityWnd.close();
                  $scope.indicationsGrid.dataSource.read();
              });

          }

          $scope.SaveViews = function () {
              adminService.saveUS(0, $scope.v.Name, $scope.v.Speciality, 2, $scope.v.Ultrasound, $scope.v.Id, 0).then(function (response) {
                  if (!response) {
                      return;
                  }

                  // console.log(response);
                  $scope.specialityWnd.close();

              });
          }
          $scope.deleteIndicationConfirm = function () {
              $scope.view.DeleteIndication = true;
              $scope.specialityWnd.center().open();
          }
          $scope.deleteIndications = function () {
              adminService.deleteIndication($scope.in.Id).then(function (response) {

                  $scope.specialityWnd.close();
                  $scope.indicationsGrid.dataSource.read();
              });
          }
          $scope.deleteViewConfirm = function () {
              $scope.view.DeleteView = true;
              $scope.specialityWnd.center().open();
          }
          $scope.deleteViews = function () {
              adminService.deleteView($scope.v.Id).then(function (response) {
                  if (!response) {
                      return;
                  }


                  $scope.specialityWnd.close();
                  $scope.viewsGrid.dataSource.read();
              });
          }
          $scope.usTagsUrl = appSettings.serviceUrl + 'api/Ultrasound/GetTags';
          $scope.gridtagSource = new kendo.data.DataSource({
              transport: {
                  read: {
                      url: $scope.usTagsUrl,
                      type: "GET",

                      beforeSend: function (xhr) {
                          xhr.setRequestHeader('Authorization', 'Bearer ' + $localStorage.accessToken);
                      },
                      //dataType: "json",
                      cache: false
                  },

              },
              schema: {
                  data: "Data",
                  total: function (response) {
                      return response.Total;
                  },

                  model: {

                      fields: {
                          Id: {
                              type: "string"
                          },
                          TagName: {
                              type: "string"
                          },
                          ViewName: {
                              type: "string"
                          },
                          Answers: {
                              type: "string"
                          }

                      }
                  }
              },

              pageSize: 10 // limits result set
          });
          $scope.tagsGridOptions = {
              dataSource: $scope.gridtagSource,

              dataBound: function (e) {
                  var grid = e.sender;
                  var dataItems = grid.dataSource.data();
              },
              change: function (e) {
                  var grid = e.sender;
                  var currentDataItem = grid.dataItem(this.select());
                  $scope.tagId = currentDataItem.Id;
                  $scope.tagsName = currentDataItem.TagName;
                  $scope.viewName = currentDataItem.ViewName;

                  $scope.selectedAnswers = currentDataItem.Answers.split(',');
                  $scope.Answers = [];
                  for (var item in $scope.selectedAnswers) {

                      $scope.Answers.push({ Id: item, Value: $scope.selectedAnswers[item] });
                  }

                  //  console.log($scope.us.Speciality);
                  // console.log($scope.Answers);
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
                       width: "50px",
                   },
                  {
                      field: "TagName",
                      title: "Tag",
                      width: "70%",
                  },
                    {
                        field: "ViewName",
                        title: "View",
                        width: "70%",
                    },
                     {
                         field: "Answers",
                         title: "Answers",
                         width: "70%",
                     },
              ]
          };
          $scope.ViewsSpecialityDDLOptions = {
              dataSource: $scope.specialitylDataSource,
              autoBind: false,
              dataTextField: "Name",
              dataValueField: "Id",
              dataBound: function (e) {
              },
              select: function (e) {
                  var dataItem = this.dataItem(e.item.index());
                  if ($scope.ViewsSpecialityDDL == e.sender) {
                      // $scope.Speciality = dataItem.Id;
                      $scope.VspecialityId = dataItem.Id;
                      $scope.initViewDDl();
                      // $scope.InitViewsUsDDl();
                      $scope.$apply();
                  }
              }
          };
          $scope.initViewDDl = function () {
              $scope.ViewsDDL.dataSource.read({ specialityId: $scope.VspecialityId });
          }
          $scope.ViewsDDLOptions = {
              dataSource: $scope.viewsDataSource,
              autoBind: false,
              dataTextField: "Name",
              dataValueField: "Id",
              dataBound: function (e) {
                  var items = e.sender.dataSource.data();
                  if ($scope.ViewsDDL == e.sender) {


                      $scope.ViewsDDL.select(0);
                      $scope.$apply();
                  }

              },
              select: function (e) {
                  var dataItem = this.dataItem(e.item.index());
                  if ($scope.ViewsDDL == e.sender) {

                      $scope.ViewId = dataItem.Id;
                      //$scope.InitUsDDl();
                      // $scope.InitViewsUsDDl();
                      $scope.$apply();
                  }
              }
          };

          $scope.answerSelectOptions = {
              dataSource: $scope.answersDataSource,
              autoBind: false,
              dataTextField: "Name",
              dataValueField: "Id",
              dataBound: function (e) {
              },
              select: function (e) {
                  var dataItem = this.dataItem(e.item.index());
                  if ($scope.ViewsSpecialityDDL == e.sender) {
                      $scope.Answers = dataItem;

                      $scope.$apply();
                  }
              }
          }
          $scope.addTag = function () {
              $scope.answerNames = _($scope.Answers).pluck("Value");
              $scope.answerNames.push($scope.fixedAnswer);
              var completedAnswersArray = _.compact($scope.answerNames);
              adminService.addTag($scope.tagName, $scope.VspecialityId, $scope.ViewId, completedAnswersArray).then(function (response) {
                  // console.log(response);
                  if (response.status == 200) {
                      $scope.specialityWnd.close();
                      $scope.tagsGrid.dataSource.read();
                      $scope.tagName = null;
                      $scope.Answers = [];
                  }
                  else {
                      alert(response.statusText);
                  }
              });

              // console.log($scope.tagName);
              // console.log($scope.VspecialityId);
              // console.log($scope.ViewId);
              // console.log($scope.Answers);
          }
          $scope.addUsItems = function (UsArray, $index) {
              if (UsArray != null
                && UsArray.length < $scope.maxPoints
                && UsArray.length - 1 == $index
                && (UsArray[$index].Value != null ||
                UsArray[$index].Value != "")
                ) {
                  UsArray.push({ Id: $index + 1, Value: null });
              } else {
                  if ($index + 1 != $scope.maxPoints &&
                      (UsArray[$index].Value == null
                      || UsArray[$index].Value == "")
                      && UsArray.length > 1
                     ) {
                      UsArray.splice($index, 1);
                  }
              }
          }
          $scope.addUsTagItems = function (UsArray, $index) {
              if (UsArray != null
                && UsArray.length < $scope.maxPoints
                && UsArray.length - 1 == $index
                && (UsArray[$index].Value != null ||
                UsArray[$index].Value != "")
                ) {
                  UsArray.push({ Id: $index + 1, Value: null, tags: [{ tagName: null, answers: [{ Name: null }] }] });
              } else {
                  if ($index + 1 != $scope.maxPoints &&
                      (UsArray[$index].Value == null
                      || UsArray[$index].Value == "")
                      && UsArray.length > 1
                     ) {
                      UsArray.splice($index, 1);
                  }
              }
          }
          $scope.iSNotAssessable = function (value) {
              if (value == "Not Assessable") {
                  return true;
              }
              else {
                  return false;
              }
          }

          $scope.EditTags = function () {
              var aswrs = _($scope.Answers).pluck("Value");
              adminService.editTag($scope.tagId, $scope.tagsName, $scope.viewName, aswrs).then(function (dataResponse) {
                  if (dataResponse.status == 200) {
                      $scope.specialityWnd.close();
                      $scope.tagsGrid.dataSource.read();
                  }
              });
          }
          $scope.confirmDeleteTag = function () {
              $scope.view.DeleteTags = true;
              $scope.specialityWnd.center().open();
          }
          $scope.deleteTag = function () {
              adminService.removeTag($scope.tagId).then(function (response) {
                  if (response.status == 200) {
                      $scope.specialityWnd.close();
                      $scope.tagsGrid.dataSource.read();
                  }
              });
          };
          $scope.IsSelectedSpec = function () {
              if ($scope.specialitySelected.Id === undefined || $scope.specialitySelected.Id == null) {
                  return true;
              }
              else { return false; }
          };
          $scope.AddNewUS = function () {
              $scope.specialityWnd.setOptions({
                  title: "Create US"
                  , resizable: false
                  , draggable: false
                  , modal: false
              });
              $scope.specialityWnd.wrapper.addClass("create");
              $("body, html").addClass("open-modal");
              $scope.specialityWnd.wrapper.wrap("<div class='create__wrap'></div>");
              $scope.view.AddNewUs = true;
              $scope.current = $scope.Ultrasound[0];
              $scope.us = {
                  Indications: [
                   { Id: 0, Value: null }],
                  Views: [
                       { Id: 0, Value: null, tags: [{ tagName: null, answers: [{ Name: null }] }] }],
              };
              $scope.specialityWnd.open();
          };
          $scope.Ultrasound = [
              { index: 0 },
              { index: 1 },
              { index: 2 },
              { index: 3 },
              { index: 4 }
          ];

          $scope.goNext = function () {
              var i = $scope.getIndex($scope.current.index, 1);
              $scope.current = $scope.Ultrasound[i];
              if ($scope.current.index == 4) {
                  // console.log($scope.us);
              }
              // console.log($scope.current.index);
          };
          $scope.goPrev = function () {

              var i = $scope.getIndex($scope.current.index, -1);
              $scope.current = $scope.Ultrasound[i];

          };
          $scope.getIndex = function (currentIndex, shift) {
              var len = $scope.Ultrasound.length;
              return (((currentIndex + shift) + len) % len)
          };

          $scope.isModelValid = function () {
              if ($scope.current.index == 0) {
                  if (angular.isNullOrUndefined($scope.us.ultrasoundName) || angular.isNullUndefinedOrWhitespace($scope.us.ultrasoundName) || angular.IsNullOrEmpty($scope.us.ultrasoundName)) {
                      return true;
                  }
              }
              else if ($scope.current.index == 1) {
                  if (angular.isNullOrUndefined($scope.us.Indications) || angular.isNullUndefinedOrWhitespace($scope.us.Indications) || $scope.us.Indications.length == 0) {

                      return true;
                  }
              }
              else if ($scope.current.index == 2) {

                  if (angular.isNullOrUndefined($scope.us.Views) || angular.isNullUndefinedOrWhitespace($scope.us.Views) || $scope.us.Views.length == 0) {

                      $scope.us.Views = $scope.us.Views.filter(function (item) {
                          return item.Value !== null;
                      });


                      return true;
                  }
              }
              else if ($scope.current.index == 3) {
                  if (!angular.equals($scope.us, {})) {
                      $scope.us.Views = $scope.us.Views.filter(function (item) {
                          return item.Value !== null;
                      });
                  }
                  if (angular.isNullOrUndefined($scope.us.Tags) || angular.isNullUndefinedOrWhitespace($scope.us.Tags) || $scope.us.Tags.length == 0) {

                      return true;
                  }
              }
              else {
                  return false;
              }
          }

          $scope.Addinput = function (view) {
              view.tags.push({ tagName: null, answers: [{ Name: null }] });
          };
          $scope.addAnswer = function (tag) {
              tag.answers.push({ Name: null });
          };
          $scope.isInexFirst = function () {
              if ($scope.current.index == 0) {
                  return true;
              }
              else {
                  return false;
              }
          }

          $scope.deleteEmptyAnswers = function (answers) {
              answers = answers.filter(function (item) {
                  return item.Name !== null;
              });
          }
          $scope.filterAnswers = function (views) {
              for (var i in views) {
                  var tags = views[i].tags;
                  for (var y in tags) {
                      $scope.deleteEmptyAnswers(tags[y].answers);
                  }
              }
          }
          $scope.addUltrasound = function () {
              $scope.us.Indications = $scope.us.Indications.filter(function (item) {
                  return item.Value !== null;
              });
              $scope.us.Views = $scope.us.Views.filter(function (item) {
                  return item.Value !== null;
              });
              $scope.filterAnswers($scope.us.Views);
              adminService.saveNewUs($scope.us, $scope.specialitySelected.Id).then(function (response) {
                  if (response.status == 200) {
                      $scope.current.index == 0;
                      $scope.specialityWnd.close();
                      $scope.ultrasoundtypesGrid.dataSource.read();
                  }
              })
          }

          //specific conclusion tab


          $scope.conclusionSpecialitySelected = {};

          $scope.ConclusionSpecialities = {
              dataSource: $scope.specialitylDataSource,
              dataTextField: "Name",
              dataValueField: "Id",
              template: "{{ dataItem.Name | translate }}",
              valueTemplate: "{{dataItem.Name | translate }}",
              filter: "contains",
            
          }

          $scope.SpecificConclusionQuestions = [ ];
          $scope.OnChangeConclusionSpeciality = function () {
              if (!angular.isNullOrUndefined($scope.conclusionSpecialitySelected.Id)) {
                  specificConclusionService.getConclusionTags($scope.conclusionSpecialitySelected.Id).then(function (response) {
                      if (response.length == 0) {
                          $scope.SpecificConclusionQuestions = [{
                              Id: null,
                              Name: null,
                              Tags: [{
                                  Id: null,
                                  Name: null,
                                  Answers: [
                                      {
                                          Id: null,
                                          Name: null
                                      },
                                      {
                                          Id: null,
                                          Name: null
                                      }
                                  ]
                              }]
                          }];
                      } else {
                          $scope.SpecificConclusionQuestions = response
                      }
                      return $scope.SpecificConclusionQuestions;
                  });
              }
          }

          $scope.addConclusionView = function () {
              var newview = {
                  Id: null,
                  Name: null,
                  Tags: [{
                      Id: null,
                      Name: null,
                      Answers: [
                          {
                              Id: null,
                              Name: null
                          },
                          {
                              Id: null,
                              Name: null
                          }
                      ]
                  }]
              };
              $scope.SpecificConclusionQuestions.push(newview);
              return $scope.SpecificConclusionQuestions;
          };
          $scope.removeConclusionView = function (parentIndex) {
              $scope.SpecificConclusionQuestions.splice(parentIndex, 1);
              return $scope.SpecificConclusionQuestions;
          };

          $scope.addConclusionTag = function (viewIndex) {
              var newtag = {
                  Id: null,
                  Name: null,
                  Answers: [
                      {
                          Id: null,
                          Name: null
                      },
                      {
                          Id: null,
                          Name: null
                      }
                  ]
              };
              $scope.SpecificConclusionQuestions[viewIndex].Tags.push(newtag);
              return $scope.SpecificConclusionQuestions;
          };
          $scope.removeConclusionTag = function (viewIndex, tagIndex) {
              $scope.SpecificConclusionQuestions[viewIndex].Tags.splice(tagIndex, 1);
              return $scope.SpecificConclusionQuestions;
          };

          $scope.addConclusionAnswer = function (viewIndex,tagIndex) {
              $scope.SpecificConclusionQuestions[viewIndex].Tags[tagIndex].Answers.push({
                  Id: null,
                  Name: null
              });
              return $scope.SpecificConclusionQuestions;
          };
          $scope.removeConclusionAnswer = function (viewIndex, tagIndex, answerIndex) {
              $scope.SpecificConclusionQuestions[viewIndex].Tags[tagIndex].Answers.splice(answerIndex, 1);
              return $scope.SpecificConclusionQuestions;
          };

          $scope.saveConslusion = function () {
              var data = {
                  Id: $scope.conclusionSpecialitySelected.Id,
                  Views: $scope.SpecificConclusionQuestions
              };
          

              specificConclusionService.saveConclusionTags(data).then(function (response) {
                  
                  $scope.SpecificConclusionQuestions = response;
              })
          }
      }]);

})();