'use strict';
(function () {

    angular
        .module('Eportfolio')
        .factory('adminService', UserService)
        .run(['adminService', function (userService) {

        }])

    UserService.$inject = ['$http', '$q', '$localStorage', '$exceptionHandler', 'appSettings', '$httpParamSerializer', '$httpParamSerializerJQLike'];

    function UserService($http, $q, $localStorage, $exceptionHandler, appSettings, $httpParamSerializer, $httpParamSerializerJQLike) {
        var serviceBase = appSettings.serviceUrl;
        var adminServiceFactory = {};


        adminServiceFactory.modify = _modify;
        adminServiceFactory.delete = _delete;
        adminServiceFactory.saveProfile = _saveProfile;
        adminServiceFactory.createGroup = _createGroup;
        adminServiceFactory.addUsItems = _addUsItems;
        adminServiceFactory.addUSItem = _addUSItem;
        adminServiceFactory.modifyTypeItem = _modifyTypeItem;
        adminServiceFactory.addIndication = _addIndication;
        adminServiceFactory.addView = _addView;
        adminServiceFactory.deleteUsType = _deleteUsType;
        adminServiceFactory.saveUS = _saveUS;
        adminServiceFactory.deleteIndication = _deleteIndication;
        adminServiceFactory.deleteView = _deleteView;
        adminServiceFactory.addTag = _addTag;
        adminServiceFactory.editTag = _editTag;
        adminServiceFactory.removeTag = _removeTag;
        adminServiceFactory.saveNewUs = _saveNewUs;
        adminServiceFactory.archiveUpload = _archiveUpload;
        adminServiceFactory.deleteUpload = _deleteUpload;
        adminServiceFactory.updateSorting = _updateSorting;
        adminServiceFactory.reactivate = _reactivate;
        return adminServiceFactory;


        function _modifyTypeItem(name, typeId, id) {
            var successCallback = function (response) {
                if (!response.data) {
                    $exceptionHandler(error.create("Unable to modify items", "Server Error"), "Update UsItem");
                    return false;
                }

                return true;
            };

            var errorCallback = function (errorResponse) {
                $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Update UsItem");
            };


            var url = serviceBase + "api/USTypes/ModifyUSTypeItem";//?specialityId=" + specialityId + "&itemType=" + itemType + "&arrayId=" + arrayId;
            var data = {
                Name: name,
                ItemType: typeId,
                Id: id
            };
            // console.log(data);
            return $http.post(url, $httpParamSerializer(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback);
        }
        function _deleteUsType(ustypeId) {
            var successCallback = function (response) {
                return response;
            };

            var errorCallback = function (errorResponse) {

                return errorResponse;
            };


            var url = serviceBase + "api/USTypes/DeleteUSItem?ultrasoundId=" + ustypeId;//?specialityId=" + specialityId + "&itemType=" + itemType + "&arrayId=" + arrayId;
            var data = {
                ultrasoundId: ustypeId,

            };
            // console.log(data);
            return $http.post(url, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback);

        }
        function _deleteIndication(usId, SpecialityId) {
            var successCallback = function (response) {
                return response;
            };

            var errorCallback = function (errorResponse) {
                return errorResponse;
            };
            var url = serviceBase + "api/USTypes/DeleteIndication"//?indicationId=" + id;
            var data = {
                UsId: itemType,
                Speciality: SpecialityId
            };
            // console.log(data);
            return $http.post(url, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback);

        }
        function _deleteView(id) {
            var successCallback = function (response) {
                return response;
            };

            var errorCallback = function (errorResponse) {
                return errorResponse;
            };
            var url = serviceBase + "api/USTypes/DeleteView?viewId=" + id;
            //var data = {
            //    UsItemtype: itemType,
            //    Id: id
            //};
            // console.log(data);
            return $http.post(url, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback);

        }
        function _addUSItem(name, specialityId) {
            var successCallback = function (response) {
                //if (!response.data) {
                //    $exceptionHandler(error.create("Unable to add items", "Server Error"), "Add US item");
                //    return false;
                //}

                //return true;
                return response;
            };

            var errorCallback = function (errorResponse) {
                return errorResponse;//  $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Add US item");
            };


            var url = serviceBase + "api/USTypes/AddUSTypeItem";//?specialityId=" + specialityId + "&itemType=" + itemType + "&arrayId=" + arrayId;
            var data = {
                Name: name,
                SpecialityId: specialityId,
            };
            // console.log(data);
            return $http.post(url, $httpParamSerializer(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback);
        }
        function _addIndication(name, ultrasoundId, specialityId) {
            var successCallback = function (response) {
                //if (!response.data) {
                //    $exceptionHandler(error.create("Unable to add items", "Server Error"), "Add indication");
                //    return false;
                //}

                return response;
            };

            var errorCallback = function (errorResponse) {
                return errorResponse;
                //$exceptionHandler(error.create(errorResponse.data, "Server Error"), "Add indication ");
            };


            var url = serviceBase + "api/USTypes/Addindication";//?specialityId=" + specialityId + "&itemType=" + itemType + "&arrayId=" + arrayId;
            var data = {
                Name: name,
                UltrasoundTypeId: ultrasoundId,
                SpecialityId: specialityId,
            };
            // console.log(data);
            return $http.post(url, $httpParamSerializer(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback);
        }
        function _addView(name, ultrasoundId, specialityId) {
            var successCallback = function (response) {
                return response;
                //if (!response.data) {
                //    $exceptionHandler(error.create("Unable to add items", "Server Error"), "Add indication");
                //    return false;
                //}

                //    return true;
            };

            var errorCallback = function (errorResponse) {
                return errorResponse; // $exceptionHandler(error.create(errorResponse.data, "Server Error"), "Add indication ");
            };


            var url = serviceBase + "api/USTypes/AddView";//?specialityId=" + specialityId + "&itemType=" + itemType + "&arrayId=" + arrayId;
            var data = {
                Name: name,
                UltrasoundTypeId: ultrasoundId,
                SpecialityId: specialityId,
            };
            // console.log(data);
            return $http.post(url, $httpParamSerializer(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback);
        }
        function _modify() {
            var data = $localStorage.user.username;
            var url = serviceBase + "api/profile/Get";
            return $http({
                method: 'GET',
                url: url,
                params: { userEmail: data }

            });

        }
        function _addUsItems(itemName, specialityId) {

            var successCallback = function (response) {
                //if (!response.data) {
                //    $exceptionHandler(error.create("Unable to add items", "Server Error"), "Add Us Item");
                return response;
                //}

                //return true;
            };

            var errorCallback = function (errorResponse) {
                return errorResponse; //$exceptionHandler(error.create(errorResponse.data, "Server Error"), "Add Us Item");
            };


            var url = serviceBase + "api/USTypes/AddUSItem";//?specialityId=" + specialityId + "&itemType=" + itemType + "&arrayId=" + arrayId;
            var data = {
                ItemName: itemName,
                SpecialityId: specialityId,

            };
            // console.log(data);
            return $http.post(url, $httpParamSerializer(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback);
        }
        function _createGroup(groupName) {
            var url = serviceBase + "api/admin/CreateGroup?groupName=" + groupName;
            function successCallback(response) {
                return response;
            };
            function errorCallback(response) {
                // console.log(response);
                return response;
            };


            return $http.post(url, groupName, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback);
        }

        function _deleteGroup(groupName) {

        }
        function _delete(userId) {
            var urlprofile = serviceBase + "api/admin/Delete?userid=" + userId;

            function successCallback(response) {
                //response

                return response;
            };
            function errorCallback(response) {
                // console.log(response);
                return response;
            };
            var data = { userid: userId };

            return $http.post(urlprofile, userId, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback);
        }


        function _saveProfile(user) {
            var url = serviceBase + "api/admin/SaveProfileDetails";
            console.log(user);
            function successCallback(response) {
                //response

                return response;
            };
            function errorCallback(response) {
                // console.log(response);
                return response;
            };
            // var data = { userid: userId };

            return $http.post(url, $httpParamSerializerJQLike(user), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback);
        }

        function _saveUS(usId, name, specialityId, usItemType, usName, id, items, sortId) {
            var successCallback = function (response) {
                //if () {
                // $exceptionHandler(error.create("Unable to add items", "Server Error"), "Add Us Item");
                return response;
                //}


            };

            var errorCallback = function (errorResponse) {
                //$exceptionHandler(error.create(errorResponse.data, "Server Error"), "Add Us Item");
                return errorResponse;
            };


            var url = serviceBase + "api/Ultrasound/SaveUS";//?specialityId=" + specialityId + "&itemType=" + itemType + "&arrayId=" + arrayId;
            var data = {
                UltrasoundId: usId,
                Name: name,
                Speciality: specialityId,
                UsItemtype: usItemType,
                UltrasoundName: usName,
                Id: id,
                UsTypenames: items,
                SortingId: sortId
            };
            // console.log(data);
            return $http.post(url, $httpParamSerializer(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback);
        }


        function _addTag(name, specialityId, viewId, answers) {
            var successCallback = function (response) {
                //if () {
                // $exceptionHandler(error.create("Unable to add items", "Server Error"), "Add Us Item");
                return response;
                //}


            };

            var errorCallback = function (errorResponse) {
                //$exceptionHandler(error.create(errorResponse.data, "Server Error"), "Add Us Item");
                return errorResponse;
            };


            var url = serviceBase + "api/Ultrasound/AddTag";//?specialityId=" + specialityId + "&itemType=" + itemType + "&arrayId=" + arrayId;
            var data = {
                Id: 0,
                Name: name,
                Speciality: specialityId,
                View: viewId,
                Answers: answers,
            };
            // console.log(data);
            return $http.post(url, $httpParamSerializer(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback);
        }

        function _editTag(id, tagname, viewname, answers, sortId) {
            var successCallback = function (response) {
                return response;
            };

            var errorCallback = function (errorResponse) {

                return errorResponse;
            };


            var url = serviceBase + "api/USTypes/EditTag";//?specialityId=" + specialityId + "&itemType=" + itemType + "&arrayId=" + arrayId;
            var data = {
                Id: id,
                Name: tagname,
                View: viewname,
                Answers: answers,
                Speciality: 0,
                ViewName: viewname,
                SortingId: sortId
                // ultrasoundId: ustypeId,

            };
            // console.log(data);
            return $http.post(url, $httpParamSerializer(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback);

        }


        function _removeTag(id) {
            var successCallback = function (response) {
                return response;
            };

            var errorCallback = function (errorResponse) {

                return errorResponse;
            };


            var url = serviceBase + "api/USTypes/DeleteTag?id=" + id;


            return $http.post(url, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback);

        }
        function _saveNewUs(us, speciality) {
            var successCallback = function (response) {
                return response;
            };

            var errorCallback = function (errorResponse) {

                return errorResponse;
            };


            var url = serviceBase + "api/UltrasoundTypes/AddUs";
            var indications = _(us.Indications).pluck("Value");
            var view = angular.toJson(us.Views, false);
            var Tags = [{}]; var Answers = [{}];
            var Ultrasound = [{ Id: null, Name: null }, Tags[{ TagName: null }, Answers[{ Name: null }]], ];
            ;
            var data = {
                Name: us.ultrasoundName,
                Views: us.Views,
                Indications: indications,
                Speciality: speciality,
            };
            return $http.post(url, $httpParamSerializerJQLike(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback)
        }
        function _archiveUpload(id) {
            var successCallback = function (response) {
                return response;
            };

            var errorCallback = function (errorResponse) {

                return errorResponse;
            };

            var url = serviceBase + "api/Archive/Post?id=" + id;
            return $http.post(url, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback)

        }
        function _deleteUpload(id) {
            var successCallback = function (response) {
                return response;
            };

            var errorCallback = function (errorResponse) {

                return errorResponse;
            };

            var url = serviceBase + "api/Upload/Post?id=" + id;
            return $http.post(url, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback)

        }

        function _updateSorting(arr) {
            var successCallback = function (response) {
                return response;
            };
            var errorCallback = function (errorResponse) {
                return errorResponse;
            };
            var data = {
                Sort: arr
            };

            var url = serviceBase + "api/Upload/Sort";
            return $http.post(url, $httpParamSerializerJQLike(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback)

        }
        function _reactivate(id) {
            var successCallback = function (response) {
                return response;
            };

            var errorCallback = function (errorResponse) {

                return errorResponse;
            };

            var url = serviceBase + "api/Archive/Reactivate?id=" + id;
            return $http.post(url, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(successCallback, errorCallback)

        }

    };
})();

