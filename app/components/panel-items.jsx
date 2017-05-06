'use strict';

import React              from 'react';
import Panel              from './panel';
import Loading            from './util/loading';
import Link               from './util/link';
import panelType          from '../lib/proptypes/panel';
import makePanelId        from '../lib/app/make-panel-id';
import Join               from './join';
import Accordion          from './util/accordion';
import Promote            from './promote';
import EvaluationStore    from './store/evaluation';
import ItemButtons        from './item-buttons';
import Icon               from './util/icon';
import Creator            from './creator';
import ItemStore          from '../components/store/item';
import Details            from './details';
import DetailsStore       from './store/details';
import EditAndGoAgain     from './edit-and-go-again';
import Harmony            from './harmony';
import TypeComponent      from './type-component';
import config             from '../../public.json';

class PanelItems extends React.Component {

  static propTypes  =   {
    panel           :   panelType
  };

  new = null;

  mountedItems = {};

  state = { active : { item : null, section : null }
          };

  constructor(props){
    super(props);
    if(this.props.uim && this.props.uim.toParent) { 
      this.props.uim.toParent({type: "SET_ACTION_TO_STATE", function: this.actionToState.bind(this) })
      this.props.uim.toParent({type: "SET_TO_CHILD", function: this.toMeFromParent.bind(this), name: "PanelItems" })
    }
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //componentDidMount () {
  //  this.props.emitter.on('show', this.show.bind(this));
 // }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //componentWillUnmount () {
  //  this.props.emitter.removeListener('show', this.show.bind(this));
 // }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidUpdate () {
 //   if ( this.props.new ) {
 //     if ( this.props.new._id !== this.new ) {
 //       this.new = this.props.new._id;
 //       this.toggle(this.props.new._id, 'promote');
 //     }
 //   }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  loadMore (e) {
    e.preventDefault();

    // window.Dispatcher.emit('get items', this.props.panel);
  }

  toggleCreator(){
    if(this.props.uim && this.props.uim.toParent) this.uim.toParent({type: "TOGGLE_CREATOR"});
  }

  toChild=[];  // toChild keeps track of the toChild func for each child item
  actionToState (action, uim) {
    var nextUIM={}; 
    logger.info("PanelItems.actionToState",{action},{uim});
    if(action.type==="CHILD_SHAPE_CHANGED"){
      let ash=action.shape, ush=uim.shape;
      if(!action.itemId) logger.error("PanelItems.actionToState action without itemId", action)
      var ooview=false;
      if(this.props.panel && this.props.panel.type && this.props.panel.type.visualMethod && this.props.panel.type.visualMethod ==="ooview") ooview=true;

      if(action.distance===1) { //if this action is from an immediate child 
        if(ush==='open' && ash==='open') { // panel is alread open and item is open
            if(action.itemId !== uim.itemId) { // changing from one child open to another
              if(uim.itemId) this.toChild[uim.itemId]({type: 'CHANGE_SHAPE',shape: 'truncated'});
              else logger.error("PanelItems.actionToState uim.itemId null", {action},{uim} );
              this.toChild[action.itemId]({type: 'CHANGE_SHAPE', shape: 'open'});
              Object.assign(nextUIM, uim, {itemId: action.itemId});
            } else // no update required
              Object.assign(nextUIM, uim);
        } else if(ush==='open' && ash==='truncated') { // panel is open child is changing to truncated, show all the other children
            if(action.itemId === uim.itemId) { // it's the one that was previously open
              Object.keys(this.toChild).forEach(childId=>{
                if(childId===action.itemId) return;// no need to change the one that changed to truncated
                else this.toChild[childId]({type: 'CHANGE_SHAPE', shape: 'truncated'})
              });
              Object.assign(nextUIM, uim, {shape: 'truncated', itemId: null});
            } else // else ignore it
              Object.assign(nextUIM, uim);
        } else if(ush==='truncated' && ash==='open'){ // panel is truncated and action is to open an item
            Object.keys(this.toChild).forEach(childId=>{
                if(childId===action.itemId) return;// no need to change the one that changed to open
                else this.toChild[childId]({type: 'CHANGE_SHAPE', shape: 'collapsed'});
            });
            Object.assign(nextUIM, uim, {shape: 'open', itemId: action.itemId});
        } else {
          logger.info("PanelItems.actionToState falling through", {action}, {uim})
          Object.assign(nextUIM, uim); // no change necessary
        }
      }else{ // it's not my child that changed shape
        logger.info("PanelItems.actionToState it's not my child that changed shape")
        if(ooview && ash==='open'){
          Object.assign(nextUIM, uim, {shape: 'collapsed', itemId: action.itemId});
        } else if (ooview && ash==='truncated') {
          Object.assign(nextUIM, uim, {shape: 'truncated', itemId: null});
        } else Object.assign(nextUIM, uim); // no change to shape
      }
    } else if(action.type==="TOGGLE_CREATOR"){
      if(ush!=='creator') Object.assign(nextUIM, uim, {shape: 'creator'});
      else  Object.assign(nextUIM,uim, {shape: 'truncated'});
    } else return null; // don't know this action, null so the default methods can have a shot at it
    logger.info("PanelItems.actionToState return", {nextUIM})
    return nextUIM;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // this is a one to many pattern for the user Interface Manager, handle each action  appropriatly
  //
    toMeFromParent(action) {
        logger.info("PanelItems.toMeFromParent", action);
        if (action.type==="ONPOPSTATE") {
            var {shape, itemId} = action.event.state.stateStack[this.props.uim.depth];
            if(shape==='open' && itemId && (action.event.state.stateStack.length > (this.props.uim.depth+1)) && this.toChild[itemId]) this.toChild[itemId](action); // send the action to the active child
        } else if(action.type=="CLEAR_PATH") {  // clear the path and reset the UIM state back to what the const
          Object.keys(this.toChild).forEach(childId=>{ // send the action to every child
            this.toChild[childId](action)
          });
        } else logger.error("PanelItems.toMeFromParent action type unknown not handled", action)
    }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // this is a one to many pattern for the user interface manager, yourself between the UIM and each child
  // send all unhandled actions to the parent UIM
  //
  toMeFromChild(itemId, action) {
    logger.info("PanelItems.toMeFromChild", itemId, action);

    if(action.type==="SET_TO_CHILD" ) { // child is passing up her func
      this.toChild[itemId] = action.function; // don't pass this to parent
    } else if(this.props.uim && this.props.uim.toParent) {
       action.itemId=itemId; // actionToState may need to know the child's id
       return(this.props.uim.toParent(action));
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {

    const { panel, count, user, emitter, uim } = this.props;

    let title = 'Loading items', name, loaded = false, content, loadMore,
      type, parent, creator;

    let bgc='white';

    if ( panel ) {
      loaded = true;

      type = panel.type;
      parent = panel.parent;

      title = type.name;

      if ( ! panel.items.length && ! ( panel.type && panel.type.createMethod==='hidden') ) {
        content = (
          <div className={`syn-panel-gutter text-center vs-${uim.shape}`}>
            <a href="#" onClick={ this.toggleCreator.bind(this) } className="click-to-create">
              Click the + to be the first to add something here
            </a>
          </div>
        );
      }

      else {
        content = panel.items
          .map(item => {
            let shape='truncated';
            if(panel.items.length===1 && uim && uim.shape==='truncated') shape='open';  // if there is only one item and in the list and the panel is 'truncated' then render it open
            var itemUIM={shape: shape, depth: this.props.uim.depth, toParent: this.toMeFromChild.bind(this, item._id)};  // inserting me between my parent and my child
            return (
              <ItemStore item={ item } key={ `item-${item._id}` }>
                <Item
                  item    =   { item }
                  user    =   { user }
                  panel = { panel }
                  uim = { itemUIM }
                  hideFeedback = {this.props.hideFeedback}
                  buttons={['Promote','Details','Harmony','Subtype']}
                  style   = {{backgroundColor: bgc}}
                />
              </ItemStore>
            );
          });

        const { skip, limit } = panel;

        const end = skip + limit;

 //       if ( count > limit ) {
 //         loadMore = (
 //           <h5 className="gutter text-center">
 //             <a href="#" onClick={ this.loadMore.bind(this) }>Show more</a>
 //           </h5>
 //         );
 //       }
      }

      let creatorPanel;

        creatorPanel = (
          <Creator
            type    =   { type }
            parent  =   { parent }
            toggle  =   { this.toggleCreator.bind(this) }
            />
        );

      creator = (
        <Accordion
          active    =   { (uim && uim.shape === 'creator') }
          style   = {{backgroundColor: bgc}}
          >
          { creatorPanel }
        </Accordion>
      );
    }

    return (
        <Panel
          uim = {uim}
          heading     =   {[
            ( <h4>{ title }</h4> ), ( type && type.createMethod=="hidden" && !(user && user.id && parent && parent.user && parent.user._id && (user.id == parent.user._id) )) ? (null) : 
            (
              <Icon
                icon        =   "plus"
                className   =   "toggle-creator"
                onClick     =   { this.toggleCreator.bind(this) }
              />
            )
          ]}
          >
          { creator }
          { content }
          { loadMore }
        </Panel>
    );
  }
}

export default PanelItems;
export {PanelItems};

import Item from './item';

