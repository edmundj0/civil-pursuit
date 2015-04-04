! function () {
  
  'use strict';

  var _ = {};

  _['panels']                 =       '.panels';
  _['topics panel']           =       '#panel-Topic';
  _['toggle']                 =       '.toggle-creator';
  _['creator']                =       'form.creator[name="create"][novalidate][role="form"][method="POST"]';
  _['submit']                 =       _['creator'] + ' .button-create';
  _['subject']                =       _['creator'] + ' input[name="subject"][required]';
  _['description']            =       _['creator'] + ' textarea[name="description"][required]';
  _['new item']               =       _['topics panel'] + ' .item.new';
  _['new item subject']       =       _['new item'] + ' .item-subject';
  _['new item description']   =       _['new item'] + ' .item-description';
  _['new item promotion']     =       _['new item'] + '>.item-collapsers>.promote';
  _['new item promoted subject']=       _['new item promotion'] + ' .items-side-by-side .subject.left-item'

  function __ (n) {
    return _[n];
  }

  if ( ! process.env.SYNAPP_SELENIUM_TARGET ) {
    throw new Error('Missing SYNAPP_SELENIUM_TARGET');
  }

  var User = require('../../business/models/User');

  require('mongoose').connect(process.env.MONGOHQ_URL);

  var stamp = Date.now();

  var subject = 'This is a test topic generated by Selenium ' + stamp;

  var description = 'This is a test topic generated by Selenium. This item has no reference and no image.';

  var testUser;

  module.exports = {
    "before": function (browser, done) { 
      User.disposable(function (error, user) {
        testUser = user;
        
        done();
      });
    },

    "Promote" : function (browser) {
      
      browser.url(process.env.SYNAPP_SELENIUM_TARGET);

      browser.setCookie({
        name     : "synuser",
        value    : JSON.stringify({ email: testUser.email, id: testUser._id }),
        secure   : false,
      }, function (res) {
        if ( res.state !== 'success' ) {
          throw new Error('Could not set cookie');
        }
      });

      browser.refresh();
        
      browser.waitForElementVisible(      'body', 1000,             "Page is ready")

        .assert.visible(__(               'panels'),                "There should be a panels container")
        .waitForElementVisible(__(        'topics panel'), 2500,    "There should be a top-level panel containing the topics")
        .assert.visible(__(               'toggle'),                "There should be a toggler for panel")
        .click(__(                        'toggle'))
        .waitForElementVisible(__(        'creator'), 1000,         "The creator panel should appear")
        .click(__(                        'submit'))
        .assert.cssClassPresent(__(       'subject'), 'error',      'After trying to create an empty topic, subject should show error')
        .setValue(__(                     'subject'),               subject)
        .click(__(                        'submit'))
        .assert.cssClassPresent(__(       'description'), 'error',  'After trying to create an empty topic, description should show error')
        .setValue(__(                     'description'),           description)
        .click(__(                        'submit'))
        .waitForElementVisible(__(        'new item'), 3500,        "Newly created item should appear")
        .assert.containsText(__(          'new item subject'), subject,             "Subject must be the same than the one created")
        .assert.containsText(__(          'new item description'), description,     "Description must be the same than the one created")
        .assert.visible(__(               'new item promotion'),    "There should be an evaluation cycle for the new item")
        .assert.containsText(__(          'new item promoted subject'), subject,     "Promoted subject must be the same than the one created")

        .pause(2500)
        
        .end();
    },

    "after": function (browser, done) {
      testUser.remove(done);
      require('mongoose').disconnect();
    }
  };

} ();

