'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoEs5 = require('cinco/es5');

var _synLibAppPage = require('syn/lib/app/Page');

var _synLibAppPage2 = _interopRequireDefault(_synLibAppPage);

var _synComponentsItemDefaultButtonsView = require('syn/components/ItemDefaultButtons/View');

var _synComponentsItemDefaultButtonsView2 = _interopRequireDefault(_synComponentsItemDefaultButtonsView);

var _synComponentsPromoteView = require('syn/components/Promote/View');

var _synComponentsPromoteView2 = _interopRequireDefault(_synComponentsPromoteView);

var _synComponentsDetailsView = require('syn/components/Details/View');

var _synComponentsDetailsView2 = _interopRequireDefault(_synComponentsDetailsView);

var Item = (function (_Element) {
  function Item(props, extra) {
    _classCallCheck(this, Item);

    _get(Object.getPrototypeOf(Item.prototype), 'constructor', this).call(this, '.item');

    this.attr('id', props.item ? 'item-' + props.item.id : '');

    this.props = props || {};

    this.extra = extra || {};

    this.add(this.media(), this.buttons(), this.text(), this.arrow(), this.collapsers(), new _cincoEs5.Element('.clear'));
  }

  _inherits(Item, _Element);

  _createClass(Item, [{
    key: 'media',
    value: function media() {
      var _this = this;

      return new _cincoEs5.Element('.item-media-wrapper').add(new _cincoEs5.Element('.item-media').add(function () {
        if (_this.props.item) {
          if (_this.props.item.media) {
            return _this.props.item.media;
          } else if (_this.props.item.image) {
            return new _cincoEs5.Element('img.img-responsive', {
              src: _this.props.item.image });
          }
        }

        return [];
      }));
    }
  }, {
    key: 'buttons',
    value: function buttons() {
      var _this2 = this;

      var itemButtons = new _cincoEs5.Element('.item-buttons').condition(function () {
        if ('buttons' in _this2.props) {
          return _this2.props.buttons !== false;
        }
        return true;
      });

      if (this.props.item && this.props.item.buttons) {
        itemButtons.add(this.props.item.buttons);
      } else {
        itemButtons.add(new _synComponentsItemDefaultButtonsView2['default'](this.props));
      }

      return itemButtons;
    }
  }, {
    key: 'subject',
    value: function subject() {
      var _this3 = this;

      return new _cincoEs5.Element('h4.item-subject.header').add(new _cincoEs5.Element('a', {
        href: function href(locals) {
          if (locals && locals.item) {
            return (0, _synLibAppPage2['default'])('Item Page', locals && locals.item);
          }
          return '#';
        }
      }).text(function () {
        if (_this3.props.item) {
          return _this3.props.item.subject;
        }
        return '';
      }));
    }
  }, {
    key: 'description',
    value: function description() {
      var _this4 = this;

      return new _cincoEs5.Element('.item-description.pre-text').text(function () {
        if (_this4.props.item) {
          return _this4.props.item.description;
        }
        return '';
      });
    }
  }, {
    key: 'references',
    value: function references() {
      return new _cincoEs5.Element('h5.item-reference').add(new _cincoEs5.Element('a', {
        href: '#',
        target: '_blank',
        rel: 'nofollow'
      }).text('reference'));
    }
  }, {
    key: 'text',
    value: function text() {
      return new _cincoEs5.Element('.item-text').add(new _cincoEs5.Element('.item-truncatable').add(this.subject(), this.references(), this.description()), new _cincoEs5.Element('.clear.clear-text'));
    }
  }, {
    key: 'collapsers',
    value: function collapsers() {
      var _this5 = this;

      return new _cincoEs5.Element('.item-collapsers').condition(function () {
        if (_this5.props.item && 'collapsers' in _this5.props.item) {
          return _this5.props.item.collapsers !== false;
        }

        return true;
      }).add(this.promote(), this.details(), this.below());
    }
  }, {
    key: 'promote',
    value: function promote() {
      return new _cincoEs5.Element('.promote.is-container').add(new _cincoEs5.Element('.is-section').add(new _synComponentsPromoteView2['default'](this.props)));
    }
  }, {
    key: 'below',
    value: function below() {
      return new _cincoEs5.Element('.children.is-container').add(new _cincoEs5.Element('.is-section'));
    }
  }, {
    key: 'details',
    value: function details() {
      return new _cincoEs5.Element('.details.is-container').add(new _cincoEs5.Element('.is-section').add(new _synComponentsDetailsView2['default'](this.props)));
    }
  }, {
    key: 'arrow',
    value: function arrow() {
      var _this6 = this;

      return new _cincoEs5.Element('.item-arrow').condition(function () {
        if (_this6.props.item) {
          return _this6.props.item.collapsers !== false;
        }
        return true;
      }).add(new _cincoEs5.Element('div').add(new _cincoEs5.Element('i.fa.fa-arrow-down')));
    }
  }]);

  return Item;
})(_cincoEs5.Element);

exports['default'] = Item;
module.exports = exports['default'];