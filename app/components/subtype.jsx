'use strict';

import React from 'react';
import Loading from './util/loading';
import Panel from './panel';
import Item from './item';

class Subtype extends React.Component {
  constructor (props) {
    super(props);

    this.status = 'iddle';

    this.state = { panel : null, items : null };
  }

  componentWillReceiveProps (props) {
    if ( this.status === 'iddle' ) {
      this.status = 'ready';
      this.get();
    }
  }

  get () {
    if ( typeof window !== 'undefined' ) {
      window.socket.emit('get items', { type : this.props.item.subtype._id, parent : this.props.item._id })
        .on('OK get items', (panel, items) => {
          if ( panel.type === this.props.item.subtype._id ) {
            console.log('subtype', panel ,items);
            this.setState({ panel, items });
          }
        })
    }
  }

  toggleCreator (e) {
    e.preventDefault();

    let panel = React.findDOMNode(this.refs.panel);
    let toggle = panel.querySelector('.toggle-creator');

    toggle.click();
  }

  render () {
    let content = ( <Loading /> );

    if ( this.state.panel ) {
      let items = [];

      if ( this.state.items.length ) {
        items = this.state.items.map(item => (
          <Item key={ item._id } { ...this.props } item={ item } />
        ));
      }
      else {
        items = (
          <h5>
            <a href="#" onClick={ this.toggleCreator.bind(this) }>Click the + to be the first to add something here</a>
          </h5>
        );
      }

      content = [
        <Panel { ...this.props } { ...this.state.panel } title={ this.props.item.subtype.name } ref="panel" parent={ this.props.item }>
          { items }
        </Panel>
      ];
    }

    return (
      <section className={`item-subtype gutter-top ${this.props.className}`}>
        { content }
      </section>
    );
  }
}

export default Subtype;
