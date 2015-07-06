'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _componentsItemCtrl = require('../../../components/item/ctrl');

var _componentsItemCtrl2 = _interopRequireDefault(_componentsItemCtrl);

function created(item) {
  console.log('created item', item);

  var d = this.domain;

  this.parent.find('.create-new').hide();

  if (this.packaged.upload) {
    item.upload = this.packaged.upload;
  }

  if (this.packaged.youtube) {
    item.youtube = this.packaged.youtube;
  }

  item = new _componentsItemCtrl2['default']({ item: item });

  var items = this.panelContainer.find('items');

  item.load();

  console.log('inserting', item);

  item.template.addClass('new');
  items.prepend(item.template);
  item.render(d.intercept(function () {
    item.find('toggle promote').click();
  }));
}

exports['default'] = created;
module.exports = exports['default'];