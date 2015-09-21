define(['exports', 'angular', './luxyflux'], function (exports, _angular, _luxyflux) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

    function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

    var _angular2 = _interopRequireDefault(_angular);

    var luxyfluxModule = _angular2['default'].module('luxyflux', []);

    exports.luxyfluxModule = luxyfluxModule;
    luxyfluxModule.service('LuxyFluxActionCreators', ['$q', function ($q) {
        return (function (_ActionCreators) {
            _inherits(AngularActionCreators, _ActionCreators);

            function AngularActionCreators() {
                _classCallCheck(this, AngularActionCreators);

                _get(Object.getPrototypeOf(AngularActionCreators.prototype), 'constructor', this).apply(this, arguments);
            }

            _createClass(AngularActionCreators, null, [{
                key: 'createServiceAction',
                value: function createServiceAction(dispatcher, actionType, action) {
                    return function () {
                        var _this = this;

                        var args = Array.from(arguments);
                        dispatcher.dispatch.apply(dispatcher, [actionType + '_STARTED'].concat(_toConsumableArray(args)));
                        return $q(function (resolve, reject) {
                            action.call.apply(action, [_this].concat(_toConsumableArray(args))).then(function (result) {
                                if (result !== undefined) {
                                    args.unshift(result);
                                }
                                dispatcher.dispatch.apply(dispatcher, [actionType + '_COMPLETED'].concat(_toConsumableArray(args))).then(function () {
                                    resolve(result);
                                });
                            }, function (error) {
                                if (error !== undefined) {
                                    args.unshift(error);
                                }
                                dispatcher.dispatch.apply(dispatcher, [actionType + '_FAILED'].concat(_toConsumableArray(args))).then(function () {
                                    reject(error);
                                });
                            });
                        });
                    };
                }
            }]);

            return AngularActionCreators;
        })(_luxyflux.ActionCreators);
    }]);

    luxyfluxModule.service('LuxyFluxDispatcher', ['$rootScope', function ($rootScope) {
        return (function (_Dispatcher) {
            _inherits(AngularDispatcher, _Dispatcher);

            function AngularDispatcher() {
                _classCallCheck(this, AngularDispatcher);

                _get(Object.getPrototypeOf(AngularDispatcher.prototype), 'constructor', this).apply(this, arguments);
            }

            _createClass(AngularDispatcher, [{
                key: '_executeCallback',
                value: function _executeCallback() {
                    var _this2 = this;

                    var args = Array.from(arguments);
                    $rootScope.$apply(function () {
                        var _get2;

                        (_get2 = _get(Object.getPrototypeOf(AngularDispatcher.prototype), '_executeCallback', _this2)).call.apply(_get2, [_this2].concat(_toConsumableArray(args)));
                    });
                }
            }]);

            return AngularDispatcher;
        })(_luxyflux.Dispatcher);
    }]);

    luxyfluxModule.service('LuxyFluxStore', function () {
        return (function (_Store) {
            _inherits(AngularStore, _Store);

            function AngularStore() {
                _classCallCheck(this, AngularStore);

                _get(Object.getPrototypeOf(AngularStore.prototype), 'constructor', this).apply(this, arguments);
            }

            return AngularStore;
        })(_luxyflux.Store);
    });

    luxyfluxModule.service('LuxyFlux', function () {
        return (function (_LuxyFlux) {
            _inherits(AngularLuxyFlux, _LuxyFlux);

            function AngularLuxyFlux() {
                _classCallCheck(this, AngularLuxyFlux);

                _get(Object.getPrototypeOf(AngularLuxyFlux.prototype), 'constructor', this).apply(this, arguments);
            }

            return AngularLuxyFlux;
        })(_luxyflux.LuxyFlux);
    });

    exports['default'] = luxyfluxModule;
});
//# sourceMappingURL=ng-luxyflux.js.map
