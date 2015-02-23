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
        this.rootScope = rootScope;
    }

    _executeCallback() {
        var args = Array.from(arguments);
        this.rootScope.$apply(() => {
            super._executeCallback.call(this, ...args);
        });
    }
}

class AngularActionCreators extends ActionCreators {
    static createServiceAction(dispatcher, actionType, action) {
        return function() {
            var args = Array.from(arguments);
            dispatcher.dispatch(`${actionType}_STARTED`, ...args);

            return new Promise((resolve, reject) => {
                dispatcher.rootScope.$apply(() => {
                    action.call(this, ...args).then(
                        (result) => {
                            dispatcher.dispatch(`${actionType}_COMPLETED`, result, ...args);
                            resolve(result);
                        },
                        (error) => {
                            dispatcher.dispatch(`${actionType}_FAILED`, error, ...args);
                            reject(error);
                        }
                    );
                });
            });
        };
    }
}

export var luxyfluxModule = angular.module('luxyflux', [])
    .service('LuxyFluxActionCreators', function () {
        return AngularActionCreators;
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
