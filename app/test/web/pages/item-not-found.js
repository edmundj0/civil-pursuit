'use strict';

import should           from 'should';
import Milk             from '../../../lib/app/milk';
import config           from '../../../../config.json';
import LayoutTest       from '../components/layout';

class ItemNotFoundPage extends Milk {

  constructor (props) {
    props = props || {};

    let options = { viewport : props.viewport, vendor : props.vendor };

    super('Item Page not found', options);

    this

      .go('/item/not/found')

      .import(LayoutTest, {
        title   :   config.title.prefix + 'Item not found'
      })
    ;

    this.actors();

    this.stories();
  }

  actors () {

    this.set('Header', () => this.find('#main h1'));
    this.set('Text', () => this.find('#main p'));

  }

  stories () {

    this.ok(
      () => this.get('Header').text()
        .then(text => text.should.be.exactly('Item not found')),
      'Header should say "Item not found"'
    );

    this.ok(
      () => this.get('Text').text()
        .then(text => text.should.be.exactly('We are sorry, your request could not be fulfilled because no relevant results were found.')),
      'Text should say "We are sorry, your request could not be fulfilled because no relevant results were found."'
    );

  }

}

export default ItemNotFoundPage;
