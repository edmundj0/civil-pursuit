'use strict';

import React from 'react';
import Accordion from 'react-proactive-accordion';
import Icon from '../util/icon';
import ItemStore from '../store/item';
import PanelStore from '../store/panel';
import config from '../../../public.json';
import { ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path';
import Item from '../item';
//import {RASPPanelItems} from '../panel-items';
import PanelHead from '../panel-head';

class RASPPanelItems extends ReactActionStatePathClient {

    constructor(props) {
        super(props, 'shortId', 1);  // shortId is the key for indexing to child RASP functions, debug is on
        if (props.type && props.type.name && props.type.name !== this.title) { this.title = props.type.name; this.props.rasp.toParent({ type: "SET_TITLE", title: this.title }); } // this is for pretty debugging
        let visMeth = this.props.visualMethod || this.props.type && this.props.type.visualMethod || 'default';
        if (!(this.vM = this.visualMethods[visMeth])) {
            console.error("PanelItems.constructor visualMethod unknown:", visMeth)
            this.vM = this.visualMethods['default'];
        }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    loadMore(e) {
        e.preventDefault();

        // window.Dispatcher.emit('get items', this.props.panel);
    }

    actionToState(action, rasp, source, defaultRASP) {
        var nextRASP = {}, delta = {};
        //onsole.info("PanelItems.actionToState", this.childName, this.childTitle, ...arguments);
        if (action.type === "TOGGLE_CREATOR") {
            if (rasp.creator) {// it's on so toggle it off
                delta.creator = false;
            } else { // it's off so toggle it on
                delta.creator = true;
                if (rasp.shortId) {//there is an item that's open
                    this.toChild[rasp.shortId]({ type: "RESET_SHAPE" });
                    delta.shortId = null;
                }
            }
            this.qaction(() => this.props.rasp.toParent({ type: delta.creator ? "DECENDANT_FOCUS" : "DECENDANT_UNFOCUS" }), 0);
        } else if (action.type === "ITEM_DELVE") {
            if (rasp.shortId) {
                var nextFunc = () => this.toChild[rasp.shortId](action);
                if (this.toChild[rasp.shortId]) nextFunc(); // update child before propogating up
                else this.waitingOn = { nextRASP: Object.assign({}, rasp), nextFunc: nextFunc };
            }
        } else if (action.type === "SHOW_ITEM") {
            if (!this.props.items.some(item => item._id === action.item._id)) { // if the new item is not in the list
                this.props.items.push(action.item);
            }
            delta.shortId = action.item.id;
        } else if (action.type=== "CHILD_UPDATE"){
            if(this.toChild[action.shortId]) this.toChild[action.shortId](action);
            return rasp; // there is no state change here
        } else if (this.vM.actionToState(action, rasp, source, defaultRASP, delta)) {
            ; //then do nothing - it's been done if (action.type==="DECENDANT_FOCUS") {
        } else
            return null; // don't know this action, null so the default methods can have a shot at it

        Object.assign(nextRASP, rasp, delta);
        this.vM.deriveRASP(nextRASP, defaultRASP)
        return nextRASP;
    }

    // set the state from the pathSegment. 
    // the shortId is the path segment
    segmentToState(action, initialRASP) {
        var nextRASP = {};
        var parts = action.segment.split(',');
        parts.forEach(part => {
            if (part === 'd') nextRASP.decendantFocus = true;
            else if (part.length === 5) nextRASP.shortId = part;
            else console.error("PanelItems.segmentToState unexpected part:", part);
        })
        this.vM.deriveRASP(nextRASP, initialRASP);
        if (nextRASP.pathSegment !== action.segment) console.error("PanelItems.segmentToAction calculated path did not match", action.pathSegment, nextRASP.pathSegment)
        return { nextRASP, setBeforeWait: true }
    }

    // this is just for debugging, to make the trace output easier to follow - associate the panel name to the output
    componentWillReceiveProps(newProps) {
        if (newProps.type && newProps.type.name && newProps.type.name !== this.title) { this.title = newProps.type.name; this.props.rasp.toParent({ type: "SET_TITLE", title: this.title }); } // this is for pretty debugging
        let oldLength = this.props.items && this.props.items.length || 0;
        if (newProps.items && (newProps.items.length > oldLength)) {  // if the length changes, history needs to be updated
            //onsole.info("PanelItems.componentWillReceiveProps length change", oldLength, "->", newProps.items.length)
            this.qaction(() => {
                this.props.rasp.toParent({ type: "CHILD_STATE_CHANGED", length: newProps.items.length })
            }, 0)
        }
        let visMeth = newProps.visualMethod || newProps.type && newProps.type.visualMethod || 'default';
        if (!(this.vM = this.visualMethods[visMeth])) {
            console.error("PanelItems.componentWillReceiveProps visualMethod unknown:", visMeth)
            this.vM = this.visualMethods['default'];
        }
    }

    visualMethods = {
        default: {
            // whether or not to show items in this list.  
            childActive: (rasp, item) => {
                return (rasp.shortId === item.id) || (rasp.shape !== 'open' && rasp.shape !== 'title')
            },
            // the shape to give child items in the Panel
            childShape: (rasp, item) => {
                return (rasp.shortId === item.id ? 'open' : (rasp.shape !== 'open' && rasp.shape !== 'title') ? rasp.shape : 'truncated')
            },
            childVisualMethod: () => undefined,
            // process actions for this visualMethod
            actionToState: (action, rasp, source, initialRASP, delta) => {
                if (action.type === "DECENDANT_FOCUS" && action.distance === 1) {
                    if (action.shortId) { // a child is opening
                        if (rasp.shortId && rasp.shortId !== action.shortId) // if a different child is already open, reset the SHAPE of the current child
                            this.toChild[rasp.shortId]({ type: "RESET_SHAPE" });
                        delta.shortId = action.shortId; // the new child will be open
                    }
                } else if (action.type === "DECENDANT_UNFOCUS" && action.distance === 1) {
                    if (rasp.shortId) {
                        delta.shortId = false;
                    }
                } else
                    return false;
                return true;
            },
            // derive shape and pathSegment from the other parts of the RASP
            deriveRASP: (rasp, initialRASP) => {
                rasp.shape = rasp.shortId ? 'open' : 'truncated';
                let parts = [];
                if (rasp.decendantFocus) parts.push('d');
                if (rasp.shortId) parts.push(rasp.shortId);
                if (rasp.shortId && rasp.shortId.length !== 5) console.error("PanelItems.visualMethod[default].deriveRASP shortId length should be 5, was", rasp.shortId.length);
                if (parts.length) rasp.pathSegment = parts.join(',');
                else rasp.pathSegment = null;
            }
        },
        ooview: {
            childActive: (rasp, item) => {
                return (rasp.shortId === item.id) || (rasp.shape !== 'open' && rasp.shape !== 'title')
            },
            childShape: (rasp, item) => {
                return (rasp.shortId === item.id ? 'open' : (rasp.shape !== 'open' && rasp.shape !== 'title') ? rasp.shape : 'truncated')
            },
            childVisualMethod: () => 'ooview',
            actionToState: (action, rasp, source, initialRASP, delta) => {
                if (action.type === "DECENDANT_FOCUS" && action.distance === 1) {
                    if (!action.shortId) logger.error("PanelItems.actionToState action without shortId", action)
                    if (action.shortId) { // a child is opening
                        if (rasp.shortId && rasp.shortId !== action.shortId) // if a different child is already open, reset the SHAPE of the current child
                            this.toChild[rasp.shortId]({ type: "RESET_SHAPE" });
                        delta.shortId = action.shortId; // the new child will be open
                    }
                } else if (action.type === "DECENDANT_FOCUS" && action.distance > 1) {
                    delta.decendantFocus = true;
                } else if (action.type === "DECENDANT_UNFOCUS" && action.distance === 1) {
                    if (rasp.shortId) this.toChild[rasp.shortId]({ type: "RESET_SHAPE" })
                    delta.shortId = null;
                    delta.decendantFocus = false;
                } else if ((action.type === "FOCUS") || (action.type === "TOGGLE_FOCUS" && !rasp.focus) || (action.type === "FOCUS_STATE")) {
                    delta.focus = true;
                    delta.decendantFocus = false;
                    if (rasp.shortId) this.toChild[rasp.shortId]({ type: "RESET_SHAPE" });
                    delta.shortId = null;
                    if (action.state !== "FOCUS_STATE") this.qaction(() => this.props.rasp.toParent({ type: "DECENDANT_FOCUS" }), 0);
                } else if ((action.type === "UNFOCUS") || (action.type === "TOGGLE_FOCUS" && rasp.focus) || (action.type === "UNFOCUS_STATE")) {
                    delta.focus = false;
                    delta.decendantFocus = false;
                    if (action.type !== "UNFOCUS_STATE") this.qaction(() => this.props.rasp.toParent({ type: "DECENDANT_UNFOCUS" }), 0)
                } else
                    return false;
                return true;
            },
            // derive shape and pathSegment from the other parts of the RASP
            deriveRASP: (rasp, initialRASP) => {
                rasp.shape = rasp.shortId ? (rasp.decendantFocus ? 'title' : 'open') : 'truncated';
                let parts = [];
                if (rasp.decendantFocus) parts.push('d');
                if (rasp.shortId) parts.push(rasp.shortId);
                if (rasp.shortId && rasp.shortId.length !== 5) console.error("PanelItems.visualMethods[default].deriveRASP shortId length should be 5, was", rasp.shortId.length);
                if (parts.length) rasp.pathSegment = parts.join(',');
                else rasp.pathSegment = null;
            }
        },
        titleize: {
            childActive: (rasp, item) => {
                return (rasp.shortId === item.id) || (!rasp.shortId)
            },
            childShape: (rasp, item) => {
                return (rasp.shortId === item.id ? 'open' : ((rasp.decendantFocus || rasp.focus) ? 'truncated' : 'title'))
            },
            childVisualMethod: () => 'titleize',
            actionToState: (action, rasp, source, initialRASP, delta) => {
                if (action.type === "DECENDANT_FOCUS") {
                    if (action.distance >= 0) {
                        delta.decendantFocus = true;
                        delta.focus = true;
                        if (!rasp.focus) {
                            this.props.items.forEach(item => this.toChild[item.id]({ type: "VM_TITLEIZE_ITEM_UNTITLEIZE" }));
                        }
                    }
                } else if (action.type === "DECENDANT_UNFOCUS") {
                    if (action.distance === 1 && rasp.decendantFocus) delta.decendantFocus = false;
                    //if (action.distance===1) {
                    //  delta.focus=false;
                    //  if(rasp.focus){
                    //    this.props.items.forEach(item=>this.toChild[item.id]({type: "VM_TITLEIZE_ITEM_TITLEIZE"}));
                    //  }
                    //}
                } else if ((action.type === "FOCUS") || (action.type === "TOGGLE_FOCUS" && !rasp.focus) || (action.type === "FOCUS_STATE")) {
                    delta.focus = true;
                    if (!rasp.focus) {
                        this.props.items.forEach(item => this.toChild[item.id]({ type: "VM_TITLEIZE_ITEM_UNTITLEIZE" }));
                    }
                    if (action.state !== "FOCUS_STATE") this.qaction(() => this.props.rasp.toParent({ type: "DECENDANT_FOCUS" }), 0);
                } else if ((action.type === "UNFOCUS") || (action.type === "TOGGLE_FOCUS" && rasp.focus) || (action.type === "UNFOCUS_STATE")) {
                    delta.focus = false;
                    delta.decendantFocus = false;
                    if (rasp.focus) {
                        this.props.items.forEach(item => this.toChild[item.id]({ type: "VM_TITLEIZE_ITEM_TITLEIZE" }));
                    }
                    if (action.type !== "UNFOCUS_STATE") this.qaction(() => this.props.rasp.toParent({ type: "DECENDANT_UNFOCUS" }), 0)
                } else
                    return false; // action has not been processed continute checking
                action.toBeContinued = true; // supress shape_changed events
                return true; // action has been processed
            },
            // derive shape and pathSegment from the other parts of the RASP
            deriveRASP: (rasp, initialRASP) => {
                rasp.shape = rasp.decendantFocus ? (rasp.shortId ? 'open' : 'truncated') : (rasp.focus ? 'truncated' : 'title'); //if something hapens with a decendant, display the list as open or truncated. otherwise it's titleized.
                let parts = [];
                if (rasp.decendantFocus) parts.push('d');
                if (rasp.shortId) parts.push(rasp.shortId);
                if (rasp.shortId && rasp.shortId.length !== 5) console.error("PanelItems.visualMethods[default].deriveRASP shortId length should be 5, was", rasp.shortId.length);
                if (parts.length) rasp.pathSegment = parts.join(',');
                else rasp.pathSegment = null;
            }
        }
    }

    mounted = [];  // we render items and store them in this array.  No need to rerender them every time
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {

        const { limit, skip, type, parent, items, count, rasp, createMethod, cssName, panel, ...otherProps } = this.props;
        delete otherProps['new']; // this is a bad name for a property

        let title = 'Loading items', name, content, loadMore;

        let bgc = 'white';

        var buttons = type.buttons || ['Promote', 'Details', 'Harmony', 'Subtype'];

        content = items.map(item => {
            if (!this.mounted[item.id] || (this.mounted[item.id].answerCount !== item.answerCount)) { // only render this once
                this.mounted[item.id] = ({
                    content:
                    <ItemStore item={item} key={`item-${item._id}`}>
                        <Item
                            {...otherProps}
                            parent={parent}
                            rasp={this.childRASP(this.vM.childShape(rasp, item), item.id)}
                            buttons={buttons}
                            style={{ backgroundColor: bgc }}
                            visualMethod={this.vM.childVisualMethod()}
                        />,
                  </ItemStore>,
                    answerCount: item.answerCount
                });
            }
            return (
                <Accordion active={this.vM.childActive(rasp, item)} name='item' key={item._id + '-panel-item'}>
                    {this.mounted[item.id].content}
                </Accordion>
            );
        });

        const end = skip + limit;

        //       if ( count > limit ) {
        //         loadMore = (
        //           <h5 className="gutter text-center">
        //             <a href="#" onClick={ this.loadMore.bind(this) }>Show more</a>
        //           </h5>
        //         );
        //       }

        return (
            <section>
                {content}
                {loadMore}
            </section>
        );
    }
}

class AnswerCount extends React.Component {
    constructor(props) {
        super(props);
        this.updateSort(props);
        this.state = { sortedItems: [], answeredAll: false };
    }

    index = [];

    updateSort(props) {
        let parentId;
        if (parentId = ((props.parent && props.parent._id) || (props.panel && props.panel.parent && props.panel.parent._id) || props.parent || (props.panel && props.panel.parent))) {
            window.socket.emit("get qvote item parent count", parentId, this.okGetQVoteItemParentCount.bind(this))
            props.panel.items.forEach((item, i) =>{
                 this.index[item._id] = item; // indexify the items
                 if(typeof item.answeredAll === 'undefined') item.answeredAll=false;
                 if(typeof item.answerCount === 'undefined') item.answerCount=0;
            })
        }
    }

    componentWillReceiveProps(newProps) {
        if (!newProps.panel || !newProps.panel.items) return;
        if (!this.props.panel) return this.updateSort(newProps);
        if ((newProps.panel.items !== this.props.panel.items) || (newProps.panel.items.length != this.props.panel.items.length) || newProps.panel.items.some((item, i) => item._id != this.props.panel.items[i]._id))
            this.updateSort(newProps);
        if (this.props.rasp.shape === 'title' && newProps.rasp.shape !== 'title') {
            let parentId;
            if (parentId = ((newProps.parent && newProps.parent._id) || (newProps.panel && newProps.panel.parent && newProps.panel.parent._id) || newProps.parent || (newProps.panel && newProps.panel.parent)))
                window.socket.emit("get qvote item parent count", parentId, this.okGetQVoteItemParentCount.bind(this)); // update votes
        }
    }

    okGetQVoteItemParentCount(results) {
        // index points to the items, so does panel.items.  Changing answerCount through either pointer changes the item pointed to, which can be referenced by either pointer.  Think 'C' pointers.
        if (results) {
            results.forEach(result => {
                if((typeof this.index[result._id].answerCount !== 'undefined') && (this.index[result._id].answerCount !== result.count)) {
                    this.index[result._id].answerCount=result.count; // set it here but also notify child
                    this.props.rasp.toParent({type: "CHILD_UPDATE", shortId: result.id, item: {answerCount: result.count}});
                }
            })
        }
        var sortedItems = this.props.panel.items.slice().sort((a, b) => a.answerCount - b.answerCount)
        var answeredAll= !sortedItems.some(item=>item.answerCount===0)
        if(answeredAll !== this.state.answeredAll) 
            sortedItems.forEach(item=>{
                this.props.rasp.toParent({type: "CHILD_UPDATE", shortId: item.id, item: {answeredAll}});
                item.answeredAll=answeredAll;
            })
        this.setState({ sortedItems, answeredAll });
    }

    renderChildren(moreProps) {
        return React.Children.map(this.props.children, (child, i) => {
            var { children, ...newProps } = this.props;
            Object.assign(newProps, moreProps, { key: 'ph-' + i });
            return React.cloneElement(child, newProps, child.props.children)
        });
    }

    render() {
        return (
            <section>
                {this.renderChildren(this.state)}
            </section>
        )
    }
}

class RASPPanelQuestions extends RASPPanelItems {

    render() {

        const { limit, skip, type, parent, items, count, rasp, createMethod, cssName, sortedItems, panel, answeredAll, ...otherProps } = this.props;
        delete otherProps['new']; // this is a bad name for a property

        let title = 'Loading items', name, content, loadMore;

        let bgc = 'white';
        let positiveBGC = '#d3d3d3';

        var buttons = type.buttons || ['Answer'];

        content = sortedItems.map(item => {
            if (!this.mounted[item.id]) { // only render this once
                this.mounted[item.id] = (
                    <ItemStore item={item}>
                        <Item
                            {...otherProps}
                            parent={parent}
                            rasp={this.childRASP(this.vM.childShape(rasp, item), item.id)}
                            buttons={buttons}
                            visualMethod={this.vM.childVisualMethod()}
                        />
                    </ItemStore>
                );
            }
            return (
                <Accordion active={this.vM.childActive(rasp, item)} name='item' key={item._id + '-panel-item'} style={{ backgroundColor: (item.answerCount > 0 && rasp.shape === 'truncated') ? positiveBGC : bgc }} >
                    {this.mounted[item.id]}
                </Accordion>
            );
        });

        const end = skip + limit;

        return (
            <section>
                <Accordion active={answeredAll && !rasp.shortId} key="done-directions" className='instruction-text'>
                    {this.props.doneDirections || "Congratulations!! You have completed the community discussion.\n\nYou can use the Community button to see the overal response from the community.\n\n Be sure to come back to this discussion again to add things that you have thought of, or to check on the community response."}
                </Accordion>
                {content}
                {loadMore}
            </section>
        );
    }
}

export class PanelQuestions extends React.Component {
    render() {
        const { panel } = this.props;
        const storeProps = panel ? panel : this.props;

        logger.trace("PanelQuestions render");
        return (
            <PanelStore { ...storeProps }>
                <ReactActionStatePath {...this.props} >
                    <AnswerCount>
                        <PanelHead cssName={'syn-panel-item'} >
                            <RASPPanelQuestions />
                        </PanelHead>
                    </AnswerCount>
                </ReactActionStatePath>
            </PanelStore>
        );
    }
}


export default PanelQuestions;




