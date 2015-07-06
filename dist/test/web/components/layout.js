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

var _synLibAppMilk = require('syn/lib/app/milk');

var _synLibAppMilk2 = _interopRequireDefault(_synLibAppMilk);

var _synConfigJson = require('syn/config.json');

var _synConfigJson2 = _interopRequireDefault(_synConfigJson);

var _componentsTopBar = require('../components/top-bar');

var _componentsTopBar2 = _interopRequireDefault(_componentsTopBar);

var _componentsFooter = require('../components/footer');

var _componentsFooter2 = _interopRequireDefault(_componentsFooter);

var Layout = (function (_Milk) {
  function Layout(props) {
    var _this = this;

    _classCallCheck(this, Layout);

    props = props || {};

    var options = { viewport: props.viewport };

    _get(Object.getPrototypeOf(Layout.prototype), 'constructor', this).call(this, 'Layout', options);

    this.props = props;

    if (this.props.driver !== false) {
      this.go('/');
    }

    var expectedTitle = undefined;

    if (props.title) {
      expectedTitle = props.title;
    } else {
      expectedTitle = _synConfigJson2['default'].title.prefix + _synConfigJson2['default'].title['default'];
    }

    this.title(function (title) {
      return title.should.be.exactly(expectedTitle);
    });

    this.ok(function () {
      return _this.find('meta[charset="utf-8"]').is(true);
    });

    this['import'](_componentsTopBar2['default'], { driver: false });

    this['import'](_componentsFooter2['default'], { driver: false });

    ;
  }

  _inherits(Layout, _Milk);

  return Layout;
})(_synLibAppMilk2['default']);

exports['default'] = Layout;
module.exports = exports['default'];