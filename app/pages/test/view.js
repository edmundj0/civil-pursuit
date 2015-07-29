'use strict';

import Layout       from '../../components/layout/view';
import { Element }  from 'cinco/dist';

class PageNotFound extends Layout {
  constructor(props) {
    props = props || {};

    let title = props.settings.env === 'development' ? 'Test' : 'Page not found';

    props.title = props.title || title;

    super(props);

    var main = this.find('#main').get(0);

    if ( props.settings.env === 'development' ) {
      main.add(
        new Element('h1.gutter').text(props.title),
        new Element('hr'),
        new Element('h2.gutter').add(
          new Element('small.number-of-pages').text('0'),
          new Element('span').text(' Pages')
        ),
        new Element('table.test-pages').add(
          new Element('thead').add(
            new Element('tr').add(
              new Element('th').text('Name')
            )
          ),
          new Element('tbody')
        )
      );
    }

    else {
      main.add(
        new Element('h1.gutter.warning').text(props.title),
        new Element('p.gutter').text(
          'We are sorry, your request could not be fulfilled because no relevant results were found.'),
        new Element('hr')
      );
    }
  }
}

export default PageNotFound;
