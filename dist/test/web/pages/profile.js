'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _synLibAppDescribe = require('syn/lib/app/Describe');

var _synLibAppDescribe2 = _interopRequireDefault(_synLibAppDescribe);

var _configJson = require('../../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _componentsLayout = require('../components/layout');

var _componentsLayout2 = _interopRequireDefault(_componentsLayout);

var ProfilePage = (function (_Describe) {
  function ProfilePage() {
    var _this = this;

    _classCallCheck(this, ProfilePage);

    _get(Object.getPrototypeOf(ProfilePage.prototype), 'constructor', this).call(this, 'Profile Page', {
      'disposable': [{ 'model': 'User', 'name': 'User' }],
      'web driver': { page: 'Profile' }
    });

    this.assert(function () {
      var title = _configJson2['default'].title.prefix + 'Profile';

      return new _componentsLayout2['default']({ title: title }).driver(_this._driver);
    });

    ;
  }

  _inherits(ProfilePage, _Describe);

  return ProfilePage;
})(_synLibAppDescribe2['default']);

exports['default'] = ProfilePage;
module.exports = exports['default'];