! function () {
  
  'use strict';


  function Socket (emit) {
    var self = this;

    /** Socket */
    self.socket = io.connect('http://' + location.hostname + ':' + location.port);

    self.socket.once('connect', function () {
      emit('ready');
    });

    self.socket.publish = function (event) {

      var args = [];
      var done;

      for ( var i in arguments ) {
        if ( +i ) {
          if ( typeof arguments[i] === 'function' ) {
            done = arguments[i];
          }
          else {
            args.push(arguments[i]);
          }
        }
      }

      self.socket.emit.apply(self.socket, [event].concat(args));

      self.socket.on('OK ' + event, done);

    }

    self.socket.on('error', function (error) {
      console.log('socket error', error);
    });
  }

  module.exports = Socket;

} ();
