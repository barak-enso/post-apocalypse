import React, { Component } from "react";
import ReactDOM from "react-dom";
import AceEditor from "react-ace";
import {MessageRow, TargetControlPanel, TargetWindowRow} from "./components/views/";
import Store from "./components/store";

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
        switch (event.keyCode) {
            case 90: //z
                return;
            case 88: //x
                return;
            case 67: //c
                // let { log = [] } = _traffic.state || {};
                // log = [];
                // localStorage.setItem("log", JSON.stringify(log.slice(0, 1000)))
                // this.setState({ log })
                // this.props.clearLog();
                return;
            default:
                break;
        }
    
        switch (event.key) {
            // Moving up and down
            // Either arrow keys, tab/shift+tab, or ctrl+j/ctrl+k (what's used in vim sometimes)
            case "ArrowUp": {
                let previous = handle.previous().select();
                document.querySelector("#"+previous.id).scrollIntoView(
                    {block: "nearest", inline: "nearest"}
                    );
                // element.scrollIntoView();
                event.preventDefault()
                break;
            }
            case "ArrowDown": {
                let next = handle.next().select();
                document.querySelector("#"+next.id).scrollIntoView(
                    {block: "nearest", inline: "nearest"}
                    // {block: "end", inline: "nearest"}
                    );
                event.preventDefault()
                break;
            }
    
            case "Delete": {
                // let { selectedIndex = 0 } = this.state || {};
                // this.props.clearLog(selectedIndex);
                break;
            }
            case "ArrowRight": {
                break;
            }
            case "Tab": {
                break;
            }
    
            case "Enter": {
                break;
            }
            case "Escape": {
    
            }
            default:
                break;
        }
    }

    render() {
        const {store} = this;
        const { messages ,targets} = this.store;
        return <div>
            <div className="traffic-panel" 
            // onKeyDown={(e)=>this.onKeyDown(e)}
            >
                <div className="log" onKeyDown={e => this.onKeyDown(e, store.selectedMessage)} tabIndex="0">
                    {(messages).map((message, index) => 
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