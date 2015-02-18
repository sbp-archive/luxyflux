import angular from 'angular';

import {
    ActionCreators,
    Dispatcher,
    Store,
    LuxaFlux
} from './LuxaFlux';

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

export var luxafluxModule = angular.module('connect-luxaflux', [])
    .service('LuxaFluxActionCreators', function () {
        return ActionCreators;
    })
    .service('LuxaFluxDispatcher', function() {
        return AngularDispatcher;
    })
    .service('LuxaFluxStore', function() {
        return Store;
    })
    .service('LuxaFlux', function() {
        return LuxaFlux;
    });

export default luxafluxModule;
