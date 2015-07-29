'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function setRegisteredVoter(userId, isRegisteredVoter) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      _this.findById(userId).exec().then(function (user) {
        try {
          if (!user) {
            throw new Error('No such user ' + userId);
          }
          user.registered_voter = isRegisteredVoter;
          user.save(function (error) {
            if (error) {
              ko(error);
            } else {
              ok(user);
            }
          });
        } catch (error) {}
      }, ko);
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = setRegisteredVoter;
module.exports = exports['default'];