'use strict';

import React from 'react';
import Panel from '../panel';
import PanelStore from '../store/panel';
import PanelItems from '../panel-items';
import panelType from '../../lib/proptypes/panel';
import ItemStore from '../store/item';
import update from 'immutability-helper';
import FlipMove from 'react-flip-move';
import QSortFlipItem from '../qsort-flip-item';
import smoothScroll from '../../lib/app/smooth-scroll';
import Instruction from '../instruction';
import Color from 'color';
import Button           from '../util/button';
import ButtonGroup           from '../util/button-group';
import Item from '../item';
import Creator            from '../creator';
import QSortButtonList from '../qsort-button-list';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
import {QSortToggle} from './qsort-items';
import ItemCreator from '../item-creator';
import PanelHead from '../panel-head';

class NextStep extends React.Component {
    render(){
        return (
            <PanelHead {...this.props} cssName={'syn-next-step'} >
                <ReactActionStatePath>
                    <RASPNextStep/>
                </ReactActionStatePath>
            </PanelHead>
        )
    }
}

class RASPNextStep extends ReactActionStatePathClient {

    constructor(props) {
        super(props, 'itemId',1);
        console.info("RASPNextStep constructor");
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  

    actionToState(action, rasp, source,initialRASP){
        var nextRASP={}, delta={};
        if(action.type==="POST_ITEM"){
            setTimeout(()=>this.props.rasp.toParent({ type: "NEXT_PANEL", results: {idea: action.item, parent: this.props.parent, type: this.props.type}}))
            // no state change, the action will be consumed here
        } else if (action.type === "DECENDANT_FOCUS"){
            if(this.props.item && this.props.item.type && this.props.item.type.visualMethod && (this.props.item.type.visualMethod==='ooview')){
              if(action.distance>1) {
                delta.decendantFocus=true;
              }
            }
          } else if (action.type === "DECENDANT_UNFOCUS" && action.distance===1){
            if(rasp.decendantFocus) delta.decendantFocus=false;  // my child has unfocused
          } else
            return null;
        Object.assign(nextRASP,rasp,delta);
        if(nextRASP.decendantFocus) nextRASP.shape='view'; else nextRASP.shape='open';
        if(nextRASP.decendantFocus) nextRASP.pathSegment='d';
        else nextRASP.pathSegment=null;
        return nextRASP;
    }

    segmentToState(action,initialRASP){
        var nextRASP={shape: initialRASP.shape, pathSegment: action.segment}
        if(action.segment==='d') nextRASP.decendantFocus=true;
        if(nextRASP.decendantFocus) nextRASP.shape='view'; else nextRASP.shape='open';
        return {nextRASP, setBeforeWait: true}
    }

    //componentDidMount(){
    //    console.info("NextStep.componentDidMount change shape to open");
    //    setTimeout(()=>this.props.rasp.toParent({type: "DECENDANT_FOCUS"}))  // after this commponent renders, change the shape to open causing the CHANGE_SHAPE event to tricle up
    //}

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {

        const { user, rasp, panelNum, parent } = this.props;

        const buttonStyle={
            display: "inline",
            padding: "0.5em",
            border: "1px solid #666",
            boxSizing: "border-box",
            backgroundColor: "#000" ,
            color: "#fff"
          };

        return (
            <section id="syn-next-step">
                <div className="syn-next-step">
                    <button
                            onClick={()=>this.props.rasp.toParent({type: "PANEL_BUTTON", nextPanel: 0})}
                            title={"Answer this question again"}
                            className="next-step"
                            style={buttonStyle}
                            >
                            <span className="civil-button-text">{"Contribute Another Idea"}</span>
                    </button>
                    <button 
                            onClick={()=>this.props.rasp.toParent({type: "PANEL_BUTTON", nextPanel: 1})}
                            className="next-step"
                            title={"Sort through more ideas that people have written"}
                            style={buttonStyle}
                            >
                            <span className="civil-button-text">{"Sort More Ideas"}</span>
                    </button>
                    <button 
                            onClick={()=>{this.props.rasp.toParent({type: "PANEL_LIST_CLOSE"}); setTimeout(()=>this.props.rasp.toParent({type: "DECENDANT_UNFOCUS"}),0)}}
                            className="next-step"
                            title={"Move on to the next question"}
                            style={buttonStyle}
                            >
                            <span className="civil-button-text">{"Continue to the next Question"}</span>
                    </button>
                </div>
            </section>
        );
    }
}

export default NextStep;



