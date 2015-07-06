(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

!(function Page_ResetPassword_Controller() {

  'use strict';

  var Synapp = require('syn/app');
  var Sign = require('syn/components/sign/ctrl');
  var ResetPassword = require('syn/components/reset-password/ctrl');

  window.app = new Synapp();

  app.connect(function () {
    new Sign().render();

    new ResetPassword().render();
  });
})();

},{"syn/app":4,"syn/components/reset-password/ctrl":5,"syn/components/sign/ctrl":6}],2:[function(require,module,exports){
/*global define:false require:false */
module.exports = (function(){
	// Import Events
	var events = require('events')

	// Export Domain
	var domain = {}
	domain.createDomain = domain.create = function(){
		var d = new events.EventEmitter()

		function emitError(e) {
			d.emit('error', e)
		}

		d.add = function(emitter){
			emitter.on('error', emitError)
		}
		d.remove = function(emitter){
			emitter.removeListener('error', emitError)
		}
		d.bind = function(fn){
			return function(){
				var args = Array.prototype.slice.call(arguments)
				try {
					fn.apply(null, args)
				}
				catch (err){
					emitError(err)
				}
			}
		}
		d.intercept = function(fn){
			return function(err){
				if ( err ) {
					emitError(err)
				}
				else {
					var args = Array.prototype.slice.call(arguments, 1)
					try {
						fn.apply(null, args)
					}
					catch (err){
						emitError(err)
					}
				}
			}
		}
		d.run = function(fn){
			try {
				fn()
			}
			catch (err) {
				emitError(err)
			}
			return this
		};
		d.dispose = function(){
			this.removeAllListeners()
			return this
		};
		d.enter = d.exit = function(){
			return this
		}
		return d
	};
	return domain
}).call(this)
},{"events":3}],3:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

var _get = function get(_x, _x2, _x3) {
  var _again = true;_function: while (_again) {
    var object = _x,
        property = _x2,
        receiver = _x3;desc = parent = getter = undefined;_again = false;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);if (parent === null) {
        return undefined;
      } else {
        _x = parent;_x2 = property;_x3 = receiver;_again = true;continue _function;
      }
    } else if ('value' in desc) {
      return desc.value;
    } else {
      var getter = desc.get;if (getter === undefined) {
        return undefined;
      }return getter.call(receiver);
    }
  }
};

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
}

var _events = require('events');

var _domain = require('domain');

var _domain2 = _interopRequireDefault(_domain);

var _synLibAppCache = require('syn/lib/app/cache');

var _synLibAppCache2 = _interopRequireDefault(_synLibAppCache);

var App = (function (_EventEmitter) {
  function App(isPage) {
    var _this = this;

    _classCallCheck(this, App);

    _get(Object.getPrototypeOf(App.prototype), 'constructor', this).call(this);

    this.store = {};

    this.connect();

    if (isPage) {
      this.store.socket = {};

      this.socket.on('welcome', function (user) {
        console.log('Connected to socket');
        _this.socket.synuser = user;
        _this.emit('ready');
      });
    }

    this.domain = _domain2['default'].create().on('error', function (error) {
      return _this.emit('error', error);
    });

    this.domain.intercept = function (handler) {
      return function (error) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key2 = 1; _key2 < _len; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        return _this.domain.run(function () {
          if (error) {
            throw error;
          }
          if (handler) {
            handler.apply(undefined, args);
          }
        });
      };
    };
  }

  _inherits(App, _EventEmitter);

  _createClass(App, [{
    key: 'get',

    /** Get local store by key
     *  @arg      {String} key
     *  @return   Any
    */

    value: function get(key) {
      return this.store[key];
    }
  }, {
    key: 'getGlobal',

    /** Get global store by key
     *  @arg      {String} key
     *  @return   Any
    */

    value: function getGlobal(key) {
      return synapp.app.store[key];
    }
  }, {
    key: 'set',

    /** Set local store by key
     *  @arg      {String} key
     *  @arg      {Any} value
     *  @return   App
    */

    value: function set(key, value) {
      this.store[key] = value;

      this.emit('set', key, value);

      return this;
    }
  }, {
    key: 'setGlobal',

    /** Set global store by key
     *  @arg      {String} key
     *  @arg      {Any} value
     *  @return   App
    */

    value: function setGlobal(key, value) {
      this.store[key] = value;

      this.emit('set global', key, value);

      return this;
    }
  }, {
    key: 'copy',

    /** Copy a global into local and stay in sync with changes
     *  @arg      {String} key
    */

    value: function copy(key) {
      var _this2 = this;

      this.store[key] = this.getGlobal(key);

      this.on('set global', function (_key, value) {
        if (key === _key) {
          _this2.store.set(key, value);
        }
      });
    }
  }, {
    key: 'error',

    /** Throw App error
     *  @arg      {Error} err
    */

    value: function error(err) {
      console.log('App error');
    }
  }, {
    key: 'ready',

    /** Execute handler on App ready
     *  @arg      {Function} fn
    */

    value: function ready(fn) {
      this.on('ready', fn);
    }
  }, {
    key: 'connect',

    /** Set store by key
     *  @arg      {String} key
     *  @arg      {Any} value
     *  @return   App
    */

    value: function connect() {

      if (!io.$$socket) {
        io.$$socket = io.connect('http://' + window.location.hostname + ':' + window.location.port);
      }

      this.socket = io.$$socket;
    }
  }, {
    key: 'reconnect',
    value: function reconnect() {
      console.log('reconnecting');
      this.socket.close().connect();
    }
  }, {
    key: 'publish',
    value: function publish(event) {
      var _this3 = this;

      for (var _len2 = arguments.length, messages = Array(_len2 > 1 ? _len2 - 1 : 0), _key3 = 1; _key3 < _len2; _key3++) {
        messages[_key3 - 1] = arguments[_key3];
      }

      var unsubscribe = function unsubscribe() {
        _this3.socket.removeListener('OK ' + event, _this3.handler);
      };

      console.info.apply(console, ['PUB', event].concat(messages));

      return {
        subscribe: function subscribe(handler) {
          var _socket$on;

          (_socket$on = _this3.socket.on('OK ' + event, function () {
            for (var _len3 = arguments.length, responses = Array(_len3), _key4 = 0; _key4 < _len3; _key4++) {
              responses[_key4] = arguments[_key4];
            }

            return handler.apply(undefined, [{ unsubscribe: unsubscribe.bind(handler) }].concat(responses));
          })).emit.apply(_socket$on, [event].concat(messages));
        }
      };
    }
  }, {
    key: 'load',
    value: function load() {

      if (!this.template) {
        if (_synLibAppCache2['default'].getTemplate(this.componentName)) {
          this.template = $(_synLibAppCache2['default'].getTemplate(this.componentName));
        } else {
          var View = this.view;
          var view = new View(this.props);
          _synLibAppCache2['default'].setTemplate(this.componentName, view.render());
          this.template = $(_synLibAppCache2['default'].getTemplate(this.componentName));
        }
      }

      return this.template;
    }
  }]);

  return App;
})(_events.EventEmitter);

exports['default'] = App;
module.exports = exports['default'];

},{"domain":2,"events":3,"syn/lib/app/cache":7}],5:[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  var Form = require('syn/lib/util/form');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function ResetPassword() {}

  ResetPassword.prototype.render = function () {
    this.form = $('#reset-password');

    var form = new Form(this.form);

    form.send(function () {

      if (form.labels.password.val() !== form.labels.confirm.val()) {
        return form.labels.confirm.addClass('error').focus();
      }

      $('.reset-password-loading.hide').removeClass('.hide');
      $('.reset-password-not-found').not('.hide').addClass('hide');

      var token;

      location.search.replace(/(\?|&)token=((.){10})/, function getToken(match, tokenBefore, tokenChain) {
        token = tokenChain;
      });

      var ko = function ko(error) {
        console.log(error);

        if (error.message === 'No such key/token') {
          setTimeout(function () {
            $('.reset-password-loading').addClass('hide');

            $('.reset-password-not-found').removeClass('hide');
          }, 1000);
        }
      };

      app.socket.on('reset password ok', function (user) {
        setTimeout(function () {
          $('#reset-password .reset-password-loading').addClass('hide');

          $('#reset-password .reset-password-ok').removeClass('hide');

          $('#reset-password .form-section.collapse').addClass('hide');

          setTimeout(function () {
            $('.login-button').click();
          }, 2500);

          setTimeout(function () {
            $('.login-modal [name="email"]').focus();
          }, 3000);
        }, 1000);
      });

      app.socket.on('reset password ko', ko);

      app.socket.emit('reset password', form.labels.key.val(), token, form.labels.password.val());
    });

    // this.form.on('submit', function () {

    //   var key       =   $(this).find('[name="key"]');
    //   var password  =   $(this).find('[name="password"]');
    //   var confirm   =   $(this).find('[name="confirm"]');

    //   key.removeClass('error');

    //   password.removeClass('error');

    //   confirm.removeClass('error');

    //   if ( $('.reset-password-loading.in').length || $('.reset-password-ok.in').length ) {
    //     return false;
    //   }

    //   if ( $('.reset-password-not-found.in').length ) {
    //      $('.reset-password-not-found').collapse('hide');
    //   }

    //   if ( ! key.val() ) {
    //     key.addClass('error').focus();
    //   }

    //   else if ( ! password.val() ) {
    //     password.addClass('error').focus();
    //   }

    //   else if ( ! confirm.val() || confirm.val() !== password.val() ) {
    //     confirm.addClass('error').focus();
    //   }

    //   else {

    //     console.log('ping');

    //     $('.reset-password-loading').collapse('show');

    //     var token;

    //     location.search.replace(/(\?|&)token=((.){10})/,
    //       function getToken (match, tokenBefore, tokenChain) {
    //         token = tokenChain;
    //       });

    //     var ko = function (error) {
    //       console.log(error);

    //       if ( error.message === 'No such key/token' ) {
    //         setTimeout(function () {
    //           $('.reset-password-loading').collapse('hide');

    //           $('.reset-password-not-found').collapse('show');
    //         }, 1000);
    //       }
    //     };

    //     app.socket.on('reset password ok', function (user) {
    //       setTimeout(function () {
    //         $('#reset-password .reset-password-loading').collapse('hide');

    //         $('#reset-password .reset-password-ok').collapse('show');

    //         $('#reset-password .form-section.collapse').collapse('hide');

    //         setTimeout(function () {
    //           $('#login-modal').modal('show');
    //         }, 2500);

    //         setTimeout(function () {
    //           $('#login-modal [name="email"]').focus();
    //         }, 3500);

    //       }, 1000);
    //     });

    //     app.socket.on('reset password ko', ko);

    //     app.socket.emit('reset password', key.val(), token, password.val());

    //   }

    //   return false;
    // });
  };

  module.exports = ResetPassword;
})();

},{"syn/lib/util/form":10}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

var _get = function get(_x, _x2, _x3) {
  var _again = true;_function: while (_again) {
    var object = _x,
        property = _x2,
        receiver = _x3;desc = parent = getter = undefined;_again = false;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);if (parent === null) {
        return undefined;
      } else {
        _x = parent;_x2 = property;_x3 = receiver;_again = true;continue _function;
      }
    } else if ('value' in desc) {
      return desc.value;
    } else {
      var getter = desc.get;if (getter === undefined) {
        return undefined;
      }return getter.call(receiver);
    }
  }
};

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
}

var _synLibAppController = require('syn/lib/app/controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var Sign = (function (_Controller) {
  function Sign(props) {
    _classCallCheck(this, Sign);

    _get(Object.getPrototypeOf(Sign.prototype), 'constructor', this).call(this);

    this.props = props;
  }

  _inherits(Sign, _Controller);

  _createClass(Sign, [{
    key: 'render',
    value: function render() {}
  }]);

  return Sign;
})(_synLibAppController2['default']);

exports['default'] = Sign;

Sign.dialog = {

  login: (function (_login) {
    function login() {
      return _login.apply(this, arguments);
    }

    login.toString = function () {
      return _login.toString();
    };

    return login;
  })(function () {

    vex.defaultOptions.className = 'vex-theme-flat-attack';

    vex.dialog.confirm({

      afterOpen: function afterOpen($vexContent) {
        $('.login-button').off('click').on('click', function () {
          vex.close();
        });

        login($vexContent);

        $vexContent.find('.forgot-password-link').on('click', function () {
          Sign.dialog.forgotPassword();
          vex.close($vexContent.data().vex.id);
          return false;
        });
      },

      afterClose: function afterClose() {
        $('.login-button').on('click', Sign.dialog.login);
      },

      message: $('#login').text(),

      buttons: [
      //- $.extend({}, vex.dialog.buttons.YES, {
      //-    text: 'Login'
      //-  }),

      $.extend({}, vex.dialog.buttons.NO, {
        text: 'x Close'
      })]
    });
  }),

  join: (function (_join) {
    function join() {
      return _join.apply(this, arguments);
    }

    join.toString = function () {
      return _join.toString();
    };

    return join;
  })(function () {

    vex.defaultOptions.className = 'vex-theme-flat-attack';

    vex.dialog.confirm({

      afterOpen: function afterOpen($vexContent) {
        $('.join-button').off('click').on('click', function () {
          vex.close();
        });

        join($vexContent);
      },

      afterClose: function afterClose() {
        $('.join-button').on('click', Sign.dialog.join);
      },

      message: $('#join').text(),
      buttons: [
      //- $.extend({}, vex.dialog.buttons.YES, {
      //-    text: 'Login'
      //-  }),

      $.extend({}, vex.dialog.buttons.NO, {
        text: 'x Close'
      })],
      callback: function callback(value) {
        return console.log(value ? 'Successfully destroyed the planet.' : 'Chicken.');
      },
      defaultOptions: {
        closeCSS: {
          color: 'red'
        }
      }
    });
  }),

  forgotPassword: (function (_forgotPassword) {
    function forgotPassword() {
      return _forgotPassword.apply(this, arguments);
    }

    forgotPassword.toString = function () {
      return _forgotPassword.toString();
    };

    return forgotPassword;
  })(function () {

    console.log('helllo');

    vex.defaultOptions.className = 'vex-theme-flat-attack';

    vex.dialog.confirm({

      afterOpen: function afterOpen($vexContent) {
        $('.forgot-password-link').off('click').on('click', function () {
          vex.close();
          return false;
        });

        forgotPassword($vexContent);
      },

      afterClose: function afterClose() {
        $('.forgot-password-link').on('click', Sign.dialog.forgotPassword);
      },

      message: $('#forgot-password').text(),
      buttons: [
      //- $.extend({}, vex.dialog.buttons.YES, {
      //-    text: 'Login'
      //-  }),

      $.extend({}, vex.dialog.buttons.NO, {
        text: 'x Close'
      })],
      callback: function callback(value) {
        return console.log(value ? 'Successfully destroyed the planet.' : 'Chicken.');
      },
      defaultOptions: {
        closeCSS: {
          color: 'red'
        }
      }
    });

    return false;
  })

};

// export default Sign;

// /*
//  *  ******************************************************
//  *  ******************************************************
//  *  ******************************************************

//  *  S   I   G   N

//  *  ******************************************************
//  *  ******************************************************
//  *  ******************************************************
// */

// ! function () {

//   'use strict';

//   var Nav             =   require('syn/lib/util/nav');
//   var login           =   require('syn/components/login/Controller');
//   var join            =   require('syn/components/join/Controller');
//   var forgotPassword  =   require('syn/components/ForgotPassword/Controller');

//   function Sign () {

//   }

//   Sign.prototype.render = function () {
//     // this.signIn();
//     // this.signUp();
//     // this.forgotPassword();

//     app.socket.on('online users', function (online) {
//       $('.online-users').text(online);
//     });

//     $('.topbar-right').removeClass('hide');

//     if ( ! app.socket.synuser ) {
//       $('.login-button').on('click', Sign.dialog.login);
//       $('.join-button').on('click', Sign.dialog.join);
//       $('.topbar .is-in').hide();
//     }

//     else {
//       $('.topbar .is-out').remove();
//     }
//   };

//   module.exports = Sign;

// } ();
module.exports = exports['default'];

},{"syn/lib/app/controller":8}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

var Cache = (function () {
  function Cache() {
    _classCallCheck(this, Cache);

    this.cache = {
      templates: {}
    };
  }

  _createClass(Cache, [{
    key: 'getTemplate',
    value: function getTemplate(tpl) {
      return this.cache.templates[tpl];
    }
  }, {
    key: 'setTemplate',
    value: function setTemplate(tpl, val) {
      this.cache.templates[tpl] = val;
    }
  }]);

  return Cache;
})();

exports['default'] = new Cache();
module.exports = exports['default'];

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) {
  var _again = true;_function: while (_again) {
    var object = _x,
        property = _x2,
        receiver = _x3;desc = parent = getter = undefined;_again = false;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);if (parent === null) {
        return undefined;
      } else {
        _x = parent;_x2 = property;_x3 = receiver;_again = true;continue _function;
      }
    } else if ('value' in desc) {
      return desc.value;
    } else {
      var getter = desc.get;if (getter === undefined) {
        return undefined;
      }return getter.call(receiver);
    }
  }
};

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
}

var _synApp = require('syn/app');

var _synApp2 = _interopRequireDefault(_synApp);

var Controller = (function (_App) {
  function Controller() {
    _classCallCheck(this, Controller);

    _get(Object.getPrototypeOf(Controller.prototype), 'constructor', this).call(this);
  }

  _inherits(Controller, _App);

  return Controller;
})(_synApp2['default']);

exports['default'] = Controller;
module.exports = exports['default'];

},{"syn/app":4}],9:[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  var domain = require('domain');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function domainRun(fn, reject) {
    var d = domain.create();

    d.intercept = function (fn, _self) {

      if (typeof fn !== 'function') {
        fn = function () {};
      }

      return function (error) {
        if (error && error instanceof Error) {
          d.emit('error', error);
        } else {
          var args = Array.prototype.slice.call(arguments);

          args.shift();

          fn.apply(_self, args);
        }
      };
    };

    d.on('error', function onDomainError(error) {
      console.error(error);

      if (error.stack) {
        error.stack.split(/\n/).forEach(function (line) {
          line.split(/\n/).forEach(console.warn.bind(console));
        });
      }

      if (typeof reject === 'function') {
        reject(error);
      }
    });

    d.run(function () {
      fn(d);
    });
  }

  module.exports = domainRun;
})();

},{"domain":2}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

var _synLibUtilDomainRun = require('syn/lib/util/domain-run');

var _synLibUtilDomainRun2 = _interopRequireDefault(_synLibUtilDomainRun);

var Form = (function () {
  function Form(form) {
    var _this = this;

    _classCallCheck(this, Form);

    var self = this;

    this.form = form;

    this.labels = {};

    form.find('[name]').each(function () {
      self.labels[$(this).attr('name')] = $(this);
    });

    // #193 Disable <Enter> keys

    form.find('input').on('keydown', function (e) {
      if (e.keyCode === 13) {
        return false;
      }
    });

    form.on('submit', function (e) {
      setTimeout(function () {
        return _this.submit(e);
      });
      return false;
    });
  }

  _createClass(Form, [{
    key: 'send',
    value: function send(fn) {
      this.ok = fn;
      return this;
    }
  }, {
    key: 'submit',
    value: function submit(e) {
      var errors = [];

      this.form.find('[required]').each(function () {
        var val = $(this).val();

        if (!val) {

          if (!errors.length) {
            $(this).addClass('error').focus();
          }

          errors.push({ required: $(this).attr('name') });
        } else {
          $(this).removeClass('error');
        }
      });

      if (!errors.length) {
        this.ok();
      }

      return false;
    }
  }]);

  return Form;
})();

exports['default'] = Form;
module.exports = exports['default'];

},{"syn/lib/util/domain-run":9}]},{},[1]);
