(function (angular) {
    'use strict';

    angular.module('oc.lazyLoad').config(["$provide", function ($provide) {
        $provide.decorator('$ocLazyLoad', ["$delegate", "$templateCache", "$q", "$http", function ($delegate, $templateCache, $q, $http) {
         
            $delegate.templatesLoader = function (paths, callback, params) {
                var promises = [],
                    filesCache = $delegate._getFilesCache();

                angular.forEach(paths, function (url) {
                    var deferred = $q.defer();
                    promises.push(deferred.promise);
                    $http.get(url, params).then(function (response) {
                        var data = response.data;
                        if (angular.isString(data) && data.length > 0) {
                            angular.forEach(angular.element(data), function (node) {
                                if (node.nodeName === 'SCRIPT' && node.type === 'text/ng-template') {
                                    $templateCache.put(node.id, node.innerHTML);
                                }
                            });
                        }
                        if (angular.isUndefined(filesCache.get(url))) {
                            filesCache.put(url, true);
                        }
                        deferred.resolve();
                    })['catch'](function (response) {
                        deferred.reject(new Error('Unable to load template file "' + url + '": ' + response.data));
                    });
                });
                return $q.all(promises).then(function () {
                    callback();
                }, function (err) {
                    callback(err);
                });
            };
            $delegate.templatesLoader.ocLazyLoadLoader = true;

            return $delegate;
        }]);
    }]);
})(angular);