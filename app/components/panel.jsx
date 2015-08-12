'use strict';

import React                from 'react';
import Component            from '../lib/app/component';
import Icon                 from './util/icon';
import Accordion            from './util/accordion';
import Creator              from './creator';

class Panel extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      showCreator : false
    };
  }

  componentWillReceiveProps (props) {
    // console.warn('panel', props);
  }

  toggleCreator () {
    this.setState({ showCreator : ! this.state.showCreator });
  }

  render() {
    let creator, creatorIcon, newItem;

    if ( this.props.creator !== false ) {
      creator = (
        <Accordion show={ this.state.showCreator }>
          <Creator { ...this.props } />
        </Accordion>
      );
      creatorIcon = ( <Icon icon="plus" onClick={ this.toggleCreator.bind(this) } /> );
    }

    if ( this.props.newItem ) {
      let relevant = false;

      if ( this.props.newItem.panel.type === this.props.type ) {
        relevant = true;
      }

      if ( relevant ) {
        newItem = ( <Item item={ this.props.newItem.item } new={ true } /> );
      }
    }

    return (
      <section className={ Component.classList(this, "syn-panel") }>
        <section className="syn-panel-heading">
          <h4>{ this.props.title }</h4>
          { creatorIcon }
        </section>
        <section className="syn-panel-body">
          { creator }
          { newItem }
          { this.props.children }
        </section>
      </section>
    );
  }
}

export default Panel;

import Item from './item';
