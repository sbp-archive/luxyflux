System.registerModule("../src/Actions", [], function(require) {
  "use strict";
  var __moduleName = "../src/Actions";
  var Actions = function Actions(dispatcher, actions) {
    this.dispatcher = dispatcher;
    Object.assign(this, actions);
  };
  ($traceurRuntime.createClass)(Actions, {
    set dispatcher(dispatcher) {
      if (!dispatcher) {
        throw new Error('You have to specify a dispatcher when creating an Actions');
      }
      this._dispatcher = dispatcher;
    },
    get dispatcher() {
      return this._dispatcher;
    },
    dispatch: function(actionType) {
      var $__2;
      var args = Array.toArray(arguments).slice(1);
      return ($__2 = this.dispatcher).dispatch.apply($__2, $traceurRuntime.spread([actionType], args));
    }
  }, {createServiceAction: function(dispatcher, actionType, action) {
      var $__0 = arguments;
      return (function() {
        var $__2;
        args = Array.toArray($__0);
        ($__2 = dispatcher).dispatch.apply($__2, $traceurRuntime.spread([actionType], args));
        return action.apply(null, $traceurRuntime.spread(args)).then((function(result) {
          dispatcher.dispatch(actionType + '_COMPLETED', result, args);
        })).catch((function(error) {
          dispatcher.dispatch(actionType + '_FAILED', error, args);
        }));
      });
    }});
  var $__default = Actions;
  return {
    get Actions() {
      return Actions;
    },
    get default() {
      return $__default;
    }
  };
});
System.registerModule("../src/Dispatcher", [], function(require) {
  "use strict";
  var __moduleName = "../src/Dispatcher";
  var _current;
  var _tokenCounter = 1;
  var Dispatcher = function Dispatcher() {
    this._callbacks = new Map();
    this._dispatchQueue = [];
    this._currentDispatch = false;
    this._currentDispatchPromises = new Map();
  };
  var $Dispatcher = Dispatcher;
  ($traceurRuntime.createClass)(Dispatcher, {
    register: function(token, callback) {
      if (token instanceof Function) {
        callback = token;
        token = ("luxaflux-callback-token-" + _tokenCounter++);
      }
      this._callbacks.set(token, callback);
      return token;
    },
    unregister: function(token) {
      return this._callbacks.delete(token);
    },
    waitFor: function(tokens) {
      if (!Array.isArray(tokens)) {
        tokens = [tokens];
      }
      var waitForPromises = [];
      for (var $__2 = tokens[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](),
          $__3 = void 0; !($__3 = $__2.next()).done; ) {
        var token = $__3.value;
        {
          if (this._currentDispatchPromises.has(token)) {
            waitForPromises.push(this._currentDispatchPromises.get(token));
          }
        }
      }
      if (!waitForPromises.length) {
        return Promise.resolve();
      }
      return Promise.all(waitForPromises);
    },
    dispatch: function() {
      var $__0 = this;
      var dispatchArguments = Array.toArray(arguments);
      var promise;
      if (this._currentDispatch) {
        promise = this._currentDispatch.then((function() {
          return $__0._dispatch(dispatchArguments);
        }));
        this._dispatchQueue.push(promise);
      } else {
        promise = this._dispatch(dispatchArguments);
      }
      this._currentDispatch = promise;
      return promise;
    },
    _dispatch: function(dispatchArguments) {
      var $__5,
          $__6;
      var $__0 = this;
      this._currentDispatchPromises.clear();
      for (var $__2 = this._callbacks[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](),
          $__3 = void 0; !($__3 = $__2.next()).done; ) {
        var $__4 = $__3.value,
            token = ($__5 = $__4[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](), ($__6 = $__5.next()).done ? void 0 : $__6.value),
            callback = ($__6 = $__5.next()).done ? void 0 : $__6.value;
        {
          ((function(token, callback) {
            var promise = Promise.resolve().then((function() {
              return callback.apply($__0, dispatchArguments);
            }));
            $__0._currentDispatchPromises.set(token, promise);
          }))(token, callback);
        }
      }
      var dequeue = (function() {
        $__0._dispatchQueue.shift();
        if (!$__0._dispatchQueue.length) {
          $__0._currentDispatch = false;
        }
      });
      return Promise.all(this._currentDispatchPromises.values()).then(dequeue, dequeue);
    },
    isDispatching: function() {
      return !!this._dispatchQueue.length;
    }
  }, {
    get current() {
      if (!_current) {
        _current = new $Dispatcher();
      }
      return _current;
    },
    set current(current) {
      this._current = current;
    }
  });
  var $__default = Dispatcher;
  return {
    get Dispatcher() {
      return Dispatcher;
    },
    get default() {
      return $__default;
    }
  };
});
System.registerModule("../src/Store", [], function(require) {
  "use strict";
  var __moduleName = "../src/Store";
  var _storeCounter = 1;
  var Store = function Store(name, dispatcher) {
    var handlers = arguments[2] !== (void 0) ? arguments[2] : {};
    var initializeFn = arguments[3] !== (void 0) ? arguments[3] : (function() {});
    if (!dispatcher) {
      throw new Error('You have to specify a dispatcher when creating a Store');
    }
    this.name = name;
    this.dispatcher = dispatcher;
    this.initialize = initializeFn.bind(this);
    this.addActionHandlers(handlers);
    this.initialize();
  };
  ($traceurRuntime.createClass)(Store, {
    set dispatcher(dispatcher) {
      if (this._dispatcher !== dispatcher) {
        this._dispatcher.unregister(this.name);
      }
      dispatcher.register(this.name, this.callback);
      this._dispatcher = dispatcher;
    },
    get dispatcher() {
      return this._dispatcher;
    },
    set name(name) {
      if (!name) {
        name = ("luxaflux-store-name-" + _storeCounter++);
      }
      this._name = name;
    },
    get name() {
      return this._name;
    },
    addActionHandlers: function(actionHandlers) {},
    callback: function(action, payload) {},
    waitFor: function(tokens) {}
  }, {});
  var $__default = Store;
  return {
    get Store() {
      return Store;
    },
    get default() {
      return $__default;
    }
  };
});
System.registerModule("../src/LuxaFlux", [], function(require) {
  "use strict";
  var $__15 = $traceurRuntime.initGeneratorFunction(_entries);
  var __moduleName = "../src/LuxaFlux";
  var Dispatcher = System.get("../src/Dispatcher").default;
  var Actions = System.get("../src/Actions").default;
  var Store = System.get("../src/Store").default;
  ;
  var defaultStoreConfig = {
    name: null,
    dispatcher: Dispatcher.current,
    handlers: {},
    initialize: (function() {})
  };
  var defaultActionsConfig = {
    dispatcher: Dispatcher.current,
    serviceActions: {}
  };
  var LuxaFlux = function LuxaFlux() {};
  ($traceurRuntime.createClass)(LuxaFlux, {}, {
    createStore: function(StoreClass, config) {
      var $__10,
          $__11;
      if (Object.isObject(StoreCls)) {
        config = StoreCls;
        StoreClass = Store;
      }
      config = Object.assign({}, defaultStoreConfig, config);
      var $__8 = config,
          name = $__8.name,
          dispatcher = $__8.dispatcher,
          handlers = $__8.handlers,
          initializeFn = $__8.initializeFn;
      delete config.initialize;
      delete config.dispatcher;
      delete config.handlers;
      delete config.initializeFn;
      for (var $__4 = _entries(handlers)[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](),
          $__5 = void 0; !($__5 = $__4.next()).done; ) {
        var $__9 = $__5.value,
            actionType = ($__10 = $__9[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](), ($__11 = $__10.next()).done ? void 0 : $__11.value),
            handlerName = ($__11 = $__10.next()).done ? void 0 : $__11.value;
        {
          if (config[$traceurRuntime.toProperty(handlerName)] instanceof Function) {
            handlers[$traceurRuntime.toProperty(actionType)] = config[$traceurRuntime.toProperty(handlerName)];
          }
        }
      }
      ;
      return new StoreClass(name, dispatcher, handlers, initializeFn);
    },
    createActions: function(ActionsClass, config) {
      var $__10,
          $__11,
          $__13,
          $__14;
      if (Object.isObject(ActionsClass)) {
        config = ActionsClass;
        ActionsClass = Actions;
      }
      config = Object.assign({}, defaultActionsConfig, config);
      var $__8 = config,
          dispatcher = $__8.dispatcher,
          serviceActions = $__8.serviceActions;
      delete config.dispatcher;
      delete config.serviceActions;
      var actions = {};
      for (var $__4 = _entries(config)[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](),
          $__5 = void 0; !($__5 = $__4.next()).done; ) {
        var $__9 = $__5.value,
            actionType = ($__10 = $__9[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](), ($__11 = $__10.next()).done ? void 0 : $__11.value),
            action = ($__11 = $__10.next()).done ? void 0 : $__11.value;
        {
          if (action instanceof Function) {
            actions[$traceurRuntime.toProperty(actionType)] = action;
          }
        }
      }
      for (var $__6 = _entries(serviceActions)[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](),
          $__7 = void 0; !($__7 = $__6.next()).done; ) {
        var $__12 = $__7.value,
            actionType = ($__13 = $__12[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](), ($__14 = $__13.next()).done ? void 0 : $__14.value),
            actionName = ($__14 = $__13.next()).done ? void 0 : $__14.value;
        {
          var action = actions[$traceurRuntime.toProperty(actionName)];
          if (action) {
            actions[$traceurRuntime.toProperty(actionName)] = Actions.createServiceAction(dispatcher, actionType, action);
          }
        }
      }
      return new ActionsClass(dispatcher, actions);
    },
    dispatchAction: function(action, payload) {
      return Dispatcher.current.dispatch(action, payload);
    }
  });
  var $__default = LuxaFlux;
  function _entries(obj) {
    var $__4,
        $__5,
        key;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__4 = Object.keys(obj)[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](), $__5 = void 0;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = (!($__5 = $__4.next()).done) ? 5 : -2;
            break;
          case 5:
            key = $__5.value;
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return [key, obj[$traceurRuntime.toProperty(key)]];
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          default:
            return $ctx.end();
        }
    }, $__15, this);
  }
  return {
    get Dispatcher() {
      return Dispatcher;
    },
    get Actions() {
      return Actions;
    },
    get Store() {
      return Store;
    },
    get defaultStoreConfig() {
      return defaultStoreConfig;
    },
    get defaultActionsConfig() {
      return defaultActionsConfig;
    },
    get LuxaFlux() {
      return LuxaFlux;
    },
    get default() {
      return $__default;
    }
  };
});
System.registerModule("../src/ngFlux.js", [], function(require) {
  "use strict";
  var __moduleName = "../src/ngFlux.js";
  var $__0 = System.get("../src/LuxaFlux"),
      Actions = $__0.Actions,
      Dispatcher = $__0.Dispatcher,
      Store = $__0.Store,
      LuxaFlux = $__0.LuxaFlux;
  window.angular.module('connect-flux', []).service('LuxaFluxActions', function() {
    return Actions;
  }).service('LuxaFluxDispatcher', function() {
    return Dispatcher;
  }).service('LuxaFluxStore', function() {
    return Store;
  }).service('LuxaFlux', function() {
    return LuxaFlux;
  });
  return {};
});
System.get("../src/ngFlux.js" + '');
