define(["exports"], function (exports) {
    "use strict";

    var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

    var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var _current;
    var _tokenCounter = 1;
    var _idCounter = 1;

    var Dispatcher = exports.Dispatcher = (function () {
        function Dispatcher(id) {
            _classCallCheck(this, Dispatcher);

            this.id = id || "dispatcher-" + _idCounter++;

            this._callbacks = new Map();
            this._dispatchQueue = [];

            this._currentDispatch = false;
            this._currentDispatchPromises = new Map();
        }

        _prototypeProperties(Dispatcher, {
            current: {
                get: function () {
                    if (!_current) {
                        _current = new Dispatcher();
                    }
                    return _current;
                },
                set: function (current) {
                    this._current = current;
                },
                configurable: true
            }
        }, {
            register: {

                /**
                 * Register a callback that will be called when an action is dispatched.
                 *
                 * @param  {Function} callback The callback to be called when an action is dispatched
                 * @return {String} The callback token that can be used to unregister this callback
                 */
                value: function register(token, callback) {
                    if (token instanceof Function) {
                        callback = token;
                        token = "luxyflux-callback-token-" + _tokenCounter++;
                    }

                    this._callbacks.set(token, callback);

                    return token;
                },
                writable: true,
                configurable: true
            },
            unregister: {

                /**
                 * Unregister a callback from this dispatcher
                 *
                 * @param  {String} token The callback token to be unregistered from this dispatcher
                 */
                value: function unregister(token) {
                    return this._callbacks["delete"](token);
                },
                writable: true,
                configurable: true
            },
            waitFor: {

                /**
                 * Creates a promise and waits for the callbacks specified to complete before resolve it.
                 *
                 * @param  {String<Array>|String} tokens The callback tokens to wait for.
                 * @return {Promise} A promise to be resolved when the specified callbacks are completed.
                 */
                value: function waitFor(tokens) {
                    if (!Array.isArray(tokens)) {
                        tokens = [tokens];
                    }

                    var waitForPromises = [];

                    for (var _iterator = tokens[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
                        var token = _step.value;
                        if (this._currentDispatchPromises.has(token)) {
                            waitForPromises.push(this._currentDispatchPromises.get(token));
                        }
                    }

                    if (!waitForPromises.length) {
                        return Promise.resolve();
                    }

                    return Promise.all(waitForPromises);
                },
                writable: true,
                configurable: true
            },
            dispatch: {

                /**
                 * Dispatches an action to all the registered callbacks/stores.
                 *
                 * If a second action is dispatched while there is a dispatch on, it will be
                 * enqueued an dispatched after the current one.
                 *
                 * @return { Promise } A promise to be resolved when all the callbacks have finised.
                 */
                value: function dispatch() {
                    var _this = this;
                    var dispatchArguments = Array.from(arguments);
                    var promise;

                    // If we are in the middle of a dispatch, enqueue the dispatch
                    if (this._currentDispatch) {
                        // Dispatch after the current one
                        promise = this._currentDispatch.then(function () {
                            return _this._dispatch.call(_this, dispatchArguments);
                        });

                        // Enqueue, set the chain as the current promise and return
                        this._dispatchQueue.push(promise);
                    } else {
                        promise = this._dispatch(dispatchArguments);
                    }

                    this._currentDispatch = promise;

                    return promise;
                },
                writable: true,
                configurable: true
            },
            _dispatch: {
                value: function _dispatch(dispatchArguments) {
                    var _this = this;
                    this._currentDispatchPromises.clear();

                    for (var _iterator = this._callbacks[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
                        var _step$value;
                        (function () {
                            _step$value = _slicedToArray(_step.value, 2);
                            var token = _step$value[0];
                            var callback = _step$value[1];
                            // A closure is needed for the callback and token variables
                            (function (token, callback) {
                                // All the promises must be set in this._currentDispatchPromises
                                // before trying to resolved in order to make waitFor work
                                var promise = Promise.resolve().then(function () {
                                    return _this._executeCallback(callback, dispatchArguments);
                                })["catch"](function (e) {
                                    throw new Error(e.stack || e);
                                });

                                _this._currentDispatchPromises.set(token, promise);
                            })(token, callback);
                        })();
                    }

                    var dequeue = function () {
                        _this._dispatchQueue.shift();
                        if (!_this._dispatchQueue.length) {
                            _this._currentDispatch = false;
                        }
                    };
                    var dispatchPromises = Array.from(this._currentDispatchPromises.values());
                    return Promise.all(dispatchPromises).then(dequeue, dequeue);
                },
                writable: true,
                configurable: true
            },
            _executeCallback: {
                value: function _executeCallback(callback, dispatchArguments) {
                    return callback.apply(this, dispatchArguments);
                },
                writable: true,
                configurable: true
            },
            isDispatching: {

                /**
                 * Is this dispatcher currently dispatching.
                 *
                 * @return {Boolean}
                 */
                value: function isDispatching() {
                    return !!this._dispatchQueue.length;
                },
                writable: true,
                configurable: true
            }
        });

        return Dispatcher;
    })();
    exports["default"] = Dispatcher;
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
});
//# sourceMappingURL=dispatcher.js.map