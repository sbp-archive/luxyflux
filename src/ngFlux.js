import {
    Actions,
    Dispatcher,
    Store,
    LuxaFlux
} from './LuxaFlux';

window.angular.module('connect-flux', [])
.service('LuxaFluxActions', function () {
    return Actions;
})
.service('LuxaFluxDispatcher', function() {
    return Dispatcher;
})
.service('LuxaFluxStore', function() {
    return Store;
})
.service('LuxaFlux', function() {
    return LuxaFlux;
});
