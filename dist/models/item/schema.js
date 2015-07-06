'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _libUtilIsUrl = require('../../lib/util/is/url');

var _libUtilIsUrl2 = _interopRequireDefault(_libUtilIsUrl);

var _libUtilIsLesserThan = require('../../lib/util/is/lesser-than');

var _libUtilIsLesserThan2 = _interopRequireDefault(_libUtilIsLesserThan);

try {
  require('../../models/type');
  require('../../models/user');
} catch (error) {}

var schema = {

  'id': {

    'type': String,
    'len': 5,
    // "required"        :   true,
    'index': {
      'unique': true
    }
  },

  'image': {

    'type': String },

  'references': [{

    'url': {

      'type': String,
      'validate': _libUtilIsUrl2['default']
    },

    'title': String
  }],

  'subject': {

    'type': String,
    // "required"        :   true,
    'validate': (0, _libUtilIsLesserThan2['default'])(255)
  },

  'description': {

    'type': String,
    'required': true,
    'validate': (0, _libUtilIsLesserThan2['default'])(5000)
  },

  'type': {

    'type': _mongoose.Schema.Types.ObjectId,
    'required': true,
    'ref': 'Type'
  },

  'parent': {

    'type': _mongoose.Schema.Types.ObjectId,
    'ref': 'Item',
    'index': true
  },

  // When created from another item

  'from': {
    'type': _mongoose.Schema.Types.ObjectId,
    'ref': 'Item',
    'index': true
  },

  'user': {
    'type': _mongoose.Schema.Types.ObjectId,
    'ref': 'User',
    'required': true,
    'index': true
  },

  // The number of times Item has been promoted

  'promotions': {

    'type': Number,
    'index': true,
    'default': 0
  },

  // The number of times Item has been viewed

  'views': {

    'type': Number,
    'index': true,
    'default': 0
  }

};

exports['default'] = schema;
module.exports = exports['default'];

/** Already imported **/

// "validate"        :   isCloudinaryUrl