System.register(['./dispatcher', './actioncreators', './store'], function (_export) {
    'use strict';

    var Dispatcher, ActionCreators, Store, marked0$0, defaultStoreConfig, defaultActionCreatorsConfig, LuxyFlux;

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    // using a generator function
    function _entries(obj) {
        var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, key;

        return regeneratorRuntime.wrap(function _entries$(context$1$0) {
            while (1) switch (context$1$0.prev = context$1$0.next) {
                case 0:
                    _iteratorNormalCompletion3 = true;
                    _didIteratorError3 = false;
                    _iteratorError3 = undefined;
                    context$1$0.prev = 3;
                    _iterator3 = Object.keys(obj)[Symbol.iterator]();

                case 5:
                    if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                        context$1$0.next = 12;
                        break;
                    }

                    key = _step3.value;
                    context$1$0.next = 9;
                    return [key, obj[key]];

                case 9:
                    _iteratorNormalCompletion3 = true;
                    context$1$0.next = 5;
                    break;

                case 12:
                    context$1$0.next = 18;
                    break;

                case 14:
                    context$1$0.prev = 14;
                    context$1$0.t0 = context$1$0['catch'](3);
                    _didIteratorError3 = true;
                    _iteratorError3 = context$1$0.t0;

                case 18:
                    context$1$0.prev = 18;
                    context$1$0.prev = 19;

                    if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                        _iterator3['return']();
                    }

                case 21:
                    context$1$0.prev = 21;

                    if (!_didIteratorError3) {
                        context$1$0.next = 24;
                        break;
                    }

                    throw _iteratorError3;

                case 24:
                    return context$1$0.finish(21);

                case 25:
                    return context$1$0.finish(18);

                case 26:
                case 'end':
                    return context$1$0.stop();
            }
        }, marked0$0[0], this, [[3, 14, 18, 26], [19,, 21, 25]]);
    }
    return {
        setters: [function (_dispatcher) {
            Dispatcher = _dispatcher['default'];
        }, function (_actioncreators) {
            ActionCreators = _actioncreators['default'];
        }, function (_store) {
            Store = _store['default'];
        }],
        execute: function () {
            marked0$0 = [_entries].map(regeneratorRuntime.mark);

            _export('Dispatcher', Dispatcher);

            _export('ActionCreators', ActionCreators);

            _export('Store', Store);

            defaultStoreConfig = {
                dispatcher: Dispatcher.current,
                name: null,
                handlers: {},
                initialize: function initialize() {},
                decorate: null
            };

            _export('defaultStoreConfig', defaultStoreConfig);

            defaultActionCreatorsConfig = {
                dispatcher: Dispatcher.current,
                serviceActions: {},
                decorate: null
            };

            _export('defaultActionCreatorsConfig', defaultActionCreatorsConfig);

            LuxyFlux = (function () {
                function LuxyFlux() {
                    _classCallCheck(this, LuxyFlux);
                }

                _createClass(LuxyFlux, null, [{
                    key: 'createStore',
                    value: function createStore(config) {
                        var StoreCls = arguments.length <= 1 || arguments[1] === undefined ? Store : arguments[1];

                        config = Object.assign({}, defaultStoreConfig, config);

                        var _config = config;
                        var name = _config.name;
                        var dispatcher = _config.dispatcher;
                        var handlers = _config.handlers;
                        var initialize = _config.initialize;
                        var decorate = _config.decorate;

                        delete config.name;
                        delete config.dispatcher;
                        delete config.handlers;
                        delete config.initialize;
                        delete config.decorate;

                        var source = decorate || config;
                        if (decorate) {
                            handlers = Object.assign({}, handlers, decorate.handlers || {});
                        }

                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = _entries(handlers)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var _step$value = _slicedToArray(_step.value, 2);

                                var actionType = _step$value[0];
                                var handlerName = _step$value[1];

                                var handler = source[handlerName];
                                if (handler instanceof Function) {
                                    handlers[actionType] = source[handlerName];
                                }
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator['return']) {
                                    _iterator['return']();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        if (decorate) {
                            StoreCls.decorate(decorate, name, dispatcher, handlers);
                            return decorate;
                        } else {
                            return new StoreCls(name, dispatcher, handlers, initialize);
                        }
                    }
                }, {
                    key: 'createActions',
                    value: function createActions(config) {
                        var ActionCreatorsCls = arguments.length <= 1 || arguments[1] === undefined ? ActionCreators : arguments[1];

                        config = Object.assign({}, defaultActionCreatorsConfig, config);

                        var _config2 = config;
                        var dispatcher = _config2.dispatcher;
                        var serviceActions = _config2.serviceActions;
                        var decorate = _config2.decorate;

                        delete config.dispatcher;
                        delete config.serviceActions;
                        delete config.decorate;

                        var source = decorate || config;
                        if (decorate) {
                            serviceActions = Object.assign({}, serviceActions, decorate.serviceActions || {});
                        }

                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = _entries(serviceActions)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var _step2$value = _slicedToArray(_step2.value, 2);

                                var actionType = _step2$value[0];
                                var actionName = _step2$value[1];

                                var action = source[actionName];
                                if (action instanceof Function) {
                                    var serviceAction = ActionCreatorsCls.createServiceAction(dispatcher, actionType, action);

                                    Object.defineProperty(source, actionName, {
                                        writable: false,
                                        enumerable: false,
                                        value: serviceAction
                                    });
                                }
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                                    _iterator2['return']();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }

                        if (decorate) {
                            ActionCreatorsCls.decorate(decorate, dispatcher);
                            return decorate;
                        } else {
                            return new ActionCreatorsCls(dispatcher, source);
                        }
                    }
                }]);

                return LuxyFlux;
            })();

            _export('LuxyFlux', LuxyFlux);

            _export('default', LuxyFlux);
        }
    };
});
//# sourceMappingURL=luxyflux.js.map
