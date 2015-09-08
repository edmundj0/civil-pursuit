'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utilButton = require('./util/button');

var _utilButton2 = _interopRequireDefault(_utilButton);

var _utilIcon = require('./util/icon');

var _utilIcon2 = _interopRequireDefault(_utilIcon);

var Training = (function (_React$Component) {
  function Training(props) {
    _classCallCheck(this, Training);

    _get(Object.getPrototypeOf(Training.prototype), 'constructor', this).call(this, props);

    window.Dispatcher.emit('get instructions');

    this.state = { cursor: 0 };
  }

  _inherits(Training, _React$Component);

  _createClass(Training, [{
    key: 'go',
    value: function go() {

      var instruction = this.props.instructions[this.state.cursor];

      var tooltip = {
        element: _react2['default'].findDOMNode(this.refs.view),
        offset: {},
        target: {
          element: document.querySelector(instruction.element),
          offset: {}
        },
        position: {}
      };

      tooltip.rect = tooltip.element.getBoundingClientRect();
      tooltip.offset.top = tooltip.element.offsetTop;
      tooltip.offset.bottom = tooltip.element.offseBottom;
      tooltip.offset.left = tooltip.element.offsetLeft;
      tooltip.offset.right = tooltip.element.offsetRight;
      tooltip.offset.height = tooltip.element.offsetHeight;
      tooltip.offset.width = tooltip.element.offsetWidth;
      tooltip.target.rect = tooltip.target.element.getBoundingClientRect();
      tooltip.target.offset.top = tooltip.target.element.offsetTop;
      tooltip.target.offset.bottom = tooltip.target.element.offseBottom;
      tooltip.target.offset.left = tooltip.target.element.offsetLeft;
      tooltip.target.offset.right = tooltip.target.element.offsetRight;
      tooltip.target.offset.height = tooltip.target.element.offsetHeight;
      tooltip.target.offset.width = tooltip.target.element.offsetWidth;
      tooltip.arrow = 'bottom';

      tooltip.position.top = tooltip.target.rect.top - tooltip.rect.height;
      tooltip.position.left = tooltip.target.rect.left + tooltip.target.rect.width / 2 - tooltip.rect.width / 2;

      if (tooltip.position.top < 0) {
        tooltip.position.top = tooltip.target.rect.top + tooltip.target.rect.height + 20;
        tooltip.arrow = 'top';
      }

      setTimeout(function () {
        console.log({ tooltip: tooltip });
        tooltip.element.style.top = tooltip.position.top + 'px';
        tooltip.element.style.left = tooltip.position.left + 'px';

        tooltip.element.classList.remove('syn-training-arrow-right');
        tooltip.element.classList.remove('syn-training-arrow-left');
        tooltip.element.classList.remove('syn-training-arrow-top');
        tooltip.element.classList.remove('syn-training-arrow-bottom');

        tooltip.element.classList.add('syn-training-arrow-' + tooltip.arrow);
      });
    }
  }, {
    key: 'next',
    value: function next() {
      this.setState({ cursor: this.state.cursor + 1 });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this = this;

      console.error('component did mount');
      if (typeof window !== 'undefined') {
        setTimeout(function () {
          var view = _react2['default'].findDOMNode(_this.refs.view);
          if (view) {
            view.classList.add('show');
          }
        }, 100);
        setTimeout(this.go.bind(this), 3000);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (typeof window !== 'undefined') {
        if (this.props.instructions[this.state.cursor]) {
          this.go();
        } else if (this.props.instructions.length) {
          this.close();
        }
      }
    }
  }, {
    key: 'close',
    value: function close() {
      var view = _react2['default'].findDOMNode(this.refs.view);
      view.classList.remove('show');
    }
  }, {
    key: 'render',
    value: function render() {
      var cursor = this.state.cursor;

      if (!this.props.instructions.length) {
        return _react2['default'].createElement('div', null);
      }

      var instructions = this.props.instructions;

      var current = instructions[cursor];

      if (!current) {
        return _react2['default'].createElement('div', { id: 'syn-training', ref: 'view' });
      }

      var title = current.title;
      var description = current.description;

      var text = 'Next';

      if (!instructions[cursor + 1]) {
        text = 'Finish';
      }

      return _react2['default'].createElement(
        'div',
        { id: 'syn-training', ref: 'view' },
        _react2['default'].createElement(
          'div',
          { className: 'syn-training-close' },
          _react2['default'].createElement(_utilIcon2['default'], { icon: 'times', onClick: this.close.bind(this) })
        ),
        _react2['default'].createElement(
          'h4',
          null,
          title
        ),
        _react2['default'].createElement(
          'div',
          { style: { marginBottom: '10px' } },
          description
        ),
        _react2['default'].createElement(
          _utilButton2['default'],
          { info: true, onClick: this.next.bind(this) },
          text
        )
      );
    }
  }]);

  return Training;
})(_react2['default'].Component);

exports['default'] = Training;
module.exports = exports['default'];