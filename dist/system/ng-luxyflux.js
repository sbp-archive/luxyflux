var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

System.register(['angular', './luxyflux'], function (_export) {
    var angular, ActionCreators, Dispatcher, Store, LuxyFlux, _toConsumableArray, _get, _classCallCheck, _createClass, _inherits, luxyfluxModule;

    return {
        setters: [function (_angular) {
            angular = _angular['default'];
        }, function (_luxyflux) {
            ActionCreators = _luxyflux.ActionCreators;
            Dispatcher = _luxyflux.Dispatcher;
            Store = _luxyflux.Store;
            LuxyFlux = _luxyflux.LuxyFlux;
        }],
        execute: function () {
            'use strict';

            _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

            _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

            _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

            _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

            _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) _defaults(subClass, superClass); };

            luxyfluxModule = angular.module('luxyflux', []);

            _export('luxyfluxModule', luxyfluxModule);

            luxyfluxModule.service('LuxyFluxActionCreators', ['$q', function ($q) {
                return (function (_ActionCreators) {
                    function AngularActionCreators() {
                        _classCallCheck(this, AngularActionCreators);

                        if (_ActionCreators != null) {
                            _ActionCreators.apply(this, arguments);
                        }
                    }

                    _inherits(AngularActionCreators, _ActionCreators);

                    _createClass(AngularActionCreators, null, [{
                        key: 'createServiceAction',
                        value: function createServiceAction(dispatcher, actionType, action) {
                            return function () {
                                var _this2 = this;

                                var args = Array.from(arguments);
                                dispatcher.dispatch.apply(dispatcher, ['' + actionType + '_STARTED'].concat(_toConsumableArray(args)));
                                return $q(function (resolve, reject) {
                                    action.call.apply(action, [_this2].concat(_toConsumableArray(args))).then(function (result) {
                                        if (result !== undefined) {
                                            args.unshift(result);
                                        }
                                        dispatcher.dispatch.apply(dispatcher, ['' + actionType + '_COMPLETED'].concat(_toConsumableArray(args)));
                                        resolve(result);
                                    }, function (error) {
                                        if (error !== undefined) {
                                            args.unshift(error);
                                        }
                                        dispatcher.dispatch.apply(dispatcher, ['' + actionType + '_FAILED'].concat(_toConsumableArray(args)));
                                        reject(error);
                                    });
                                });
                            };
                        }
                    }]);

                    return AngularActionCreators;
                })(ActionCreators);
            }]);

            luxyfluxModule.service('LuxyFluxDispatcher', ['$rootScope', function ($rootScope) {
                return (function (_Dispatcher) {
                    function AngularDispatcher() {
                        _classCallCheck(this, AngularDispatcher);

                        if (_Dispatcher != null) {
                            _Dispatcher.apply(this, arguments);
                        }
                    }

                    _inherits(AngularDispatcher, _Dispatcher);

                    _createClass(AngularDispatcher, [{
                        key: '_executeCallback',
                        value: function _executeCallback() {
                            var _this3 = this;

                            var _this = this;

                            var args = Array.from(arguments);
                            $rootScope.$apply(function () {
                                var _get2;

                                (_get2 = _get(Object.getPrototypeOf(AngularDispatcher.prototype), '_executeCallback', _this)).call.apply(_get2, [_this3].concat(_toConsumableArray(args)));
                            });
                        }
                    }]);

                    return AngularDispatcher;
                })(Dispatcher);
            }]);

            luxyfluxModule.service('LuxyFluxStore', function () {
                return (function (_Store) {
                    function AngularStore() {
                        _classCallCheck(this, AngularStore);

                        if (_Store != null) {
                            _Store.apply(this, arguments);
                        }
                    }

                    _inherits(AngularStore, _Store);

                    return AngularStore;
                })(Store);
            });

            luxyfluxModule.service('LuxyFlux', function () {
                return (function (_LuxyFlux) {
                    function AngularLuxyFlux() {
                        _classCallCheck(this, AngularLuxyFlux);

                        if (_LuxyFlux != null) {
                            _LuxyFlux.apply(this, arguments);
                        }
                    }

                    _inherits(AngularLuxyFlux, _LuxyFlux);

                    return AngularLuxyFlux;
                })(LuxyFlux);
            });

            _export('default', luxyfluxModule);
        }
    };
});
//# sourceMappingURL=ng-luxyflux.js.map