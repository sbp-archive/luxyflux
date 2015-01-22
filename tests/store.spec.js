describe('FluxStore', function () {
    'use strict';

    var FluxStore, FluxActionCreators, FluxActionPayload;

    var dispatchToken = 'foo';
    var initialState = {};

    var store, dispatcher, listener, removeChangeListener;
    var actualAction, expectedChangeListenerScope, actualChangeListenerScope;

    function noop() {}

    beforeEach(module('connect-flux'));

    beforeEach(inject(function (_FluxStore_, _FluxActionCreators_, _FluxActionPayload_) {
        FluxStore = _FluxStore_;
        FluxActionCreators = _FluxActionCreators_;
        FluxActionPayload = _FluxActionPayload_;

        dispatcher = {
            register: function() {
                return dispatchToken;
            }
        };
        spyOn(dispatcher, 'register');

        var storeConfig = {
            dispatcher: dispatcher,
            handlers: {
                one: 'one-action',
                multiple: ['multi-1-action', 'multi-2-action'],
                where: { source: 'VIEW' },
                whereAndAction: [{source: 'VIEW'}, 'where-and-action']
            },

            one: function() {
                actualAction = this.action;
            },
            where: jasmine.createSpy(),
            multiple: jasmine.createSpy(),
            initialize: jasmine.createSpy(),
            whereAndAction: jasmine.createSpy(),

            getInitialState: function() {
                return initialState;
            }
        };
        spyOn(storeConfig, 'one');
        spyOn(storeConfig, 'getInitialState');

        // The injector unwraps the underscores (_) from around the parameter names when matching
        store = new FluxStore(storeConfig);

        expectedChangeListenerScope = {};

        var o = {
            listener: function() {
                actualChangeListenerScope = this;
            }
        };
        spyOn(o, 'listener');
        listener = o.listener;

        removeChangeListener = store.addChangeListener(listener, expectedChangeListenerScope);
    }));

    it('should have a dispatch token', function () {
        expect(store.dispatchToken).toEqual(dispatchToken);
    });

    it('should have registered the store\'s handleAction with the dispatcher', function () {
        expect(dispatcher.register).toHaveBeenCalled();
    });

    describe('when you don\'t pass in getInitialState', function() {
        it('should throw an error', function() {
            var storeWithoutGetInitialState = function () {
                return new FluxStore({
                    foo: function() {
                        return 'bar';
                    }
                });
            };

            expect(storeWithoutGetInitialState).toThrow();
        });
    });

    describe('#getInitialState()', function() {
        it('should be called once', function() {
            expect(store.getInitialState.calls.count()).toEqual(1);
        });

        it('should set the stores state to the initial state', function() {
            expect(store.state).toEqual(initialState);
        });
    });

    describe('#state', function() {
        var newState;
        beforeEach(function() {
            newState = {};
            store.state = newState;
        });

        it('should update the state', function() {
            expect(store.state).toEqual(newState);
        });

        it('should call the change listener with the new state', function() {
            expect(listener).toHaveBeenCalledWith(newState);
        });
    });

    describe('#setState()', function() {
        describe('when the state has changed', function() {
            var newState;
            beforeEach(function() {
                newState = {};
                store.setState(newState);
            });

            it('should update the state', function() {
                expect(store.state).toEqual(newState);
            });

            it('should call the change listener with the new state', function() {
                expect(listener).toHaveBeenCalledWith(newState);
            });
        });

        describe('when the state has not changed', function() {
            beforeEach(function() {
                store.setState(store.state);
            });

            it('should not call the change listener', function() {
                expect(listener).not.toHaveBeenCalled();
            });
        });
    });

    describe('#addChangeListener()', function() {
        beforeEach(function() {
            store.hasChanged();
        });

        it('should call the change listener', function() {
            expect(listener.calls.count()).toEqual(1);
        });

        it('should pass the state and store as the arguments', function() {
            expect(listener).toHaveBeenCalledWith(store.state, store);
        });

        it('should set the callbacks function context', function() {
            expect(actualChangeListenerScope).toEqual(expectedChangeListenerScope);
        });

        describe('after deregistering the change listener', function() {
            beforeEach(function() {
                removeChangeListener();
                store.hasChanged();
            });

            it('should NOT call the change listener', function() {
                expect(listener.calls.count()).toEqual(1);
            });
        });
    });

    describe('#dispose()', function() {
        var clear;

        beforeEach(function() {
            clear = jasmine.createSpy();
        });

        describe('when you dont pass in a dispose function', function() {
            beforeEach(function() {
                store = new FluxStore({
                    dispatcher: dispatcher,
                    clear: clear,
                    getInitialState: function() {
                        return {};
                    }
                });

                store.addChangeListener(listener);
                store.hasChanged();
                store.dispose();
                store.hasChanged();
            });

            it('should call clear', function() {
                expect(clear.calls.count()).toEqual(1);
            });

            it('should dispose of all listeners', function() {
                expect(listener.calls.count()).toEqual(1);
            });
        });

        describe('when you pass in a dispose function', function() {
            var dispose;

            beforeEach(function() {
                dispose = jasmine.createSpy();
                store = new FluxStore({
                    dispatcher: dispatcher,
                    clear: clear,
                    dispose: dispose,
                    getInitialState: function() {
                        return {};
                    }
                });

                store.addChangeListener(listener);
                store.hasChanged();
                store.dispose();
                store.hasChanged();
            });

            it('should call the dispose function', function() {
                expect(dispose.calls.count()).toEqual(1);
            });

            it('should call clear', function() {
                expect(clear.calls.count()).toEqual(1);
            });

            it('should dispose of all listeners', function() {
                expect(listener.calls.count()).toEqual(1);
            });
        });
    });

    describe('#handlers', function() {
        describe('when the action handler is null', function() {
            it('should throw an error', function() {
                var createStoreWithMissingActionHandler = function() {
                    return new FluxStore({
                        dispatcher: dispatcher,
                        handlers: {
                            foo: 'FOO'
                        }
                    });
                };

                expect(createStoreWithMissingActionHandler).toThrow();
            });
        });

        describe('when the handler action predicate is null', function() {
            it('should throw an error', function() {
                var createStoreWithANullActionPredicate = function() {
                    return new FluxStore({
                        dispatcher: dispatcher,
                        handlers: {
                            foo: null
                        },
                        foo: noop
                    });
                };

                expect(createStoreWithANullActionPredicate).toThrow();
            });
        });
    });

    describe('#handleAction()', function() {
        var data = {},
            expectedAction;

        function handleAction(actionType) {
            var action = new FluxActionPayload({
                type: actionType,
                arguments: [data]
            });

            store.handleAction(action);

            return action;
        }

        function handleActionFrom(actionType, source) {
            var action = new FluxActionPayload({
                source: source,
                type: actionType,
                arguments: [data]
            });

            store.handleAction(action);

            return action;
        }

        describe('when the store does not handle action type', function() {
            beforeEach(function() {
                handleAction('foo');
            });

            it('should not call any handlers', function() {
                expect(store.one).not.toHaveBeenCalled();
                expect(store.multiple).not.toHaveBeenCalled();
            });
        });

        describe('when the store has one action type for a handler', function() {
            beforeEach(function() {
                expectedAction = handleAction('one-action');
            });

            it('should call the action handler', function() {
                expect(store.one.calls.count()).toEqual(1);
            });

            it('should pass the payload data to the handler', function() {
                expect(store.one).toHaveBeenCalledWith(data);
            });

            it('should make the action accessible in the function context', function() {
                expect(actualAction).toEqual(expectedAction);
            });
        });

        describe('when the store has multiple action types for a handler', function() {
            beforeEach(function() {
                handleAction('multi-1-action');
                handleAction('multi-2-action');
            });

            it('should call the action handler', function() {
                expect(store.multiple.calls.count()).toEqual(2);
            });

            it('should pass the payload data to the handler', function() {
                expect(store.multiple).toHaveBeenCalledWith(data);
            });
        });

        describe('when the store has a where clause for a handler', function() {
            beforeEach(function() {
                handleActionFrom('foo', 'VIEW');
            });

            it('should call the action handler', function() {
                expect(store.where).toHaveBeenCalled();
            });
        });

        describe('when the store has a where clause and an action type for a handler', function() {
            beforeEach(function() {
                handleActionFrom('foo', 'VIEW');
                handleAction('where-and-action');
            });

            it('should call the action handler for either', function() {
                expect(store.whereAndAction.calls.count()).toEqual(2);
            });
        });

        describe('rollbacks', function() {
            var store, actions, interimState;

            beforeEach(function() {
                store = new FluxStore({
                    dispatcher: dispatcher,
                    handlers: {
                        add: 'ADD'
                    },
                    getInitialState: function() {
                        return [];
                    },
                    add: function(user) {
                        this.state.push(user);

                        return function rollback() {
                            this.state.splice(this.state.indexOf(user), 1);
                        };
                    }
                });

                actions = new FluxActionCreators({
                    dispatcher: dispatcher,
                    add: function(user) {
                        var action = this.dispatch(user);

                        interimState = window.angular.copy(store.getState());

                        action.rollback();
                    }
                });
            });

            describe('when you create an action and then rollback', function() {
                var user = {
                    name: 'foo'
                };

                beforeEach(function() {
                    actions.add(user);
                });

                it('should call the action handler', function() {
                    expect(interimState).toContain(user);
                });

                it('should call the action handlers rollback functions', function() {
                    expect(store.getState()).not.toContain(user);
                });
            });
        });
    });

    describe('#clear()', function() {
        describe('when you do not pass in a clear function', function() {
            beforeEach(function() {
                store = new FluxStore({
                    dispatcher: dispatcher,
                    getInitialState: function() {
                        return {};
                    }
                });

                store.state['foo'] = 'bar';
                store.clear();
            });

            it('should replace the state with the original state', function() {
                expect(store.state.foo).toBeUndefined();
            });
        });

        describe('when you pass in a clear function', function() {
            var clear;

            beforeEach(function() {
                clear = jasmine.createSpy();
                store = new FluxStore({
                    dispatcher: dispatcher,
                    clear: clear,
                    getInitialState: function() {
                        return {};
                    }
                });

                store.state['foo'] = 'bar';
                store.clear();
            });

            it('should call the clear function', function() {
                expect(clear.calls.count()).toEqual(1);
            });

            it('should replace the state with the original state', function() {
                expect(store.state.foo).toBeUndefined();
            });
        });
    });

    describe('#waitFor()', function() {
        var store1, store2, store3, testActionCreators, actualResult, expectedResult, executionOrder;

        function waitFor(waitForCb) {
            var order = [];
            testActionCreators = new FluxActionCreators({
                sum: function() {
                    this.dispatch(2);
                }
            });

            store2 = new FluxStore({
                dispatcher: dispatcher,
                handlers: {
                    sum: 'SUM'
                },
                getInitialState: function() {
                    return 0;
                },
                sum: function(value) {
                    this.waitFor(store3);
                    this.state += store3.getState() + value;
                    order.push('store2');
                }
            });

            store1 = new FluxStore({
                dispatcher: dispatcher,
                handlers: {
                    sum: 'SUM'
                },
                getInitialState: function() {
                    return 0;
                },
                sum: function(value) {
                    waitForCb(this);
                    this.state = store2.getState() + value;
                    order.push('store1');
                }
            });

            store3 = new FluxStore({
                dispatcher: dispatcher,
                handlers: {
                    sum: 'SUM'
                },
                getInitialState: function() {
                    return 0;
                },
                sum: function(value) {
                    this.state += value;
                    order.push('store3');
                }
            });

            testActionCreators.sum();
            actualResult = store1.getState();

            return order;
        }

        beforeEach(function() {
            executionOrder = [];
            expectedResult = 6;
        });

        describe('when I pass in an array of stores', function() {
            beforeEach(function() {
                executionOrder = waitFor(function(store) {
                    store.waitFor([store3, store2]);
                });
            });

            it('should wait for the specified stores to complete', function() {
                expect(actualResult).toEqual(expectedResult);
            });

            it('should execute the stores in the specified order', function() {
                expect(executionOrder[0]).toEqual('store3');
                expect(executionOrder[1]).toEqual('store2');
                expect(executionOrder[2]).toEqual('store1');
            });
        });

        describe('when I pass in stores as arguments', function() {
            beforeEach(function() {
                executionOrder = waitFor(function(store) {
                    store.waitFor(store3, store2);
                });
            });

            it('should wait for the specified stores to complete', function() {
                expect(actualResult).toEqual(expectedResult);
            });

            it('should execute the stores in the specified order', function() {
                expect(executionOrder[0]).toEqual('store3');
                expect(executionOrder[1]).toEqual('store2');
                expect(executionOrder[2]).toEqual('store1');
            });
        });

        describe('when I pass in dispatch tokens', function() {
            beforeEach(function() {
                executionOrder = waitFor(function(store) {
                    store.waitFor(store3.dispatchToken);
                });
            });

            it('should wait for the specified stores to complete', function() {
                expect(actualResult).toEqual(expectedResult);
            });

            it('should execute the stores in the specified order', function() {
                expect(executionOrder[0]).toEqual('store3');
                expect(executionOrder[1]).toEqual('store2');
                expect(executionOrder[2]).toEqual('store1');
            });
        });
    });
});
