define(["exports", "angular", "./LuxaFlux"], function (exports, _angular, _LuxaFlux) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

    var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

    var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

    var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var angular = _interopRequire(_angular);

    var ActionCreators = _LuxaFlux.ActionCreators;
    var Dispatcher = _LuxaFlux.Dispatcher;
    var Store = _LuxaFlux.Store;
    var LuxaFlux = _LuxaFlux.LuxaFlux;
    var AngularDispatcher = (function (Dispatcher) {
        function AngularDispatcher(name, rootScope) {
            _classCallCheck(this, AngularDispatcher);

            _get(Object.getPrototypeOf(AngularDispatcher.prototype), "constructor", this).call(this, name);
            this._rootScope = rootScope;
        }

        _inherits(AngularDispatcher, Dispatcher);

        _prototypeProperties(AngularDispatcher, null, {
            _executeCallback: {
                value: function _executeCallback() {
                    var _this2 = this;
                    var _this = this;
                    var args = Array.from(arguments);
                    this._rootScope.$apply(function () {
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

    var luxafluxModule = exports.luxafluxModule = angular.module("connect-luxaflux", []).service("LuxaFluxActionCreators", function () {
        return ActionCreators;
    }).service("LuxaFluxDispatcher", function () {
        return AngularDispatcher;
    }).service("LuxaFluxStore", function () {
        return Store;
    }).service("LuxaFlux", function () {
        return LuxaFlux;
    });

    exports["default"] = luxafluxModule;
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
});
//# sourceMappingURL=ng-luxaflux.js.map