'use strict';

import {Element, Elements} from 'cinco/es5';
import config from 'syn/config.json';
import S from 'string';

class Scripts extends Elements {
  
  constructor (props) {
    super();
    this.props = props || {};
    this.add(
      this.globals(),
      this.socketIO(),
      this.jQuery(),
      this.jQueryPlugins(),
      this.app(),
      this.vex(),
      this.socketStream(),
      this.goalProgress(),
      this.d3(),
      this.c3()
    );
  }

  globals () {
    return new Element('script').text(() => {
      var synapp = { config: this.props.config, props: this.props };

      return 'window.synapp = ' + JSON.stringify(synapp);
    });
  }

  socketIO () {
    return new Element('script', { src : '/socket.io/socket.io.js' } );
  }

  socketStream () {
    return new Element('script', { src: '/js/socket.io-stream.js' });
  }

  jQuery () {
    return new Element('script', { src: () =>
      this.props.settings.env === 'production'
        ? config.jquery.cdn
        : '/bower_components/jquery/dist/jquery.js' });
  }

  jQueryPlugins  () {
    return new Element('script', { src: '/js/jQuery.b.js' });
  }

  app () {
    return new Element('script', { src: () => {
      var ext = '.js';

      var production = this.props.settings.env === 'production';

      if ( production ) {
        ext = '.min.js';
      }

      var page = this.props.page || 'home';

      return '/js/page-' + S(page).humanize().slugify().s + ext;
    }});
  }

  vex () {
    return new Element('script', { src : '/assets/vex-2.2.1/js/vex.combined.min.js' });
  }

  goalProgress () {
    return new Element('script', { src : '/bower_components/goalProgress/goalProgress.js' });
  }

  d3 () {
    return new Element('script', { src: () =>
      this.props.settings.env === 'production'
        ? '/bower_components/d3/d3.min.js'
        : '/bower_components/d3/d3.js' });
  }

  c3 () {
    return new Element('script', { src: () =>
      this.props.settings.env === 'production'
        ? '/bower_components/c3/c3.min.js'
        : '/bower_components/c3/c3.js' });
    }
}

export default Scripts;
