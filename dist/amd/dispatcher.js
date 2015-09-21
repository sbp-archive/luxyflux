define(["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var _current;
    var _tokenCounter = 1;
    var _idCounter = 1;

    var Dispatcher = (function () {
        _createClass(Dispatcher, null, [{
            key: "current",
            get: function get() {
                if (!_current) {
                    _current = new Dispatcher();
                }
                return _current;
            },
            set: function set(current) {
                this._current = current;
            }
        }]);

        function Dispatcher(id) {
            _classCallCheck(this, Dispatcher);

            this.id = id || "dispatcher-" + _idCounter++;

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

        _createClass(Dispatcher, [{
            key: "register",
            value: function register(token, callback) {
                if (token instanceof Function) {
                    callback = token;
                    token = "luxyflux-callback-token-" + _tokenCounter++;
                }

                this._callbacks.set(token, callback);

                return token;
            }

            /**
             * Unregister a callback from this dispatcher
             *
             * @param  {String} token The callback token to be unregistered from this dispatcher
             */
        }, {
            key: "unregister",
            value: function unregister(token) {
                return this._callbacks["delete"](token);
            }

            /**
             * Creates a promise and waits for the callbacks specified to complete before resolve it.
             *
             * @param  {String<Array>|String} tokens The callback tokens to wait for.
             * @return {Promise} A promise to be resolved when the specified callbacks are completed.
             */
        }, {
            key: "waitFor",
            value: function waitFor(tokens) {
                if (!Array.isArray(tokens)) {
                    tokens = [tokens];
                }

                var waitForPromises = [];

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = tokens[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var token = _step.value;

                        if (this._currentDispatchPromises.has(token)) {
                            waitForPromises.push(this._currentDispatchPromises.get(token));
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator["return"]) {
                            _iterator["return"]();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
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
        }, {
            key: "dispatch",
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
            }
        }, {
            key: "_dispatch",
            value: function _dispatch(dispatchArguments) {
                var _this2 = this;

                this._currentDispatchPromises.clear();

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this._callbacks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _step2$value = _slicedToArray(_step2.value, 2);

                        var token = _step2$value[0];
                        var callback = _step2$value[1];

                        // A closure is needed for the callback and token variables
                        (function (token, callback) {
                            // All the promises must be set in this._currentDispatchPromises
                            // before trying to resolved in order to make waitFor work
                            var promise = Promise.resolve().then(function () {
                                return _this2._executeCallback(callback, dispatchArguments);
                            })["catch"](function (e) {
                                throw new Error(e.stack || e);
                            });

                            _this2._currentDispatchPromises.set(token, promise);
                        })(token, callback);
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                            _iterator2["return"]();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                var dequeue = function dequeue() {
                    _this2._dispatchQueue.shift();
                    if (!_this2._dispatchQueue.length) {
                        _this2._currentDispatch = false;
                    }
                };
                var dispatchPromises = Array.from(this._currentDispatchPromises.values());
                return Promise.all(dispatchPromises).then(dequeue, dequeue);
            }
        }, {
            key: "_executeCallback",
            value: function _executeCallback(callback, dispatchArguments) {
                return callback.apply(this, dispatchArguments);
            }

            /**
             * Is this dispatcher currently dispatching.
             *
             * @return {Boolean}
             */
        }, {
            key: "isDispatching",
            value: function isDispatching() {
                return !!this._dispatchQueue.length;
            }
        }]);

        return Dispatcher;
    })();

    exports.Dispatcher = Dispatcher;
    exports["default"] = Dispatcher;
});
//# sourceMappingURL=dispatcher.js.map
