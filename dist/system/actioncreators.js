System.register([], function (_export) {
    "use strict";

    var _toConsumableArray, _prototypeProperties, _classCallCheck, ActionCreators;
    return {
        setters: [],
        execute: function () {
            _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

            _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

            _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

            ActionCreators = _export("ActionCreators", (function () {
                function ActionCreators(dispatcher, actions) {
                    _classCallCheck(this, ActionCreators);

                    if (dispatcher) {
                        this.setDispatcher(dispatcher);
                    }
                    if (actions) {
                        Object.assign(this, actions);
                    }
                }

                _prototypeProperties(ActionCreators, {
                    decorate: {
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
                        },
                        writable: true,
                        configurable: true
                    },
                    createServiceAction: {
                        value: function createServiceAction(dispatcher, actionType, action) {
                            return function () {
                                var args = Array.from(arguments);
                                dispatcher.dispatch.apply(dispatcher, ["" + actionType + "_STARTED"].concat(_toConsumableArray(args)));
                                return action.call.apply(action, [this].concat(_toConsumableArray(args))).then(function (result) {
                                    dispatcher.dispatch.apply(dispatcher, ["" + actionType + "_COMPLETED", result].concat(_toConsumableArray(args)));
                                }, function (error) {
                                    dispatcher.dispatch.apply(dispatcher, ["" + actionType + "_FAILED", error].concat(_toConsumableArray(args)));
                                });
                            };
                        },
                        writable: true,
                        configurable: true
                    }
                }, {
                    setDispatcher: {
                        value: function setDispatcher(dispatcher) {
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
                    }
                });

                return ActionCreators;
            })());
            _export("default", ActionCreators);
        }
    };
});
//# sourceMappingURL=actioncreators.js.map