'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _synLibUtilIsCloudinaryUrl = require('syn/lib/util/is/cloudinary-url');

var _synLibUtilIsCloudinaryUrl2 = _interopRequireDefault(_synLibUtilIsCloudinaryUrl);

try {
  require('syn/config');
  require('syn/country');
} catch (error) {}

var schema = {

  'email': {

    'type': String,
    'required': true,
    'index': {
      'unique': true
    }
  },

  'password': {

    'type': String,
    'required': true
  },

  'image': {

    'type': String,
    'validate': _synLibUtilIsCloudinaryUrl2['default']
  },

  /** twitter ID if any **/

  'twitter': String,

  /** Facebook ID if any **/

  'facebook': String,

  'first_name': String,

  'middle_name': String,

  'last_name': String,

  /** gps location **/

  'gps': {

    'type': [Number], // [<longitude>, <latitude>]
    'index': '2d'
  },

  /** Date when GPS was validate **/

  'gps validated': Date,

  // preferences

  'preferences': [new _mongoose.Schema({
    'name': String,
    'value': _mongoose.Schema.Types.Mixed
  })],

  /** Activation key */

  'activation_key': String,

  /** Activation URL */

  'activation_token': String,

  /** Race **/

  'race': [{

    'type': _mongoose.Schema.Types.ObjectId,
    'ref': 'Config.race'
  }],

  /** Marital status **/

  'married': {

    'type': _mongoose.Schema.Types.ObjectId,
    'ref': 'Config.married'
  },

  /** Employment **/

  'employment': {

    'type': _mongoose.Schema.Types.ObjectId,
    'ref': 'Config.employment'
  },

  /** Education **/

  'education': {

    'type': _mongoose.Schema.Types.ObjectId,
    'ref': 'Config.education'
  },

  /** Citizenship **/

  'citizenship': [{

    'type': _mongoose.Schema.Types.ObjectId,
    'ref': 'Country'
  }],

  'dob': Date,

  'gender': String, /** M for male, F for female */

  'registered_voter': Boolean,

  /** Political party **/

  'party': {

    'type': _mongoose.Schema.Types.ObjectId,
    'ref': 'Config.party'
  }
};

exports['default'] = schema;
module.exports = exports['default'];
/** Already imported **/