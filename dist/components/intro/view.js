'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  INTRO VIEW
 *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  @module       views/Intro
*/

var _cincoDist = require('cinco/dist');

var _componentsPanelView = require('../../components/panel//view');

var _componentsPanelView2 = _interopRequireDefault(_componentsPanelView);

var _componentsItemView = require('../../components/item/view');

var _componentsItemView2 = _interopRequireDefault(_componentsItemView);

var Intro = (function (_Element) {
  function Intro(props) {
    _classCallCheck(this, Intro);

    _get(Object.getPrototypeOf(Intro.prototype), 'constructor', this).call(this, Intro.selector);

    this.props = props;

    this.add(function () {
      var panel = new _componentsPanelView2['default']({ creator: false });

      panel.find('.items').get(0).add(new _componentsItemView2['default']({
        buttons: false, collapsers: false
      }));

      return panel;
    });
  }

  _inherits(Intro, _Element);

  return Intro;
})(_cincoDist.Element);

Intro.selector = '#intro';

exports['default'] = Intro;
module.exports = exports['default'];