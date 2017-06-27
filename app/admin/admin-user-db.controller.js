(function () {

    // "use strict";
    angular
      .module('Eportfolio.admin')
      .controller('admin-user-db.controller', ['$window', '$state', '$scope', '$uibModal', 'authService', 'appSettings', 'adminService', 'dataService', 'userService', '$localStorage', function adminUserDbCtrl($window, $state, $scope, $uibModal, authService, appSettings, adminService, dataService, userService, $localStorage) {


          $scope.roles = ["student US", "teacher US", "student portfolio", "teacher portfolio", "admin", "student college", "teacher college"];
          $scope.fillUserDb = function () {
              authService.userDbGridData().then(function (dataResponse) {
                  $scope.griddata = dataResponse.data;

              });
          }
          $scope.getUserdetails = function () {
              $scope.user = {};
              userService.getUseById($scope.userid).then(function (dataResponse) {
                  $scope.user = dataResponse.data;
                  $scope.user.EndSubscription = kendo.toString(kendo.parseDate($scope.user.EndSubscription, "dd.MM.yyyy"), "dd/MM/yyyy");
                  $scope.user.StartSubscription = kendo.toString(kendo.parseDate($scope.user.StartSubscription, "dd.MM.yyyy"), "dd/MM/yyyy");
                  // console.log($scope.user);

                  $scope.user.userRoles = $localStorage.userRoles;
                  if ($scope.user !== null) {
                       console.log($scope.user);
                      $scope.initDDls();
                      $scope.countryDDL.dataSource.read();
                      $scope.lotDDL.dataSource.read();
                      $scope.specialityDDL.dataSource.read();
                      $scope.hospitalDDL.dataSource.read();
                      $scope.selecteerPtfCbx.dataSource.read();
                      $scope.SelecteerUSCbx.dataSource.read();
                      $scope.portfolioSupDDL.dataSource.read();
                  }
                  $scope.checkRoles = function (role) {
                      var roles = $scope.user.Rights;
                      for (var r in roles) {
                          if (roles[r] == role) {
                              return true;
                          }
                          else {
                              return false;
                          }
                      }
                  }

              });

          }

          $scope.modify = function () {
              $scope.WindowModal.setOptions({
                  title: "Edit",
                  width: 690,
                  resizable: false

              });
              $scope.WindowModal.center().open();
              $scope.getUserdetails();

          }
          $scope.closeform = function () {
              $scope.WindowModal.close();
          }

          $scope.closedeletewind = function () {
              $scope.confirmDeletewindow.close();
          }

          $scope.confirmDelete = function () {
              $scope.confirmDeletewindow.setOptions({
                  title: "Confirm delete"
              });
              $scope.confirmDeletewindow.center().open();
          }
          $scope.deleteUser = function () {

              adminService.delete($scope.userid).then(function (dataResponse) {
                  if (dataResponse.statusText == "OK") {
                      $scope.confirmDeletewindow.close();
                      $scope.userGrid.dataSource.read();
                  }

                  else {
                      $scope.confirmDeletewindow.close();
                  }
              });
          }

          $scope.showGroups = function () {
              $scope.groupwindow.center().open();
          }
          $scope.groupPortfolioUrl = appSettings.serviceUrl + 'api/admin/GetPortfolioGroups';
          $scope.gridGroupsSource = new kendo.data.DataSource({
              transport: {
                  read: {
                      url: $scope.groupPortfolioUrl,
                      type: "GET",
                      dataType: "json",
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

                      fields: {
                          GroupName: {
                              type: "string"
                          },
                          CountStudent: {
                              type: "number",
                              editable: false, nullable: true
                          },
                          CountTeacher: {
                              type: "number",
                              editable: false, nullable: true
                          }

                      }
                  }
              },

              pageSize: 10 // limits result set
          });
          $scope.groupPortfolioTbOptions = {
              items: [

                  {

                      template: "<button class='k-button' title='Create group' ng-click='addGroup()'><span class='glyphicon glyphicon-plus'></button>"
                  },
                  {
                      template: "<button class='k-button' title='Delete' ng-click='deleteGroup()'><span  class='glyphicon glyphicon-remove'></button>"

                  },
                  {
                      template: "<button class='k-button' title='Group details' ng-click='showGroupDetails()'><span  class='glyphicon glyphicon-zoom-in'></button>"

                  }

              ]
          }

          $scope.groupUSTbOptions = {
              items: [

                                {

                                    template: "<button class='k-button' title='Create group' ng-click='addGroup()'><span class='glyphicon glyphicon-plus'></button>"
                                },
                                {
                                    template: "<button class='k-button' title='Delete' ng-click='deleteGroup()'><span  class='glyphicon glyphicon-remove'></button>"

                                },
                                {
                                    template: "<button class='k-button' title='Group details' ng-click='showUSGroupDetails()'><span  class='glyphicon glyphicon-zoom-in'></button>"

                                }

              ]
          }
          /////////////////////////////UltraSoundGroups
          $scope.groupUSurl = appSettings.serviceUrl + 'api/admin/GetUSGroups';
          $scope.gridUSGroupsSource = new kendo.data.DataSource({
              transport: {
                  read: {
                      url: $scope.groupUSurl,
                      type: "GET",
                      dataType: "json",
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

                      fields: {
                          GroupName: {
                              type: "string"
                          },
                          CountStudent: {
                              type: "number",
                              editable: false, nullable: true
                          },
                          CountTeacher: {
                              type: "number",
                              editable: false, nullable: true
                          }

                      }
                  }
              },

              pageSize: 10 // limits result set
          });
          $scope.groupUSGridOptions = {
              dataSource: $scope.gridUSGroupsSource,
              dataBound: function (e) {
                  var grid = e.sender;
                  var dataItems = grid.dataSource.data();
                  $scope.$apply();
              },
              change: function (e) {
                  var grid = e.sender;
                  var currentDataItem = grid.dataItem(this.select());
                  $scope.selectedUSGroup = currentDataItem.GroupName;
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
                       field: "GroupName",
                       width: "50px",
                   },
                   {
                       field: "CountStudent",
                       width: "50px",

                   },
                     {
                         field: "CountTeacher",
                         width: "50px",

                     },
              ]
          }



          //////////////////////////////////////////////////////
          $scope.groupGridOptions = {
              dataSource: $scope.gridGroupsSource,
              dataBound: function (e) {
                  var grid = e.sender;
                  var dataItems = grid.dataSource.data();
                  $scope.$apply();
              },
              change: function (e) {
                  var grid = e.sender;
                  var currentDataItem = grid.dataItem(this.select());
                  $scope.selectedGroup = currentDataItem.GroupName;
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
                       field: "GroupName",
                       width: "50px",
                   },
                   {
                       field: "CountStudent",
                       width: "50px",

                   },
                     {
                         field: "CountTeacher",
                         width: "50px",

                     },
              ]
          }
          $scope.addGroup = function () {

              $scope.addGroupwnd.setOptions({
                  title: "Create group"
              });
              $scope.addGroupwnd.center().open();

          }

          $scope.isSelectedUser = function () {
              if ($scope.userid === undefined || $scope.userid == null) {
                  return true;
              }
              else {
                  return false;
              }
          }
          $scope.groupDetTbOptions = {
              items: [

              {

                  template: "<button class='k-button' title='Add Member' ng-click='AddMember()'><span class='glyphicon glyphicon-pencil'></button>"
              },
              {
                  template: "<button class='k-button' title='Remove Member' ng-click='RemoveMember()' ng-disabled='isSelectedUser()'><span  class='glyphicon glyphicon-remove'></button>"

              }

              ]
          }

          $scope.mainTbOptions = {
              items: [

                  {

                      template: "<button class='k-button' title='Modify' ng-click='modify()'ng-disabled='isSelectedUser()'><span class='glyphicon glyphicon-pencil'></button>"
                  },
                  {
                      template: "<button class='k-button' title='Delete' ng-click='confirmDelete()' ng-disabled='isSelectedUser()'><span  class='glyphicon glyphicon-remove'></button>"

                  }

              ]
          };

          $scope.IsSelectedUser = function () {
              if ($scope.userid === undefined) {
                  return false
              }
              else {
                  return true;
              }

          }
          $scope.urldata = appSettings.serviceUrl + 'api/admin/Get';
          $scope.gridUserDbSource = new kendo.data.DataSource({
              transport: {
                  read: {
                      url: $scope.urldata,
                      type: "GET",
                      dataType: "json",
                      cache: false
                  }
              },
              //function(o){ $http.get($scope.urldata).success(function (response) {
              //    console.log(response)
              //    o.success(response)
              //})
              schema: {
                  data: "Data",
                  total: function (response) {
                      // console.log(response);
                      return response.Total;
                  },

                  model: {

                      fields: {
                          UserId: {
                              type: "string"
                          },
                          Email: {
                              type: "string"
                          },
                          Name: {
                              type: "string"
                          },
                          Surname: {
                              type: "string"
                          },
                          Gender: {
                              type: "string"
                          },
                          Speciality: {
                              type: "string"
                          },
                          LevelOftraining: {
                              type: "string"
                          },
                          Hospital: {
                              type: "string"
                          },
                          Country: {
                              type: "string"
                          },
                          Admin: {
                              type: "boolean"
                          },
                          TeacherPortfolio: {
                              type: "boolean"
                          },
                          StudentPortfolio: {
                              type: "boolean"
                          },
                          StudentUS: {
                              type: "boolean"
                          },
                          TeacherUS: {
                              type: "boolean"
                          },
                          StudentCollege:{
                              type: "boolean"
                          },
                          TeacherCollege: {
                              type: "boolean"
                          },
                          Password: {
                              type: "string"
                          }

                      }
                  }
              },

              pageSize: 10
          });


          $scope.mainGridOptions = {
              dataSource: $scope.gridUserDbSource,
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

                  $scope.userid = currentDataItem.UserId;
                  $scope.Uname = currentDataItem.Name;
                  $scope.SurName = currentDataItem.Surname;

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
              mobile: true,

              pageable: {
                  refresh: true,
                  pageSizes: [5, 10, 20, 50],
                  buttonCount: 5
              },


              columns: [
                  {
                      field: "UserId",
                      title: "UserId",
                      width: "5%"
                  }, {
                      field: "Email",
                      title: "Email",
                      width: "5%"
                  }, {
                      field: "Name",
                      width: "5%"
                  }, {
                      field: "Surname",
                      width: "5%"
                  }, {
                      field: "Gender",
                      template: "{{dataItem.Gender | translate }}",
                      width: "5%"
                  }, {
                      field: "Speciality",
                      template: "{{dataItem.Speciality | translate }}",


                      width: "5%"
                  }, {
                      field: "LevelOftraining",
                      template: "{{dataItem.LevelOftraining | translate }}",
                      width: "5%"
                  },
              {
                  field: "Hospital",
                  width: "5%"
              },
              {
                  field: "Country",
                  template: "{{dataItem.Country | translate }}",
                  width: "5%"
              },
                  {
                      title: "User Rights",
                      attributes: { style: "text-align:center;" },
                      columns: [{
                          template: '<input type="checkbox" #= Admin ? "checked=checked" : "" # disabled="disabled" ></input>',
                          width: 50,
                          field: "admin",
                          title: "admin",
                      }, {
                          field: "TeacherPortfolio",
                          title: "teacher portfolio",
                          template: '<input type="checkbox" #= TeacherPortfolio ? "checked=checked" : "" # disabled="disabled" ></input>',
                          width: 50
                      }, {
                          field: "StudentPortfolio",
                          title: "student portfolio",
                          template: '<input type="checkbox" #= StudentPortfolio ? "checked=checked" : "" # disabled="disabled" ></input>',
                          width: 50
                      }, {
                          field: "StudentUS",
                          title: "student US",
                          template: '<input type="checkbox" #= StudentUS ? "checked=checked" : "" # disabled="disabled" ></input>',
                          width: 50
                      }, {
                          field: "TeacherUS",
                          title: "teacher US",
                          template: '<input type="checkbox" #= TeacherUS ? "checked=checked" : "" # disabled="disabled" ></input>',
                          width: 50
                      },
                      {
                          field: "StudentCollege",
                          title: "Student College",
                          template: '<input type="checkbox" #= StudentCollege ? "checked=checked" : "" # disabled="disabled" ></input>',
                          width: 50
                      },
                      {
                          field: "TeacherCollege",
                          title: "Teacher College",
                          template: '<input type="checkbox" #= TeacherCollege ? "checked=checked" : "" # disabled="disabled" ></input>',
                          width: 50
                      },
                      ]
                  }

              ]
          };

          $scope.initDDls = function () {

              $scope.hospitalDataSource = {
                  transport: {
                      read: {
                          url: appSettings.serviceUrl + "api/Hospitals/GetHospitals",
                          type: "GET",
                          dataType: "json",
                          cache: false
                      }
                  }
              };

              $scope.hospitalDDLOptions = {
                  dataSource: $scope.hospitalDataSource,
                  dataTextField: "Name",
                  dataValueField: "Id",
                  dataBound: function (e) {
                      var items = e.sender.dataSource.data();

                      if ($scope.user.UserHospital != undefined) {
                          for (var i = 0, max = items.length; i < max; i++) {
                              elem = items[i];
                              if (elem['Name'] == $scope.user.UserHospital) {
                                  $scope.hospitalDDL.select(parseInt(i));
                                  $scope.$apply();
                              }
                          }
                      } else {
                          this.select(0);

                      }
                  },

                  select: function (e) {
                      var dataItem = this.dataItem(e.item.index());
                      if ($scope.hospitalDDL == e.sender) {
                          $scope.user.UserHospital = dataItem.Name;
                          ;

                      }
                  }
              };


              $scope.titlesDataSource = {
                  transport: {
                      read: {
                          url: appSettings.serviceUrl + "api/profile/GetUserTitles",
                          type: "GET",
                          dataType: "json",
                          cache: false
                      }
                  }
              };

              $scope.titlesDDLOptions = {
                  dataSource: $scope.titlesDataSource,
                  dataTextField: "Name",
                  dataValueField: "Id",
                  dataBound: function (e) {
                      var items = e.sender.dataSource.data();

                      if ($scope.user.Title != undefined) {
                          for (var i = 0, max = items.length; i < max; i++) {
                              elem = items[i];
                              if (elem['Id'] == $scope.user.Title) {
                                  $scope.titlesDDL.select(parseInt(i));
                                  $scope.$apply();
                              }
                          }
                      } else {
                          this.select(0);

                      }
                  },

                  select: function (e) {
                      var dataItem = this.dataItem(e.item.index());
                      if ($scope.titlesDDL == e.sender) {
                          $scope.user.TitleId = dataItem.Name;
                          $scope.user.Title = dataItem.Id;
                      }
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
                  dataTextField: "Name",
                  dataValueField: "Id",
                  template: "{{ dataItem.Name | translate }}",
                  valueTemplate: "{{dataItem.Name | translate }}",
                  dataBound: function (e) {
                      var items = e.sender.dataSource.data();
                      if ($scope.user.Speciality != undefined) {
                          for (var i = 0, max = items.length; i < max; i++) {
                              elem = items[i];
                              if (elem['Name'] == $scope.user.Speciality) {
                                  $scope.specialityDDL.select(parseInt(i));
                                  $scope.$apply();
                              }
                          }
                      } else {
                          this.select(0);
                      }
                  },

                  select: function (e) {
                      var dataItem = this.dataItem(e.item.index());
                      if ($scope.specialityDDL == e.sender) {
                          $scope.user.Speciality = dataItem.Name;
                          $scope.$apply();
                      }
                  }
              };

              $scope.lotlDataSource = {
                  transport: {
                      read: {
                          url: appSettings.serviceUrl + "api/Levels/GetLevels",
                          type: "GET",
                          dataType: "json",
                          cache: false
                      }
                  }
              };

              $scope.lotDDLOptions = {
                  dataSource: $scope.lotlDataSource,
                  dataTextField: "Name",
                  dataValueField: "Id",
                  template: "{{ dataItem.Name | translate }}",
                  valueTemplate: "{{dataItem.Name | translate }}",
                  dataBound: function (e) {
                      var items = e.sender.dataSource.data();
                      if ($scope.user.UserLoT != undefined) {
                          for (var i = 0, max = items.length; i < max; i++) {
                              elem = items[i];
                              if (elem['Name'] == $scope.user.UserLoT) {
                                  $scope.lotDDL.select(parseInt(i));

                                  $scope.$apply();
                              }
                          }
                      } else {
                          this.select(0);
                      }
                  },

                  select: function (e) {
                      var dataItem = this.dataItem(e.item.index());
                      if ($scope.lotDDL == e.sender) {
                          $scope.user.UserLoT = dataItem.Name;
                      }
                  }
              };

              $scope.countryDataSource = {
                  transport: {
                      read: {
                          url: appSettings.serviceUrl + "api/Countries/GetCountries",
                          type: "GET",
                          dataType: "json",
                          cache: false
                      }
                  }
              };

              $scope.countryDDLOptions = {
                  dataSource: $scope.countryDataSource,
                  dataTextField: "Name",
                  dataValueField: "Id",
                  template: "{{ dataItem.Name | translate }}",
                  valueTemplate: "{{dataItem.Name | translate }}",
                  dataBound: function (e) {
                      var items = e.sender.dataSource.data();
                      if ($scope.user.Country != undefined) {
                          for (var i = 0, max = items.length; i < max; i++) {
                              elem = items[i];
                              if (elem['Name'] == $scope.user.Country) {
                                  $scope.countryDDL.select(parseInt(i));

                              }
                              $scope.$apply();
                          }
                      } else {
                          this.select(0);
                      }

                  },

                  select: function (e) {
                      var dataItem = this.dataItem(e.item.index());
                      if ($scope.countryDDL == e.sender) {
                          $scope.user.Country = dataItem.Name;
                      }
                  }
              };

              $scope.supervisorDataSource = {
                  transport: {
                      read: {
                          url: appSettings.serviceUrl + "api/admin/GetSupervisors",
                          type: "GET",
                          dataType: "json",
                          cache: false
                      }
                  }
              };

              $scope.selecteerTeacherDataSource = {
                  type: "json",
                  serverFiltering: true,
                  transport: {
                      read: {
                          url: function () {
                              return appSettings.serviceUrl + "api/admin/GetUsersByRoleName?rolename=" + $scope.userRoleName;
                          }
                      }
                  }
              };
              $scope.selecteerHospitalsDataSource = {
                  type: "json",
                  serverFiltering: true,
                  transport: {
                      read: {
                          url: function () {
                              return appSettings.serviceUrl + "api/admin/GetUsersByRoleName?rolename=" + $scope.userRoleName;
                          }
                      }
                  }
              };
              $scope.selecteerGroupsDataSource = {
                  type: "json",
                  serverFiltering: true,
                  transport: {
                      read: {
                          url: function () {
                              return appSettings.serviceUrl + "api/admin/GetOtherGroups";
                          }
                      }


                  }
              };

              $scope.DataSourceSelecteer = function (rolename) {
                  if ($scope.user.PortfolioSupervisorType == 1) {
                      if (rolename == "teacher portfolio") {
                          $scope.userRoleName = "teacher portfolio";
                      }
                      if (rolename == "teacher US") {
                          $scope.userRoleName = "teacher US";
                      }
                      return $scope.selecteerTeacherDataSource;
                  }
                  if ($scope.user.PortfolioSupervisorType == 3) {
                      return $scope.hospitalDataSource;
                  }
                  if ($scope.user.PortfolioSupervisorType == 4) {
                      return $scope.selecteerGroupsDataSource;
                  }
              };
              $scope.selecteerPtfCbxOptions = {
                  dataTextField: "Name",
                  dataValueField: "Id",
                  dataBound: function (e) {
                      var items = e.sender.dataSource.data();
                      if ($scope.user.PortfolioSupervisorType != undefined) {

                          if ($scope.user.UserSuperVisorId !== undefined) {
                              for (var i = 0, max = items.length; i < max; i++) {
                                  elem = items[i];
                                  if (elem['Id'] == $scope.user.UserSuperVisorId) {
                                      $scope.selecteerPtfCbx.select(parseInt(i));
                                      $scope.$apply();
                                  }
                              }
                          }
                          else {

                          }
                      }
                  },
                  select: function (e) {
                      var dataItem = this.dataItem(e.item.index());
                      if ($scope.selecteerPtfCbx == e.sender) {
                          $scope.user.UserSuperVisorId = dataItem.Id;
                          //     $scope.selecteerPtfCbx.text("");
                          $scope.$apply();
                      }
                  }
              }

              $scope.portfolioSupDDLOptions = {
                  dataSource: $scope.supervisorDataSource,
                  dataTextField: "Name",
                  dataValueField: "Id",
                  dataBound: function (e) {
                      var items = e.sender.dataSource.data();
                      if ($scope.user.PortfolioSupervisorType != undefined) {
                          for (var i = 0, max = items.length; i < max; i++) {
                              elem = items[i];
                              if (elem['Id'] == $scope.user.PortfolioSupervisorType) {
                                  $scope.portfolioSupDDL.select(parseInt(i));
                                  $scope.$apply();
                                  $scope.selecteerPtfCbx.setDataSource($scope.DataSourceSelecteer("teacher portfolio"));

                              }
                          }
                      } else {
                          this.select(0);
                      }

                  },

                  select: function (e) {
                      var dataItem = this.dataItem(e.item.index());
                      if ($scope.portfolioSupDDL == e.sender) {
                          $scope.user.PortfolioSupervisorType = dataItem.Id;
                          $scope.$apply();
                          $scope.selecteerPtfCbx.setDataSource($scope.DataSourceSelecteer("teacher portfolio"));

                          $scope.selecteerPtfCbx.text("");

                      }
                      $scope.$apply();
                  }
              };
              $scope.DataSourceUsSelecteer = function (rolename) {
                  if ($scope.user.UsSupervisorType == 1) {

                      if (rolename == "teacher US") {
                          $scope.userRoleName = "teacher US";
                      }
                      return $scope.selecteerTeacherDataSource;
                  }
                  if ($scope.user.UsSupervisorType == 3) {
                      return $scope.hospitalDataSource;
                  }
                  if ($scope.user.UsSupervisorType == 4) {
                      return $scope.selecteerGroupsDataSource;
                  }
              };

              $scope.portfolioUsSupDDLOptions = {
                  dataSource:
                      $scope.supervisorDataSource,
                  dataTextField: "Name",
                  dataValueField: "Id",
                  dataBound: function (e) {
                      var items = e.sender.dataSource.data();
                      if ($scope.user.UsSupervisorType != undefined) {
                          for (var i = 0, max = items.length; i < max; i++) {
                              elem = items[i];
                              if (elem['Id'] == $scope.user.UsSupervisorType) {
                                  $scope.portfolioUSDDL.select(parseInt(i));
                                  $scope.$apply();
                                  $scope.SelecteerUSCbx.setDataSource($scope.DataSourceUsSelecteer("teacher US"));
                                  $scope.$apply();
                              }
                          }
                      } else {
                          this.select(0);
                      }

                  },

                  select: function (e) {
                      var dataItem = this.dataItem(e.item.index());
                      if ($scope.portfolioUSDDL == e.sender) {
                          $scope.user.UsSupervisorType = dataItem.Id;
                          $scope.$apply();
                          $scope.SelecteerUSCbx.setDataSource($scope.DataSourceUsSelecteer("teacher US"));
                      }
                  }
              }
              $scope.USselecteerCbxOptions = {
                  dataTextField: "Name",
                  dataValueField: "Id",
                  dataBound: function (e) {
                      var items = e.sender.dataSource.data();
                      if ($scope.user.UsSupervisorType != undefined) {

                          if ($scope.user.USSuperVisorId !== undefined) {
                              for (var i = 0, max = items.length; i < max; i++) {
                                  elem = items[i];
                                  if (elem['Id'] == $scope.user.USSuperVisorId) {
                                      $scope.$apply();
                                      $scope.SelecteerUSCbx.select(parseInt(i));
                                      $scope.$apply();

                                  }
                              }
                          }
                      }
                      else {
                          $scope.SelecteerUSCbx.text("");
                      }

                  },
                  select: function (e) {
                      var dataItem = this.dataItem(e.item.index());
                      if ($scope.SelecteerUSCbx == e.sender) {
                          $scope.user.USSuperVisorId = dataItem.Id;
                          $scope.$apply();
                      }
                  }

              }

          }
          $scope.updateRights = function (role) {
              var idx = $scope.user.Rights.indexOf(role);

              // Is currently selected
              if (idx > -1) {
                  $scope.user.Rights.splice(idx, 1);
              }

                  // Is newly selected
              else {
                  $scope.user.Rights.push(role);
              }
          };

          $scope.SaveUser = function () {
              $scope.user.StartSubscription = kendo.toString($scope.user.StartSubscription, "MM/dd/yyyy HH:mm tt");
              $scope.user.EndSubscription = kendo.toString($scope.user.EndSubscription, "MM/dd/yyyy HH:mm tt");
              adminService.saveProfile($scope.user).then(function (dataResponse) {
                  if (dataResponse.statusText == "OK") {
                      $scope.WindowModal.close();
                      $scope.userGrid.dataSource.read();
                  }

                  else {
                      // console.log(dataResponse);
                  }
              });

          }
          $scope.createGroup = function () {
              adminService.createGroup($scope.Group).then(function (response) {
                  if (response.statusText == "OK") {
                      $scope.addGroupwnd.close();
                      $scope.groupGrid.dataSource.read();
                  }
                  else {
                      // console.log(response);
                  }
              })
          };


          $scope.deleteGroup = function () {
              adminService.deleteGroup($scope.selectedGroup).then(function (response) {
                  if (response.statusText == "OK") {
                      $scope.addGroupwnd.close();
                      $scope.groupGrid.dataSource.read();
                  }
                  else {
                      // console.log(response);
                  }
              })
          };
          $scope.gridDetailsGroupSource = new kendo.data.DataSource({
              transport: {
                  read: {
                      url: appSettings.serviceUrl + 'api/admin/GetGroupDetails',
                      type: "GET",
                      dataType: "json",
                      cache: false,
                      data: function () {
                          return { groupname: $scope.selectedGroup, isPortfolio: true }
                      }
                  },
              },
              schema: {
                  data: "Data",
                  total: function (response) {
                      return response.Total;
                  },

                  model: {

                      fields: {
                          Students: {
                              type: "string"
                          },
                          Teachers: {
                              type: "string",
                              //defaultValue: { Id: 1, Name: "еуые"}

                          },
                          MemberType: {
                              type: "string"
                          },






                      }
                  }
              },

              pageSize: 10
          });
          function categoryDropDownEditor(container, options) {
              $('<input required name="' + options.field + '"/>')
                  .appendTo(container)
                  .kendoDropDownList({
                      autoBind: false,
                      dataTextField: "Name",
                      dataValueField: "Id",
                      dataSource: {
                          type: "json",
                          transport: {
                              read: appSettings.serviceUrl + 'api/admin/GetTeachersPortfolio'
                          }
                      },
                      dataBound: function (e) {
                          var items = e.sender.dataSource.data();
                          if (options.model != undefined) {
                              for (var i = 0, max = items.length; i < max; i++) {
                                  elem = items[i];
                                  if (elem['Name'] == options.model) {
                                      $scope.portfolioSupDDL.select(parseInt(i));
                                      $scope.$apply();


                                  }
                              }
                          } else {
                              this.select(0);
                          }

                      },
                      select: function (e) {
                          var dataItem = this.dataItem(e.item.index());
                          //if ($scope.SelecteerUSCbx == e.sender) {
                          //    $scope.user.USSuperVisorId = dataItem.Id;
                          $scope.$apply();
                          //}
                      }
                  });
          }
          $scope.groupDetailsGridOptions = {
              autoBind: false,
              dataSource: $scope.gridDetailsGroupSource,
              dataBound: function (e) {
                  var grid = e.sender;
                  var dataItems = grid.dataSource.data();
                  $scope.$apply();
              },
              change: function (e) {
                  var grid = e.sender;
                  var currentDataItem = grid.dataItem(this.select());
                  $scope.selectedGroup = currentDataItem.GroupName;
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
                       field: "Students",
                       title: "Number of students linked to group",
                       width: "50px",
                   },
                   {
                       field: "Teachers",
                       title: "Number of teachers in group",
                       editor: categoryDropDownEditor,//template: "#=Teachers.Name#",
                       width: "50px",

                   },
                   {
                       field: "MemberType",

                       width: "50px",

                   }
              ],
              editable: true
          };

          $scope.gridUSDetailsGroupSource = new kendo.data.DataSource({
              transport: {
                  read: {
                      url: appSettings.serviceUrl + 'api/admin/GetGroupDetails',
                      type: "GET",
                      dataType: "json",
                      cache: false,
                      data: function () {
                          return { groupname: $scope.selectedUSGroup, isPortfolio: false }
                      }
                  },
              },
              schema: {
                  data: "Data",
                  total: function (response) {
                      return response.Total;
                  },

                  model: {

                      fields: {
                          Students: {
                              type: "string"
                          },
                          Teachers: {
                              type: "string"
                          },


                      }
                  }
              },

              pageSize: 10
          });
          $scope.groupUSDetailsGridOptions = {
              autoBind: false,
              dataSource: $scope.gridUSDetailsGroupSource,
              dataBound: function (e) {
                  var grid = e.sender;
                  var dataItems = grid.dataSource.data();
                  $scope.$apply();
              },
              change: function (e) {
                  var grid = e.sender;
                  var currentDataItem = grid.dataItem(this.select());
                  $scope.selectedUSGroup = currentDataItem.GroupName;
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
                       field: "Students",
                       title: "Number of students linked to group",
                       width: "50px",
                   },
                   {
                       field: "Teachers",
                       title: "Number of teachers in group",
                       width: "50px",

                   }
                   ,
                   {
                       field: "MemberType",
                       width: "50px",

                   }
              ]
          };
          $scope.closedetailsWindow = function () {
              $scope.IsPortfolio = false;
              $scope.IsUltraSound = false;
          }
          $scope.showGroupDetails = function (groupName) {
              $scope.IsPortfolio = true;
              $scope.groupDetailswindow.setOptions({
                  title: "Specific of  " + $scope.selectedGroup + " group"
              });

              $scope.groupDetailswindow.center().open();
              $scope.groupDetails.dataSource.read();
          }


          $scope.showUSGroupDetails = function (groupName) {
              $scope.IsUltraSound = true;
              $scope.groupDetailswindow.setOptions({
                  title: "Specific of  " + $scope.selectedUSGroup + " group"
              });

              $scope.groupDetailswindow.center().open();
              $scope.groupUSDetails.dataSource.read();
          }

          $scope.endSubscriptionOptions = {
              format: 'dd/MM/yyyy',
          }

      }]);

})();