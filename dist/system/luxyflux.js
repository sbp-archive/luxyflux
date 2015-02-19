System.register(["./Dispatcher", "./ActionCreators", "./Store"], function (_export) {
    "use strict";

    var Dispatcher, ActionCreators, Store, _slicedToArray, _prototypeProperties, _classCallCheck, defaultStoreConfig, defaultActionCreatorsConfig, LuxyFlux;
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

    return {
        setters: [function (_Dispatcher) {
            Dispatcher = _Dispatcher["default"];
        }, function (_ActionCreators) {
            ActionCreators = _ActionCreators["default"];
        }, function (_Store) {
            Store = _Store["default"];
        }],
        execute: function () {
            _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

            _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

            _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

            _export("Dispatcher", Dispatcher);

            _export("ActionCreators", ActionCreators);

            _export("Store", Store);

            defaultStoreConfig = _export("defaultStoreConfig", {
                dispatcher: Dispatcher.current,
                name: null,
                handlers: {},
                initialize: function () {},
                decorate: null
            });
            defaultActionCreatorsConfig = _export("defaultActionCreatorsConfig", {
                dispatcher: Dispatcher.current,
                serviceActions: {},
                decorate: null
            });
            LuxyFlux = _export("LuxyFlux", (function () {
                function LuxyFlux() {
                    _classCallCheck(this, LuxyFlux);
                }

                _prototypeProperties(LuxyFlux, {
                    createStore: {
                        value: function createStore(config) {
                            config = Object.assign({}, defaultStoreConfig, config);

                            var name = config.name;
                            var dispatcher = config.dispatcher;
                            var handlers = config.handlers;
                            var initialize = config.initialize;
                            var decorate = config.decorate;
                            delete config.name;
                            delete config.dispatcher;
                            delete config.handlers;
                            delete config.initialize;
                            delete config.decorate;

                            var source = decorate || config;
                            if (decorate) {
                                handlers = Object.assign({}, handlers, decorate.handlers || {});
                            }

                            for (var _iterator = _entries(handlers)[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
                                var _step$value = _slicedToArray(_step.value, 2);

                                var actionType = _step$value[0];
                                var handlerName = _step$value[1];
                                var handler = source[handlerName];
                                if (handler instanceof Function) {
                                    handlers[actionType] = source[handlerName];
                                }
                            }

                            if (decorate) {
                                Store.decorate(decorate, name, dispatcher, handlers);
                                return decorate;
                            } else {
                                return new Store(name, dispatcher, handlers, initialize);
                            }
                        },
                        writable: true,
                        configurable: true
                    },
                    createActions: {
                        value: function createActions(config) {
                            config = Object.assign({}, defaultActionCreatorsConfig, config);

                            var dispatcher = config.dispatcher;
                            var serviceActions = config.serviceActions;
                            var decorate = config.decorate;
                            delete config.dispatcher;
                            delete config.serviceActions;
                            delete config.decorate;

                            var source = decorate || config;
                            if (decorate) {
                                serviceActions = Object.assign({}, serviceActions, decorate.serviceActions || {});
                            }

                            for (var _iterator = _entries(serviceActions)[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
                                var _step$value = _slicedToArray(_step.value, 2);

                                var actionType = _step$value[0];
                                var actionName = _step$value[1];
                                var action = source[actionName];
                                if (action instanceof Function) {
                                    var serviceAction = ActionCreators.createServiceAction(dispatcher, actionType, action);

                                    Object.defineProperty(source, actionName, {
                                        writable: false,
                                        enumerable: false,
                                        value: serviceAction
                                    });
                                }
                            }

                            if (decorate) {
                                ActionCreators.decorate(decorate, dispatcher);
                                return decorate;
                            } else {
                                return new ActionCreators(dispatcher, source);
                            }
                        },
                        writable: true,
                        configurable: true
                    },
                    dispatchAction: {
                        value: function dispatchAction(action, payload) {
                            return Dispatcher.current.dispatch(action, payload);
                        },
                        writable: true,
                        configurable: true
                    }
                });

                return LuxyFlux;
            })());
            _export("default", LuxyFlux);
        }
    };
});
//# sourceMappingURL=luxyflux.js.map