'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsUser = require('../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

function resetPassword(event, key, token, password) {
  var _this = this;

  try {
    _modelsUser2['default'].resetPassword(key, token, password).then(function () {
      return _this.ok(event);
    }, function (error) {
      return _this.error(error);
    });
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = resetPassword;
module.exports = exports['default'];