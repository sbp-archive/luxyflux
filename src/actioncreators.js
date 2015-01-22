(function (angular) {
    'use strict';

    var ActionCreators = function (options) {
    };

    ActionCreators.prototype = {
        dispatch: function() {}
    };

    angular.module('connect-flux').service('FluxActionCreators', [function () {
        return ActionCreators;
    }]);
}(window.angular));
