define(["exports"], function (exports) {
    "use strict";

    var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

    var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

    var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var _entries = regeneratorRuntime.mark(

    // using a generator function
    function _entries(obj) {
        var _iterator, _step, key;
        return regeneratorRuntime.wrap(function _entries$(context$1$0) {
            while (1) switch (context$1$0.prev = context$1$0.next) {
                case 0:
                    _iterator = Object.keys(obj)[Symbol.iterator]();
                case 1:
                    if ((_step = _iterator.next()).done) {
                        context$1$0.next = 7;
                        break;
                    }
                    key = _step.value;
                    context$1$0.next = 5;
                    return [key, obj[key]];
                case 5:
                    context$1$0.next = 1;
                    break;
                case 7:
                case "end":
                    return context$1$0.stop();
            }
        }, _entries, this);
    });

    var _storeCounter = 1;

    var Store = exports.Store = (function () {
        function Store(name, dispatcher) {
            var handlers = arguments[2] === undefined ? {} : arguments[2];
            var initializeFn = arguments[3] === undefined ? null : arguments[3];
            var handlerContext = arguments[4] === undefined ? null : arguments[4];
            _classCallCheck(this, Store);

            this.setName(name);
            this.setDispatcher(dispatcher);

            this.handlers = new Map();

            for (var _iterator = _entries(handlers)[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
                var _step$value = _slicedToArray(_step.value, 2);

                var action = _step$value[0];
                var handler = _step$value[1];
                this.addActionHandler(action, handler);
            }

            if (initializeFn) {
                this.initialize = initializeFn.bind(this);
                this.initialize();
            }

            this.handlerContext = handlerContext || this;
        }

        _prototypeProperties(Store, {
            decorate: {
                value: function decorate(owner, name, dispatcher, handlers) {
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
                },
                writable: true,
                configurable: true
            }
        }, {
            setDispatcher: {
                value: function setDispatcher(dispatcher) {
                    if (this.dispatcher && this.dispatcher !== dispatcher) {
                        this.dispatcher.unregister(this.name);
                    }
                    dispatcher.register(this.name, this.callback.bind(this));
                    this.dispatcher = dispatcher;
                },
                writable: true,
                configurable: true
            },
            getDispatcher: {
                value: function getDispatcher() {
                    return this.dispatcher;
                },
                writable: true,
                configurable: true
            },
            dispatch: {

                /**
                 * Dispatches an action to the dispatcher defined on this Actions
                 *
                 * @return { Promise } A promise to be resolved when all the callbacks have finised.
                 */
                value: function dispatch(actionType) {
                    var _dispatcher;
                    var args = Array.from(arguments);
                    return (_dispatcher = this.dispatcher).dispatch.apply(_dispatcher, [actionType].concat(_toConsumableArray(args.slice(1))));
                },
                writable: true,
                configurable: true
            },
            setName: {
                value: function setName(name) {
                    this.name = name;
                },
                writable: true,
                configurable: true
            },
            getName: {
                value: function getName() {
                    if (!this.name) {
                        this.name = "luxaflux-store-name-" + _storeCounter++;
                    }
                    return this.name;
                },
                writable: true,
                configurable: true
            },
            waitFor: {

                /**
                 * Creates a promise and waits for the callbacks specified to complete before resolve it.
                 *
                 * @param  {String<Array>|String} tokens The store tokens to wait for.
                 * @return {Promise} A promise to be resolved when the specified callbacks are completed.
                 */
                value: function waitFor(tokens) {
                    return this.dispatcher.waitFor(tokens);
                },
                writable: true,
                configurable: true
            },
            callback: {

                /**
                 * This is the callback method that needs to be registered with the dispatcher
                 */
                value: function callback(action) {
                    var handler = this.handlers.get(action);
                    if (handler) {
                        handler.call.apply(handler, [this.handlerContext].concat(_toConsumableArray(Array.from(arguments).slice(1))));
                    }
                },
                writable: true,
                configurable: true
            },
            addActionHandler: {

                /**
                 * Bind callback to specific action
                 *
                 * @param {Object} callback An object where each key is the name of an action
                 * and the value is the callback to be called when that action is dispatched
                 */
                value: function addActionHandler(action, handler) {
                    this.handlers.set(action, handler);
                },
                writable: true,
                configurable: true
            }
        });

        return Store;
    })();
    exports["default"] = Store;
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
});
//# sourceMappingURL=store.js.map