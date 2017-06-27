(function (angular) {

    "use strict";

    var authInterceptor = function ($q, $injector, $location, $rootScope, $localStorage) {


        return {
            //  
            request: function (config) {
                var authService = $injector.get('authService');
             //   
                config.headers = config.headers || {};
                var authData = $localStorage.accessToken
              
                if (authData) {
                    

                      //if(!config.url.startsWith("https://portfoliofiles") )
                        config.headers.Authorization = "Bearer " + $localStorage.accessToken;
                    //config.headers["Content-Type"] = 'application/x-www-form-urlencoded';
                }

                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    $rootScope.$broadcast("unauthorized");
                }
                return response;
            },
            responseError: function (responseError) {
                if (responseError.status === 401) {
                    var authService = $injector.get('authService');
                    var authData = $localStorage.accessToken
                    //console.log(responseError);
                    if (authData) {
                        if (authData.useRefreshTokens) {
                            $location.path('/refresh');
                            return $q.reject(responseError);
                        }
                    }

                    $rootScope.$broadcast("unauthorized");
                    authService.logOut();
                    $location.path('/login');
                }

                return $q.reject(responseError);
                //return { data: false };
            }
        };
    };

    authInterceptor.$inject = ["$q", "$injector", "$location", "$rootScope", "$localStorage"];

    angular
        .module("Eportfolio")
        .factory("authInterceptor", authInterceptor)
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push("authInterceptor");
        });

}(angular));