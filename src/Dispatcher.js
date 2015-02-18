var _current;
var _tokenCounter = 1;
var _idCounter = 1;

export class Dispatcher {
    static get current() {
        if (!_current) {
            _current = new Dispatcher();
        }
        return _current;
    }

    static set current(current) {
        this._current = current;
    }

    constructor(id) {
        this.id = id || `dispatcher-${_idCounter++}`;

        this._callbacks = new Map();
        this._dispatchQueue = [];

        this._currentDispatch = false;
        this._currentDispatchPromises = new Map();
    }

    /**
     * Register a callback that will be called when an action is dispatched.
     *
     * @param  {Function} callback The callback to be called when an action is dispatched
     * @return {String} The callback token that can be used to unregister this callback
     */
    register(token, callback) {
        if (token instanceof Function) {
            callback = token;
            token = `luxaflux-callback-token-${_tokenCounter++}`;
        }

        this._callbacks.set(token, callback);

        return token;
    }

    /**
     * Unregister a callback from this dispatcher
     *
     * @param  {String} token The callback token to be unregistered from this dispatcher
     */
    unregister(token) {
        return this._callbacks.delete(token);
    }

    /**
     * Creates a promise and waits for the callbacks specified to complete before resolve it.
     *
     * @param  {String<Array>|String} tokens The callback tokens to wait for.
     * @return {Promise} A promise to be resolved when the specified callbacks are completed.
     */
    waitFor(tokens) {
        if (!Array.isArray(tokens)) {
            tokens = [tokens];
        }

        var waitForPromises = [];

        for (var token of tokens) {
            if (this._currentDispatchPromises.has(token)) {
                waitForPromises.push(this._currentDispatchPromises.get(token));
            }
        }

        if (!waitForPromises.length) {
            return Promise.resolve();
        }

        return Promise.all(waitForPromises);
    }

    /**
     * Dispatches an action to all the registered callbacks/stores.
     *
     * If a second action is dispatched while there is a dispatch on, it will be
     * enqueued an dispatched after the current one.
     *
     * @return { Promise } A promise to be resolved when all the callbacks have finised.
     */
    dispatch() {
        var dispatchArguments = Array.from(arguments);
        var promise;

        // If we are in the middle of a dispatch, enqueue the dispatch
        if (this._currentDispatch) {
            // Dispatch after the current one
            promise = this._currentDispatch.then(() => {
                return this._dispatch.call(this, dispatchArguments);
            });

            // Enqueue, set the chain as the current promise and return
            this._dispatchQueue.push(promise);
        }
        else {
            promise = this._dispatch(dispatchArguments);
        }

        this._currentDispatch = promise;

        return promise;
    }

    _dispatch(dispatchArguments) {
        this._currentDispatchPromises.clear();

        for (let [token, callback] of this._callbacks) {
            // A closure is needed for the callback and token variables
            ((token, callback) => {
                // All the promises must be set in this._currentDispatchPromises
                // before trying to resolved in order to make waitFor work
                var promise = Promise.resolve()
                    .then(() => {
                        return this._executeCallback(callback, dispatchArguments);
                    })
                    .catch((e) => {
                        throw new Error(e.stack || e);
                    });

                this._currentDispatchPromises.set(token, promise);
            })(token, callback);
        }

        var dequeue = () => {
            this._dispatchQueue.shift();
            if (!this._dispatchQueue.length) {
                this._currentDispatch = false;
            }
        };
        var dispatchPromises = Array.from(this._currentDispatchPromises.values());
        return Promise.all(dispatchPromises).then(dequeue, dequeue);
    }

    _executeCallback(callback, dispatchArguments) {
        return callback.apply(this, dispatchArguments);
    }

    /**
     * Is this dispatcher currently dispatching.
     *
     * @return {Boolean}
     */
    isDispatching() {
        return !!this._dispatchQueue.length;
    }
}

export default Dispatcher;
