import angular from 'angular';

import {
    ActionCreators,
    Dispatcher,
    Store,
    LuxyFlux
} from './luxyflux';

class AngularDispatcher extends Dispatcher {
    constructor(name, rootScope) {
        super(name);
        this._rootScope = rootScope;
    }

    _executeCallback() {
        var args = Array.from(arguments);
        this._rootScope.$apply(() => {
            super._executeCallback.call(this, ...args);
        });
    }
}

export var luxyfluxModule = angular.module('luxyflux', [])
    .service('LuxyFluxActionCreators', function () {
        return ActionCreators;
    })
    .service('LuxyFluxDispatcher', function() {
        return AngularDispatcher;
    })
    .service('LuxyFluxStore', function() {
        return Store;
    })
    .service('LuxyFlux', function() {
        return LuxyFlux;
    });

export default luxyfluxModule;
