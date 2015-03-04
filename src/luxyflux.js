import Dispatcher from './dispatcher';
import ActionCreators from './actioncreators';
import Store from './store';

export {
    Dispatcher, ActionCreators, Store
};

export var defaultStoreConfig = {
    dispatcher: Dispatcher.current,
    name: null,
    handlers: {},
    initialize: () => {},
    decorate: null
};

export var defaultActionCreatorsConfig = {
    dispatcher: Dispatcher.current,
    serviceActions: {},
    decorate: null
};

export class LuxyFlux {
    static createStore(config, StoreCls = Store) {
        config = Object.assign({}, defaultStoreConfig, config);

        var {
            name, dispatcher, handlers, initialize, decorate
        } = config;
        delete config.name;
        delete config.dispatcher;
        delete config.handlers;
        delete config.initialize;
        delete config.decorate;

        var source = decorate || config;
        if (decorate) {
            handlers = Object.assign({}, handlers, decorate.handlers || {});
        }

        for (let [actionType, handlerName] of _entries(handlers)) {
            let handler = source[handlerName];
            if (handler instanceof Function) {
                handlers[actionType] = source[handlerName];
            }
        }

        if (decorate) {
            StoreCls.decorate(decorate, name, dispatcher, handlers);
            return decorate;
        } else {
            return new StoreCls(name, dispatcher, handlers, initialize);
        }
    }

    static createActions(config, ActionCreatorsCls = ActionCreators) {
        config = Object.assign({}, defaultActionCreatorsConfig, config);

        var {
            dispatcher, serviceActions, decorate
        } = config;
        delete config.dispatcher;
        delete config.serviceActions;
        delete config.decorate;

        var source = decorate || config;
        if (decorate) {
            serviceActions = Object.assign({}, serviceActions, decorate.serviceActions || {});
        }

        for (let [actionType, actionName] of _entries(serviceActions)) {
            let action = source[actionName];
            if (action instanceof Function) {
                let serviceAction = ActionCreatorsCls.createServiceAction(
                    dispatcher, actionType, action);

                Object.defineProperty(source, actionName, {
                    writable: false,
                    enumerable: false,
                    value: serviceAction
                });
            }
        }

        if (decorate) {
            ActionCreatorsCls.decorate(decorate, dispatcher);
            return decorate;
        } else {
            return new ActionCreatorsCls(dispatcher, source);
        }
    }
}
export default LuxyFlux;

// using a generator function
function* _entries(obj) {
    for (let key of Object.keys(obj)) {
        yield [key, obj[key]];
    }
}
