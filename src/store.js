var _storeCounter = 1;

export class Store {
    constructor(
        name,
        dispatcher,
        handlers = {},
        initializeFn = ()=>{}
    ) {
        if (!dispatcher) {
            throw new Error('You have to specify a dispatcher when creating a Store');
        }

        this.name = name;
        this.dispatcher = dispatcher;
        this.initialize = initializeFn.bind(this);

        this.addActionHandlers(handlers);
        this.initialize();
    }

    set dispatcher(dispatcher) {
        if (this._dispatcher !== dispatcher) {
            this._dispatcher.unregister(this.name);
        }
        dispatcher.register(this.name, this.callback);
        this._dispatcher = dispatcher;
    }

    get dispatcher() {
        return this._dispatcher;
    }

    set name(name) {
        if (!name) {
            name = `luxaflux-store-name-${_storeCounter++}`;
        }
        this._name = name;
    }

    get name() {
        return this._name;
    }

    /**
     * Bind callbacks to specific actions
     *
     * @param {Object} callbacks An object where each key is the name of an action
     * and the value is the callback to be called when that action is dispatched
     */
    addActionHandlers(actionHandlers) {

    }

    /**
     * This is the callback method that needs to be registered with the dispatcher
     */
    callback(action, payload) {

    }

    /**
     * Creates a promise and waits for the callbacks specified to complete before resolve it.
     *
     * @param  {Function<Array>|Function} callbacks The callbacks to wait for.
     * @return {Promise} A promise to be resolved when the specified callbacks are completed.
     */
    waitFor(tokens) {

    }
}

export default Store;
