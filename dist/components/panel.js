'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _libAppComponent = require('../lib/app/component');

var _libAppComponent2 = _interopRequireDefault(_libAppComponent);

var _utilIcon = require('./util/icon');

var _utilIcon2 = _interopRequireDefault(_utilIcon);

var _utilAccordion = require('./util/accordion');

var _utilAccordion2 = _interopRequireDefault(_utilAccordion);

var _creator = require('./creator');

var _creator2 = _interopRequireDefault(_creator);

var _join = require('./join');

var _join2 = _interopRequireDefault(_join);

var _item = require('./item');

var _item2 = _interopRequireDefault(_item);

var Panel = (function (_React$Component) {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function Panel(props) {
    _classCallCheck(this, Panel);

    _get(Object.getPrototypeOf(Panel.prototype), 'constructor', this).call(this, props);

    this.state = {
      showCreator: 0,
      active: false
    };
  }

  _inherits(Panel, _React$Component);

  _createClass(Panel, [{
    key: 'toggleCreator',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function toggleCreator() {
      if (this.props.user) {
        var active = null;

        if (this.state.active !== 'creator') {
          active = 'creator';
        }

        this.setState({ active: active });
      } else {
        _join2['default'].click();
      }
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render() {
      var _this = this;

      var creator = undefined,
          creatorIcon = undefined,
          newItem = undefined;

      if (this.props.creator !== false) {
        creator = _react2['default'].createElement(
          _utilAccordion2['default'],
          _extends({ active: this.state.active === 'creator', poa: this.refs.panel }, this.props),
          _react2['default'].createElement(_creator2['default'], this.props)
        );
        creatorIcon = _react2['default'].createElement(_utilIcon2['default'], { icon: 'plus', onClick: this.toggleCreator.bind(this), className: 'toggle-creator' });
      }

      if (this.props.newItem) {
        var relevant = false;

        if (this.props.newItem.panel.type === this.props.type) {
          relevant = true;
        }

        if (relevant) {
          newItem = _react2['default'].createElement(_item2['default'], _extends({ item: this.props.newItem.item, 'new': true }, this.props));
        }
      }

      var child = _react2['default'].Children.map(this.props.children, function (child) {
        return _react2['default'].cloneElement(child, { panel: _this });
      });

      return _react2['default'].createElement(
        'section',
        { className: _libAppComponent2['default'].classList(this, 'syn-panel'), ref: 'panel' },
        _react2['default'].createElement(
          'section',
          { className: 'syn-panel-heading' },
          _react2['default'].createElement(
            'h4',
            null,
            this.props.title
          ),
          creatorIcon
        ),
        _react2['default'].createElement(
          'section',
          { className: 'syn-panel-body' },
          creator,
          newItem,
          child
        )
      );
    }
  }]);

  return Panel;
})(_react2['default'].Component);

exports['default'] = Panel;
module.exports = exports['default'];