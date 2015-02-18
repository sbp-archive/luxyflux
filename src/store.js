var _storeCounter = 1;

export class Store {
    static decorate(owner, name, dispatcher, handlers) {
        var store = new Store(name, dispatcher, handlers, null, owner);
        Object.defineProperties(owner, {
            _storeDecorator: {
                configurable: false,
                writable: false,
                enumberable: false,
                value: store
            },
            name: {
                get: store.getName.bind(store),
                set: store.setName.bind(store)
            },
            dispatcher: {
                get: store.getDispatcher.bind(store),
                set: store.setDispatcher.bind(store)
            },
            dispatch: {
                configurable: true,
                writable: true,
                enumberable: false,
                value: store.dispatch.bind(store)
            },
            waitFor: {
                configurable: true,
                writable: true,
                enumberable: false,
                value: store.waitFor.bind(store)
            }
        });

        if (owner.initialize instanceof Function) {
            owner.initialize();
        }
    }

    constructor(name, dispatcher, handlers = {}, initializeFn = null, handlerContext = null) {
        this.setName(name);
        this.setDispatcher(dispatcher);

        this.handlers = new Map();

        for (let [action, handler] of _entries(handlers)) {
            this.addActionHandler(action, handler);
        }

        if (initializeFn) {
            this.initialize = initializeFn.bind(this);
            this.initialize();
        }

        this.handlerContext = handlerContext || this;
    }

    setDispatcher(dispatcher) {
        if (this.dispatcher && this.dispatcher !== dispatcher) {
            this.dispatcher.unregister(this.name);
        }
        dispatcher.register(this.name, this.callback.bind(this));
        this.dispatcher = dispatcher;
    }

    getDispatcher() {
        return this.dispatcher;
    }

    /**
     * Dispatches an action to the dispatcher defined on this Actions
     *
     * @return { Promise } A promise to be resolved when all the callbacks have finised.
     */
    dispatch(actionType) {
        var args = Array.from(arguments);
        return this.dispatcher.dispatch(actionType, ...args.slice(1));
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        if (!this.name) {
            this.name = `luxaflux-store-name-${_storeCounter++}`;
        }
        return this.name;
    }

    /**
     * Creates a promise and waits for the callbacks specified to complete before resolve it.
     *
     * @param  {String<Array>|String} tokens The store tokens to wait for.
     * @return {Promise} A promise to be resolved when the specified callbacks are completed.
     */
    waitFor(tokens) {
        return this.dispatcher.waitFor(tokens);
    }

    /**
     * This is the callback method that needs to be registered with the dispatcher
     */
    callback(action) {
        var handler = this.handlers.get(action);
        if (handler) {
            handler.call(this.handlerContext, ...Array.from(arguments).slice(1));
        }
    }

    /**
     * Bind callback to specific action
     *
     * @param {Object} callback An object where each key is the name of an action
     * and the value is the callback to be called when that action is dispatched
     */
    addActionHandler(action, handler) {
        this.handlers.set(action, handler);
    }
}

export default Store;

// using a generator function
function* _entries(obj) {
   for (let key of Object.keys(obj)) {
     yield [key, obj[key]];
   }
}
