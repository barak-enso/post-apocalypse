import React, { Component } from "react";
import ReactDOM from "react-dom";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-vibrant_ink";
import "./malwindow.scss"

ace.config.setModuleUrl('ace/mode/json_worker', '/node_modules/ace-builds/src-noconflict/worker-json.js')

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


class Traffic extends Component {
    componentDidMount() {
        var _log;
        var origins = {};
        try {
            _log = JSON.parse(localStorage.getItem("log"));
            _log.forEach(m => this.props.addOriginToList(m));

        } catch (error) {
            console.log(error)
            _log = []
        }
        let _traffic = this;
        const wsClient = new WebSocket(`ws://${window.location.host}/malwindow-api`);
        wsClient.addEventListener("message", ({ data }) => {
            this.props.addOriginToList(data);
            let { log = [] } = _traffic.state || {};
            log.unshift(JSON.parse(data));
            log = log.slice(0, 500);
            _log = log;
            this.setState({ log, origins })
        })
        window.addEventListener("beforeunload", () => {
            localStorage.setItem("log", JSON.stringify(_log))
            localStorage.setItem("origins", JSON.stringify(_origins))
        })
        // window.addEventListener("message", (event)=>{
        //     let {data} = event;
        //     console.log(data)
        //     // event
        //     // let { log = [] } = _traffic.state || {};
        //     // log.unshift(JSON.parse(data));
        //     // localStorage.setItem("log",JSON.stringify(log.slice(0,1000)))
        //     // this.setState({ log })
        // })
        this.setState({ log: _log || [], origins })
    }

    onKeyPress(e) {
        let _traffic = this;
        if (!(e.shiftKey && e.ctrlKey)) return
        switch (e.keyCode) {
            case 90: //z
                break;
            case 88: //x
                break;
            case 67: //c
                let { log = [] } = _traffic.state || {};
                log = [];
                localStorage.setItem("log", JSON.stringify(log.slice(0, 1000)))
                this.setState({ log })
                break;
            default:
                break;
        }
    }

    render() {
        let { log = [] } = this.state || {}
        return <div className="traffic" onKeyDown={(e) => { this.onKeyPress(e) }}>
            <div className="header row">
                <span>sender</span>
                <span>receiver</span>
                <span>data</span>
            </div>
            <div className="body">
                {log.map((item, index) => {
                    const { sendingWindow, receivingWindow, data } = item;
                    let _sendingWindow = new URL(sendingWindow)
                    let _receivingWindow = new URL(receivingWindow)
                    return (
                        <div className="row" key={index} onClick={() => this.props.loadItem(item)} tabIndex="0" onFocus={(e) => this.props.loadItem(item)}>
                            <span>{_sendingWindow.host}</span>
                            <span>{_receivingWindow.host}</span>
                            <span>{typeof (data) === "string" ? data : JSON.stringify(data, null, " ")}</span>
                        </div>
                    )

                })}
            </div>
        </div>
    }
}


class App extends Component {
    // openWindow(receivingWindow) {
    //     this.targets = this.targets || {};
    //     if (!this.targets[receivingWindow] || this.targets[receivingWindow].closed) {
    //         this.targets[receivingWindow] = window.open(receivingWindow, Math.random(), "width=350,height=250");
    //         this.targets[receivingWindow].addEventListener("message", console.log)
    //     }
    // }

    sendMessage(receivingWindow, value) {
        // console.log(this.targets[receivingWindow])
        if (this.targets[receivingWindow]) this.targets[receivingWindow].postMessage(value, "*")
    }

    childFrameAction(){
        console.log(arguments)
    }
    childWindowAction(){
        console.log(arguments)
    }

    addOriginToList(message) {
        const {origins = {}} = this;
        let {
            sendingWindow,
            receivingWindow
        } = message;
        origins[sendingWindow] = origins[sendingWindow] || {
            sent: 0,
            received: 0
        }
        origins[sendingWindow].sent++;
        origins[receivingWindow] = origins[receivingWindow] || {
            sent: 0,
            received: 0
        }
        origins[receivingWindow].received++;
        this.origins = origins;
        this.setState({origins})
    }

    render() {
        const { message = {}, origins ={} } = (this.state || {});
        var {
            data,
            sendingWindow,
            receivingWindow
        } = message
        if (data) {
            try {
                data = JSON.stringify(JSON.parse(data), null, " ");
            } catch (error) {

            }
            this.value = data;
        }
        return <div>
            <div className="log">
                <Traffic addOriginToList={(message) => this.addOriginToList(message)} loadItem={(message) => { this.setState({ message }) }}></Traffic>
            </div>
            <div className="editor">
                <Editor onValue={(value) => this.value = value} value={typeof (data) === "string" ? data : JSON.stringify(data, null, " ")} />
                {sendingWindow ? <div className="message-info">
                    <div>
                        <span className="propName">
                            sender
                        </span>
                        <span>
                            {sendingWindow}
                        </span>
                    </div>
                    <div>
                        <span className="propName">
                            receiver
                        </span>
                        <span className="propValue">
                            {receivingWindow}
                        </span>
                    </div>
                </div> : null}
                {/* {JSON.stringify(this.origins)} */}
                { Object.keys(origins).map((origin,index)=>
                    <div className="actions-per-origin" key={index}>
                        <span className="origin">
                            {origin}
                        </span>
                        <span className="sent">
                            &uarr;{origins[origin].sent}
                        </span>/
                        <span className="received">
                            &darr;{origins[origin].received}
                        </span>
                        <span className="actions">
                            <span className="iframe-action"  onClick={() => this.childFrameAction(origin, this.value)}>
                                {origins[origin].frame ? "send message" : "load frame"}
                            </span>
                            <span className="window-action" onClick={() => this.childWindowAction(origin, this.value)}>
                                {origins[origin].childWindow ? "send message" : "open window"}
                            </span>
                        </span>
                        {/* <button onClick={() => this.openWindow(receivingWindow)}>Open Window</button>
                        <button onClick={() => this.sendMessage(receivingWindow, this.value)}>Send Message</button>
                        <button onClick={() => this.loadFrameWindow(receivingWindow)}>Load frame</button>
                        <button onClick={() => this.loadFrameWindow(receivingWindow)}>Load frame</button> */}
                        
                    </div>)}
            </div>
        </div>
    }
}

ReactDOM.render(<App></App>, document.getElementById("root"));