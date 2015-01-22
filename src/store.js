(function (angular) {
    'use strict';

    var Store = function (options) {
    };

    Store.prototype = {
        addChangeListener: function() {},
        setState: function() {},
        hasChanged: function() {},
        dispose: function() {},
        handleAction: function() {}
    };

    angular.module('connect-flux').service('FluxStore', [function () {
        return Store;
    }]);
}(window.angular));
