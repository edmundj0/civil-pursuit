'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsItem = require('../models/item');

var _modelsItem2 = _interopRequireDefault(_modelsItem);

var _modelsType = require('../models/type');

var _modelsType2 = _interopRequireDefault(_modelsType);

function getIntro(event) {
  var _this = this;

  try {
    if (typeof this.error !== 'function') {
      throw new Error('Missing error catcher');
    }

    if (typeof this.ok !== 'function') {
      throw new Error('Missing ok returner');
    }

    _modelsType2['default'].findOne({ name: 'Intro' }).exec().then(function (intro) {
      try {
        if (!intro) {
          return _this.error(new Error('Intro type not found'));
        }
        _modelsItem2['default'].findOne({ type: intro._id }).exec().then(function (intro) {
          try {
            if (!intro) {
              return _this.error(new Error('Intro item not found'));
            }
            intro.toPanelItem().then(function (intro) {
              try {
                _this.ok(event, intro);
              } catch (error) {
                _this.error.bind(_this);
              }
            }, _this.error.bind(_this));
          } catch (error) {
            _this.error(error);
          }
        }, _this.error.bind(_this));
      } catch (error) {
        _this.error(error);
      }
    }, this.error.bind(this));
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = getIntro;
module.exports = exports['default'];