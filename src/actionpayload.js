(function (angular) {
    'use strict';

    var ActionPayload = function (options) {
    };

    ActionPayload.prototype = {
        toJSON: function() {},
        toString: function() {},
        rollback: function() {},
        addViewHandler: function() {},
        addStoreHandler: function() {},
        addRollbackHandler: function() {}
    };

    angular.module('connect-flux').service('FluxActionPayload', [function () {
        return ActionPayload;
    }]);
}(window.angular));
