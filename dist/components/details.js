'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utilLoading = require('./util/loading');

var _utilLoading2 = _interopRequireDefault(_utilLoading);

var Popularity = (function (_React$Component) {
  function Popularity() {
    _classCallCheck(this, Popularity);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Popularity, _React$Component);

  _createClass(Popularity, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          'div',
          null,
          this.props.number
        )
      );
    }
  }]);

  return Popularity;
})(_react2['default'].Component);

var Details = (function (_React$Component2) {
  function Details(props) {
    _classCallCheck(this, Details);

    _get(Object.getPrototypeOf(Details.prototype), 'constructor', this).call(this, props);

    this.status = 'iddle';

    this.state = {};
  }

  _inherits(Details, _React$Component2);

  _createClass(Details, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      if (props.show && this.status === 'iddle') {
        this.status = 'ready';
        this.get();
      }
    }
  }, {
    key: 'get',
    value: function get() {
      var _this = this;

      if (typeof window !== 'undefined') {
        window.socket.emit('get item details', this.props.item).on('OK get item details', function (details) {
          _this.setState({ details: details });
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var content = _react2['default'].createElement(_utilLoading2['default'], null);

      if (this.state.details) {
        content = [];

        content.push(_react2['default'].createElement(Popularity, this.props.item.popularity));
      }

      return _react2['default'].createElement(
        'section',
        { className: 'details text-center' },
        content
      );
    }
  }]);

  return Details;
})(_react2['default'].Component);

exports['default'] = Details;
module.exports = exports['default'];