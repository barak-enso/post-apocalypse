import React, { Component } from "react";
import ReactDOM from "react-dom";
import AceEditor from "react-ace";
import {MessageRow, TargetControlPanel, TargetWindowRow} from "./components/views/";
import Store from "./components/model/store";

import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-vibrant_ink";
import "./malwindow.scss"

class App extends Component {
    constructor(props) {
        super(props);
        this.store = new Store();
        window.addEventListener("beforeunload", () => {
            return localStorage.setItem("store", JSON.stringify(this.store._rawMessages))  
        })
    }
    componentDidMount(){
        this.store.on("change", ()=>{this.setState({})});
    }

    onKeyDown (event, handle) {
        if (!handle) return
        handle.handleKeyDownEvent(event);
        // switch (event.key) {
        //     // Moving up and down
        //     // Either arrow keys, tab/shift+tab, or ctrl+j/ctrl+k (what's used in vim sometimes)
        //     case "ArrowUp": {
        //         let previous = handle.previous().select(event);
        //         // document.querySelector("#"+previous.id).scrollIntoView(
        //         //     {block: "nearest", inline: "nearest"}
        //         //     );
        //         // element.scrollIntoView();
        //         event.preventDefault()
        //         break;
        //     }
        //     case "ArrowDown": {
        //         let next = handle.next().select(event);
        //         // document.querySelector("#"+next.id).scrollIntoView(
        //         //     {block: "nearest", inline: "nearest"}
        //         //     // {block: "end", inline: "nearest"}
        //         //     );
        //         event.preventDefault()
        //         break;
        //     }
    
        //     case "Delete": {
        //         handle.delete()
        //         // let { selectedIndex = 0 } = this.state || {};
        //         // this.props.clearLog(selectedIndex);
        //         break;
        //     }
        //     default:
                
        //         break;
        // }
    }

    render() {
        const {store} = this;
        const { messages ,targets} = this.store;
        return <div>
            <div className="traffic-panel" 
            // onKeyDown={(e)=>this.onKeyDown(e)}
            >
                <div className="log" onKeyDown={e => this.onKeyDown(e, store.messageAtCursor)} tabIndex="0">
                    {(messages).filter((message)=>message.isVisible()).map((message, index) => 
                                <MessageRow
                                    key={index}
                                    message={message}
                                    store={this.store}>
                                </MessageRow>)}
                </div>
                <div className="targets" onKeyDown={e => this.onKeyDown(e, store.selectedTarget)} tabIndex="0">
                    {targets.map(t=><TargetWindowRow target={t} store={store}></TargetWindowRow>)}
                </div>
            </div>
            <div className="action-panel">
                <AceEditor
                    // ref="aceEditor"
                    width="50vw"
                    height="50vh"
                    mode="json"
                    theme="vibrant_ink"
                    // enableBasicAutocompletion={true}
                    onChange={(value)=>store.editorMessage=value}
                    name="pretty-json"
                    value={store.editorMessage}
                    editorProps={{ $blockScrolling: true }}
                />
                <TargetControlPanel store={store}></TargetControlPanel>
            </div>
            <input placeholder="search" onChange={e=>store.input(e)}></input>
        </div>
    }
}

ReactDOM.render(<App></App>, document.getElementById("root"));