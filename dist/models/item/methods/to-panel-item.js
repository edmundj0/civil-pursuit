'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _synConfigJson = require('syn/config.json');

var _synConfigJson2 = _interopRequireDefault(_synConfigJson);

var _synLibUtilToSlug = require('syn/lib/util/to-slug');

var _synLibUtilToSlug2 = _interopRequireDefault(_synLibUtilToSlug);

var _synLibGetHarmony = require('syn/lib/get-harmony');

var _synLibGetHarmony2 = _interopRequireDefault(_synLibGetHarmony);

var _synModelsType = require('syn/models/type');

var _synModelsType2 = _interopRequireDefault(_synModelsType);

var _synModelsUser = require('syn/models/user');

var _synModelsUser2 = _interopRequireDefault(_synModelsUser);

function toPanelItem(cb) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      var _ret = (function () {

        if (typeof cb === 'function') {
          return {
            v: ko(new Error('Deprecated use of toPanelItem with callback' + '! Please use Promise syntax now'))
          };
        }

        var ItemModel = _this.constructor;

        var _id = _this._id;
        var id = _this.id;
        var subject = _this.subject;
        var description = _this.description;
        var image = _this.image;
        var references = _this.references;
        var views = _this.views;
        var promotions = _this.promotions;

        var item = {
          _id: _id,
          id: id,
          subject: subject,
          description: description,
          image: image,
          references: references,
          views: views,
          promotions: promotions
        };

        item.image = item.image || _synConfigJson2['default']['public']['default item image'];
        item.imageHTML = _this.getImageHtml();
        item.popularity = _this.getPopularity();
        item.link = '/item/' + _this.id + '/' + (0, _synLibUtilToSlug2['default'])(_this.subject);

        var getType = function getType() {
          return new Promise(function (ok, ko) {
            _synModelsType2['default'].findById(_this.type).populate('harmony').exec()
            // .then(ok, ko);
            .then(function (type) {
              console.log('yeah got type', type);
              ok(type);
            }, ko);
          });
        };

        var getUser = function getUser() {
          return new Promise(function (ok, ko) {
            _synModelsUser2['default'].findById(_this.user).exec().then(function (user) {
              try {
                if (!user) {
                  throw new Error('User not found: ' + _this.user);
                }
                var gps = user.gps;
                var _id2 = user._id;

                ok({ 'full name': user.fullName, gps: gps, _id: _id2 });
              } catch (error) {
                ko(error);
              }
            }, ko);
          });
        };

        var getSubtype = function getSubtype() {
          return new Promise(function (ok, ko) {
            _synModelsType2['default'].findOne({ parent: _this.type }).exec().then(ok, ko);
          });
        };

        var countChildren = function countChildren() {
          return new Promise(function (ok, ko) {
            ItemModel.count({ parent: _this._id }, function (error, count) {
              if (error) {
                return ko(error);
              }
              ok(count);
            });
          });
        };

        var getHarmony = function getHarmony(item) {
          return new Promise(function (ok, ko) {
            console.log('harmony', item.type);

            var harmony = item.type.harmony;

            var promises = harmony.map(function (side) {
              new Promise(function (ok, ko) {
                ItemModel.where({
                  parent: item._id,
                  type: side._id
                }).count(function (error, count) {
                  if (error) {
                    return ko(error);
                  }
                  ok(count);
                });
              });
            });

            Promise.all(promises).then(function (results) {
              var _results = _slicedToArray(results, 2);

              var pro = _results[0];
              var con = _results[1];

              ok((0, _synLibGetHarmony2['default'])(pro, con));
            }, ko);
          });
        };

        Promise.all([_this.getLineage(), getType(), getUser(), getSubtype(), countChildren()]).then(function (results) {
          try {
            var _results2 = _slicedToArray(results, 5);

            item.lineage = _results2[0];
            item.type = _results2[1];
            item.user = _results2[2];
            item.subtype = _results2[3];
            item.children = _results2[4];

            if (!item.type.harmony.length) {
              return ok(item);
            }

            getHarmony(item).then(function (harmony) {
              item.harmony = harmony;
              ok(item);
            }, ko);
          } catch (error) {
            ko(error);
          }
        }, ko);
      })();

      if (typeof _ret === 'object') return _ret.v;
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = toPanelItem;
module.exports = exports['default'];