import React, { Component } from "react";
import ReactDOM from "react-dom";
import Traffic from "./components/traffic-log";
import AceEditor from "react-ace";
import Windows from "./components/windows";

import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-vibrant_ink";
import "./malwindow.scss"

class Editor extends Component {
    onValue = value => {
        if (this.props.onValue) this.props.onValue(value);
    };

    render() {
        return (
            <AceEditor
                // ref="aceEditor"
                width="50vw"
                height="50vh"
                mode="json"
                theme="vibrant_ink"
                // enableBasicAutocompletion={true}
                onChange={this.onValue}
                name="pretty-json"
                value={this.props.value}
                editorProps={{ $blockScrolling: true }}
            />
        );
    }
}




class App extends Component {
    componentDidMount(){
        try {
            JSON.parse(localStorage.getItem("log")).forEach(m => this.addMessage(m));
        } catch (error) {
            this.log = [];
            this.windows = {};
            this.setState({ log: this.log, windows: this.windows })
        }
        const wsClient = new WebSocket(`ws${window.location.protocol === "https:" ? "s" : ""}://${window.location.host}/malwindow-api`);
        wsClient.addEventListener("message", ({ data }) => {
            this.addMessage(data);
        })
        window.addEventListener("beforeunload", () => {
            localStorage.setItem("log", JSON.stringify(this.log || []))
        })
    }

    clearLog (index) {
        if (typeof(index)==="number") {
            this.log.splice(index,1);
            this.setState({ log: this.log, windows: this.windows })
            return;
        }
        this.log = [];   
        this.windows = {};
        this.setState({ log: this.log, windows: this.windows })
    }

    addMessage(data){
        var { log = [] } = this || {};
        const newEntry = typeof(data) === "string" ? JSON.parse(data) : data;
        newEntry.ts = Date.now();
        log.unshift(newEntry);
        log = log.slice(0, 500);
        this.addOriginToList(newEntry);
        this.log = log;
        this.setState({ log, windows: this.windows })
    }

    addOriginToList(message) {
        this.windows = this.windows || {}
        let {
            sendingWindow,
            receivingWindow
        } = message;
        
        // if (sendingWindow !== "http://evil.window") {
            this.windows[sendingWindow] = this.windows[sendingWindow] || {
            sent: 0,
            received: 0
            }
            this.windows[sendingWindow].sent++;
        // }
        // if (receivingWindow !== "http://evil.window"){
            this.windows[receivingWindow] = this.windows[receivingWindow] || {
                sent: 0,
                received: 0
            }
            this.windows[receivingWindow].received++;
        // }
    }

    render() {
        const { message = {}, windows ={}, log=[] } = (this.state || {});
        var {
            data,
            sendingWindow,
            receivingWindow,
            dataType
        } = message;
        let dataAsString = typeof (data) === "string" ? data : JSON.stringify(data, null, " ")
        if (data) {
            try {
                data = JSON.stringify(JSON.parse(data), null, " ");
            } catch (error) {

            }
        }
        this.value = data;
        return <div>
            <div className="log">
                <Traffic clearLog={(index)=>this.clearLog(index)} log={log} loadItem={(message) => { this.setState({ message }) }}></Traffic>
            </div>
            <div className="editor">
                <Editor onValue={(value) => this.value = value} value={dataAsString} />
                {sendingWindow ? <div className="message-info">
                        <span className="sent">
                            <span> &uarr;</span>
                            {sendingWindow}
                        </span>
                        <span className="received">
                            <span> &darr;</span>
                            {receivingWindow}
                        </span>
                </div> : <div className="message-info"></div>}
                <Windows windows={windows} valueGetter={
                    ()=>{
                        if (typeof(this.value)===dataType) return this.value;
                        if (typeof(this.value)==="undefined") return
                        switch (dataType) {
                            case "object":
                                return JSON.parse(this.value)
                            default:
                                return this.value
                        }
                    }
                } onMessage={(m)=>this.addMessage(m)}></Windows>
            </div>
        </div>
    }
}

ReactDOM.render(<App></App>, document.getElementById("root"));