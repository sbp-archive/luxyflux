import angular from 'angular';

import {
    ActionCreators,
    Dispatcher,
    Store,
    LuxyFlux
}
from './luxyflux';

export var luxyfluxModule = angular.module('luxyflux', []);

luxyfluxModule.service('LuxyFluxActionCreators', [
    '$q',
    function($q) {
        return class AngularActionCreators extends ActionCreators {
            static createServiceAction(dispatcher, actionType, action) {
                return function() {
                    var args = Array.from(arguments);
                    dispatcher.dispatch(`${actionType}_STARTED`, ...args);
                    return $q((resolve, reject) => {
                        action.call(this, ...args).then(
                            (result) => {
                                if (result !== undefined) {
                                    args.unshift(result);
                                }
                                dispatcher.dispatch(
                                    `${actionType}_COMPLETED`,
                                    ...args);
                                resolve(result);
                            }, (error) => {
                                if (error !== undefined) {
                                    args.unshift(error);
                                }
                                dispatcher.dispatch(
                                    `${actionType}_FAILED`, ...args
                                );
                                reject(error);
                            }
                        );
                    });
                };
            }
        };
    }
]);

luxyfluxModule.service('LuxyFluxDispatcher', [
    '$rootScope',
    function($rootScope) {
        return class AngularDispatcher extends Dispatcher {
            _executeCallback() {
                var args = Array.from(arguments);
                $rootScope.$apply(() => {
                    super._executeCallback.call(this, ...args);
                });
            }
        };
    }
]);

luxyfluxModule.service('LuxyFluxStore', function() {
    return class AngularStore extends Store {};
});

luxyfluxModule.service('LuxyFlux', function() {
    return class AngularLuxyFlux extends LuxyFlux {};
});

export default luxyfluxModule;
