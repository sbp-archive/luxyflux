System.register(["angular", "./luxyflux"], function (_export) {
    "use strict";

    var angular, ActionCreators, Dispatcher, Store, LuxyFlux, _toConsumableArray, _get, _prototypeProperties, _inherits, _classCallCheck, luxyfluxModule;
    return {
        setters: [function (_angular) {
            angular = _angular["default"];
        }, function (_luxyflux) {
            ActionCreators = _luxyflux.ActionCreators;
            Dispatcher = _luxyflux.Dispatcher;
            Store = _luxyflux.Store;
            LuxyFlux = _luxyflux.LuxyFlux;
        }],
        execute: function () {
            _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

            _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

            _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

            _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

            _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

            luxyfluxModule = _export("luxyfluxModule", angular.module("luxyflux", []));


            luxyfluxModule.service("LuxyFluxActionCreators", ["$q", function ($q) {
                return (function (ActionCreators) {
                    function AngularActionCreators() {
                        _classCallCheck(this, AngularActionCreators);

                        if (ActionCreators != null) {
                            ActionCreators.apply(this, arguments);
                        }
                    }

                    _inherits(AngularActionCreators, ActionCreators);

                    _prototypeProperties(AngularActionCreators, {
                        createServiceAction: {
                            value: function createServiceAction(dispatcher, actionType, action) {
                                return function () {
                                    var _this = this;
                                    var args = Array.from(arguments);
                                    dispatcher.dispatch.apply(dispatcher, ["" + actionType + "_STARTED"].concat(_toConsumableArray(args)));
                                    return $q(function (resolve, reject) {
                                        action.call.apply(action, [_this].concat(_toConsumableArray(args))).then(function (result) {
                                            if (result !== undefined) {
                                                args.unshift(result);
                                            }
                                            dispatcher.dispatch.apply(dispatcher, ["" + actionType + "_COMPLETED"].concat(_toConsumableArray(args)));
                                            resolve(result);
                                        }, function (error) {
                                            if (error !== undefined) {
                                                args.unshift(error);
                                            }
                                            dispatcher.dispatch.apply(dispatcher, ["" + actionType + "_FAILED"].concat(_toConsumableArray(args)));
                                            reject(error);
                                        });
                                    });
                                };
                            },
                            writable: true,
                            configurable: true
                        }
                    });

                    return AngularActionCreators;
                })(ActionCreators);
            }]);

            luxyfluxModule.service("LuxyFluxDispatcher", ["$rootScope", function ($rootScope) {
                return (function (Dispatcher) {
                    function AngularDispatcher() {
                        _classCallCheck(this, AngularDispatcher);

                        if (Dispatcher != null) {
                            Dispatcher.apply(this, arguments);
                        }
                    }

                    _inherits(AngularDispatcher, Dispatcher);

                    _prototypeProperties(AngularDispatcher, null, {
                        _executeCallback: {
                            value: function _executeCallback() {
                                var _this2 = this;
                                var _this = this;
                                var args = Array.from(arguments);
                                $rootScope.$apply(function () {
                                    var _get2;
                                    (_get2 = _get(Object.getPrototypeOf(AngularDispatcher.prototype), "_executeCallback", _this)).call.apply(_get2, [_this2].concat(_toConsumableArray(args)));
                                });
                            },
                            writable: true,
                            configurable: true
                        }
                    });

                    return AngularDispatcher;
                })(Dispatcher);
            }]);

            luxyfluxModule.service("LuxyFluxStore", function () {
                return (function (Store) {
                    function AngularStore() {
                        _classCallCheck(this, AngularStore);

                        if (Store != null) {
                            Store.apply(this, arguments);
                        }
                    }

                    _inherits(AngularStore, Store);

                    return AngularStore;
                })(Store);
            });

            luxyfluxModule.service("LuxyFlux", function () {
                return (function (LuxyFlux) {
                    function AngularLuxyFlux() {
                        _classCallCheck(this, AngularLuxyFlux);

                        if (LuxyFlux != null) {
                            LuxyFlux.apply(this, arguments);
                        }
                    }

                    _inherits(AngularLuxyFlux, LuxyFlux);

                    return AngularLuxyFlux;
                })(LuxyFlux);
            });

            _export("default", luxyfluxModule);
        }
    };
});
//# sourceMappingURL=ng-luxyflux.js.map