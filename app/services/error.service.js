(function (angular, undefined) {

    "use strict";

    var service = function () {

        var objectToString = function (name, obj) {

            var str = "";

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] !== "object") {
                        str += name + key + " = " + obj[key] + "\n";
                    } else {
                        str += name + key + " = " + objectToString(key + ".", obj[key]) + "\n";
                    }
                }
            }

            return str;
        };

        var create = function (err, errorType) {
            if (err === undefined) {
                return new Error("Unknown Error");
            }

            var message = "";

            if (typeof err === "object") {

                if (errorType) {
                    message = errorType + "\n";
                }

                message += objectToString("", err);

            } else {
                message = err.toString();
            }

            return new Error(message);
        };

        return { create: create };
    };

    service.$inject = [];

    angular
        .module("Eportfolio")
        .service("error", service);

}(angular));