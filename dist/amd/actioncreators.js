define(["exports"], function (exports) {
    "use strict";

    var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var ActionCreators = (function () {
        function ActionCreators(dispatcher, actions) {
            _classCallCheck(this, ActionCreators);

            if (dispatcher) {
                this.setDispatcher(dispatcher);
            }
            if (actions) {
                Object.assign(this, actions);
            }
        }

        _createClass(ActionCreators, [{
            key: "setDispatcher",
            value: function setDispatcher(dispatcher) {
                this.dispatcher = dispatcher;
            }
        }, {
            key: "getDispatcher",
            value: function getDispatcher() {
                return this.dispatcher;
            }
        }, {
            key: "dispatch",

            /**
             * Dispatches an action to the dispatcher defined on this Actions
             *
             * @return { Promise } A promise to be resolved when all the callbacks have finised.
             */
            value: function dispatch(actionType) {
                var _dispatcher;

                var args = Array.from(arguments);
                return (_dispatcher = this.dispatcher).dispatch.apply(_dispatcher, [actionType].concat(_toConsumableArray(args.slice(1))));
            }
        }], [{
            key: "decorate",
            value: function decorate(owner, dispatcher) {
                var actionCreators = new ActionCreators(dispatcher);
                Object.defineProperties(owner, {
                    _actionCreatorsDecorator: {
                        configurable: false,
                        writable: false,
                        enumberable: false,
                        value: actionCreators
                    },
                    dispatcher: {
                        get: actionCreators.getDispatcher.bind(actionCreators),
                        set: actionCreators.setDispatcher.bind(actionCreators)
                    },
                    dispatch: {
                        configurable: false,
                        writable: false,
                        enumerable: false,
                        value: actionCreators.dispatch.bind(actionCreators)
                    }
                });
            }
        }, {
            key: "createServiceAction",
            value: function createServiceAction(dispatcher, actionType, action) {
                return function () {
                    var _this = this;

                    var args = Array.from(arguments);
                    dispatcher.dispatch.apply(dispatcher, ["" + actionType + "_STARTED"].concat(_toConsumableArray(args)));

                    return new Promise(function (resolve, reject) {
                        action.call.apply(action, [_this].concat(_toConsumableArray(args))).then(function (result) {
                            if (result) {
                                args.unshift(result);
                            }
                            dispatcher.dispatch.apply(dispatcher, ["" + actionType + "_COMPLETED"].concat(_toConsumableArray(args))).then(function () {
                                resolve(result);
                            });
                        }, function (error) {
                            if (error) {
                                args.unshift(error);
                            }
                            dispatcher.dispatch.apply(dispatcher, ["" + actionType + "_FAILED"].concat(_toConsumableArray(args))).then(function () {
                                reject(error);
                            });
                        });
                    });
                };
            }
        }]);

        return ActionCreators;
    })();

    exports.ActionCreators = ActionCreators;
    exports["default"] = ActionCreators;
});
//# sourceMappingURL=actioncreators.js.map