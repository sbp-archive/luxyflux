export class Actions {
    constructor(dispatcher, actions) {
        this.dispatcher = dispatcher;

        Object.assign(this, actions);
    }

    set dispatcher(dispatcher) {
        if (!dispatcher) {
            throw new Error('You have to specify a dispatcher when creating an Actions');
        }
        this._dispatcher = dispatcher;
    }

    get dispatcher() {
        return this._dispatcher;
    }

    /**
     * Dispatches an action to the dispatcher defined on this Actions
     *
     * @return { Promise } A promise to be resolved when all the callbacks have finised.
     */
    dispatch(actionType) {
        var args = Array.toArray(arguments).slice(1);
        return this.dispatcher.dispatch(actionType, ...args);
    }


    static createServiceAction(dispatcher, actionType, action) {
        return () => {
            args = Array.toArray(arguments);
            dispatcher.dispatch(actionType, ...args);
            return action(...args)
                .then((result) => {
                    dispatcher.dispatch(actionType + '_COMPLETED', result, args);
                })
                .catch((error) => {
                    dispatcher.dispatch(actionType + '_FAILED', error, args);
                });
        };
    }
}

export default Actions;
