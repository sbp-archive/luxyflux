import Dispatcher from './Dispatcher';
import Actions from './Actions';
import Store from './Store';

export {Dispatcher, Actions, Store};

export var defaultStoreConfig = {
    name: null,
    dispatcher: Dispatcher.current,
    handlers: {},
    initialize: ()=>{}
};

export var defaultActionsConfig = {
    dispatcher: Dispatcher.current,
    serviceActions: {},
};

export class LuxaFlux {
    static createStore(StoreClass, config) {
        if (Object.isObject(StoreCls)) {
            config = StoreCls;
            StoreClass = Store;
        }

        config = Object.assign({}, defaultStoreConfig, config);

        var {name, dispatcher, handlers, initializeFn} = config;

        delete config.initialize;
        delete config.dispatcher;
        delete config.handlers;
        delete config.initializeFn;

        for (var [actionType, handlerName] of _entries(handlers)) {
            if (config[handlerName] instanceof Function) {
                handlers[actionType] = config[handlerName];
            }
        };

        return new StoreClass(name, dispatcher, handlers, initializeFn);
    }

    static createActions(ActionsClass, config) {
        if (Object.isObject(ActionsClass)) {
            config = ActionsClass;
            ActionsClass = Actions;
        }

        config = Object.assign({}, defaultActionsConfig, config);

        var {dispatcher, serviceActions} = config;

        delete config.dispatcher;
        delete config.serviceActions;

        var actions = {};

        for (var [actionType, action] of _entries(config)) {
            if (action instanceof Function) {
                actions[actionType] = action;
            }
        }

        for (var [actionType, actionName] of _entries(serviceActions)) {
            var action = actions[actionName];
            if (action) {
                actions[actionName] = Actions.createServiceAction(
                    dispatcher, actionType, action);
            }
        }

        return new ActionsClass(dispatcher, actions);
    }

    static dispatchAction(action, payload) {
        return Dispatcher.current.dispatch(action, payload);
    }
}
export default LuxaFlux;

// using a generator function
function* _entries(obj) {
   for (let key of Object.keys(obj)) {
     yield [key, obj[key]];
   }
}
