define(["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var marked0$0 = [_entries].map(regeneratorRuntime.mark);

    function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var _storeCounter = 1;

    var Store = (function () {
        _createClass(Store, null, [{
            key: "decorate",
            value: function decorate(owner, name, dispatcher, handlers) {
                var store = new Store(name, dispatcher, handlers, null, owner);
                Object.defineProperties(owner, {
                    _storeDecorator: {
                        configurable: false,
                        writable: false,
                        enumerable: false,
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
                        enumerable: false,
                        value: store.dispatch.bind(store)
                    },
                    waitFor: {
                        configurable: true,
                        writable: true,
                        enumerable: false,
                        value: store.waitFor.bind(store)
                    },
                    destroy: {
                        configurable: true,
                        writable: true,
                        enumerable: false,
                        value: store.destroy.bind(store)
                    }
                });

                if (owner.initialize instanceof Function) {
                    owner.initialize();
                }
            }
        }]);

        function Store(name) {
            var dispatcher = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
            var handlers = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
            var initializeFn = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
            var handlerContext = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

            _classCallCheck(this, Store);

            this.setName(name);
            this.setDispatcher(dispatcher);

            this.handlers = new Map();

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _entries(handlers)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = _slicedToArray(_step.value, 2);

                    var action = _step$value[0];
                    var handler = _step$value[1];

                    this.addActionHandler(action, handler);
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

            if (initializeFn) {
                this.initialize = initializeFn.bind(this);
                this.initialize();
            }

            this.handlerContext = handlerContext || this;
        }

        _createClass(Store, [{
            key: "setDispatcher",
            value: function setDispatcher(dispatcher) {
                if (this.dispatcher && this.dispatcher !== dispatcher) {
                    this.dispatcher.unregister(this.name);
                }
                if (dispatcher) {
                    dispatcher.register(this.name, this.callback.bind(this));
                }
                this.dispatcher = dispatcher;
            }
        }, {
            key: "getDispatcher",
            value: function getDispatcher() {
                return this.dispatcher;
            }

            /**
             * Dispatches an action to the dispatcher defined on this Actions
             *
             * @return { Promise } A promise to be resolved when all the callbacks have finised.
             */
        }, {
            key: "dispatch",
            value: function dispatch(actionType) {
                var _dispatcher;

                var args = Array.from(arguments);
                return (_dispatcher = this.dispatcher).dispatch.apply(_dispatcher, [actionType].concat(_toConsumableArray(args.slice(1))));
            }
        }, {
            key: "setName",
            value: function setName(name) {
                this.name = name;
            }
        }, {
            key: "getName",
            value: function getName() {
                if (!this.name) {
                    this.name = "luxaflux-store-name-" + _storeCounter++;
                }
                return this.name;
            }

            /**
             * Creates a promise and waits for the callbacks specified to complete before resolve it.
             *
             * @param  {String<Array>|String} tokens The store tokens to wait for.
             * @return {Promise} A promise to be resolved when the specified callbacks are completed.
             */
        }, {
            key: "waitFor",
            value: function waitFor(tokens) {
                return this.dispatcher.waitFor(tokens);
            }

            /**
             * This is the callback method that needs to be registered with the dispatcher
             */
        }, {
            key: "callback",
            value: function callback(action) {
                var handler = this.handlers.get(action);
                if (handler) {
                    handler.call.apply(handler, [this.handlerContext].concat(_toConsumableArray(Array.from(arguments).slice(1))));
                }
            }

            /**
             * Bind callback to specific action
             *
             * @param {Object} callback An object where each key is the name of an action
             * and the value is the callback to be called when that action is dispatched
             */
        }, {
            key: "addActionHandler",
            value: function addActionHandler(action, handler) {
                this.handlers.set(action, handler);
            }
        }, {
            key: "destroy",
            value: function destroy() {
                if (this.onDestroy instanceof Function) {
                    this.onDestroy();
                }
            }
        }]);

        return Store;
    })();

    exports.Store = Store;
    exports["default"] = Store;

    // using a generator function
    function _entries(obj) {
        var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, key;

        return regeneratorRuntime.wrap(function _entries$(context$1$0) {
            while (1) switch (context$1$0.prev = context$1$0.next) {
                case 0:
                    _iteratorNormalCompletion2 = true;
                    _didIteratorError2 = false;
                    _iteratorError2 = undefined;
                    context$1$0.prev = 3;
                    _iterator2 = Object.keys(obj)[Symbol.iterator]();

                case 5:
                    if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                        context$1$0.next = 12;
                        break;
                    }

                    key = _step2.value;
                    context$1$0.next = 9;
                    return [key, obj[key]];

                case 9:
                    _iteratorNormalCompletion2 = true;
                    context$1$0.next = 5;
                    break;

                case 12:
                    context$1$0.next = 18;
                    break;

                case 14:
                    context$1$0.prev = 14;
                    context$1$0.t0 = context$1$0["catch"](3);
                    _didIteratorError2 = true;
                    _iteratorError2 = context$1$0.t0;

                case 18:
                    context$1$0.prev = 18;
                    context$1$0.prev = 19;

                    if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                        _iterator2["return"]();
                    }

                case 21:
                    context$1$0.prev = 21;

                    if (!_didIteratorError2) {
                        context$1$0.next = 24;
                        break;
                    }

                    throw _iteratorError2;

                case 24:
                    return context$1$0.finish(21);

                case 25:
                    return context$1$0.finish(18);

                case 26:
                case "end":
                    return context$1$0.stop();
            }
        }, marked0$0[0], this, [[3, 14, 18, 26], [19,, 21, 25]]);
    }
});
//# sourceMappingURL=store.js.map
