export class ActionCreators {
    static decorate(owner, dispatcher) {
        var actionCreators = new ActionCreators(dispatcher);
        Object.defineProperties(owner, {
            _actionCreatorsDecorator: {
                configurable: false,
                writable: false,
                enumerable: false,
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

    constructor(dispatcher, actions) {
        if (dispatcher) {
            this.setDispatcher(dispatcher);
        }
        if (actions) {
            Object.assign(this, actions);
        }
    }

    setDispatcher(dispatcher) {
        this.dispatcher = dispatcher;
    }

    getDispatcher() {
        return this.dispatcher;
    }

    /**
     * Dispatches an action to the dispatcher defined on this Actions
     *
     * @return { Promise } A promise to be resolved when all the callbacks have finised.
     */
    dispatch(actionType) {
        var args = Array.from(arguments);
        return this.dispatcher.dispatch(actionType, ...args.slice(1));
    }

    static createServiceAction(dispatcher, actionType, action) {
        return function() {
            var args = Array.from(arguments);
            dispatcher.dispatch(`${actionType}_STARTED`, ...args);

            return new Promise((resolve, reject) => {
                action.call(this, ...args).then(
                    (result) => {
                        if (result) {
                            args.unshift(result);
                        }
                        dispatcher.dispatch(`${actionType}_COMPLETED`, ...args).then(() => {
                            resolve(result);
                        });
                    },
                    (error) => {
                        if (error) {
                            args.unshift(error);
                        }
                        dispatcher.dispatch(`${actionType}_FAILED`, ...args).then(() => {
                            reject(error);
                        });
                    }
                );
            });
        };
    }
}

export default ActionCreators;
