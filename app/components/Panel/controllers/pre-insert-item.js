! function () {
  
  'use strict';

  var Item =require('syn/components/Item/Controller');

  function preInsertItem (items, cb) {
    var self = this;

    /** Load template */

    if ( ! app.cache.get('/views/Item') ) {
      return new (require('syn/components/Item/Controller'))({}).load(app.domain.intercept(function (template) {
        self.preInsertItem(items, cb); 
      }));
    }

    /** Items to object */

    items = items.map(function (item) {
      item = new (require('syn/components/Item/Controller'))(item);

      item.load(app.domain.intercept(function (template) {

        // var img = template.find('.item-media img');
        // var loading = $('<i class="fa fa-refresh fa-5x fa-spin center block-center muted"></i>');

        // loading.insertAfter(img);

        // img.remove();

        self.find('items').append(template); 
      }));

      return item;
    });

    var i = 0;
    var len = items.length;

    function next () {
      i ++;

      if ( i === len && cb ) {
        cb();
      }
    }

    items.forEach(function (item) {
      item.render(app.domain.intercept(function (args) {
        next();  
      }));
    });
  }

  module.exports = preInsertItem;

} ();
