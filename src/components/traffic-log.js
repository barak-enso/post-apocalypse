import React, { Component } from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";

export default class Traffic extends Component {
    // componentDidMount() {
        
    // }

    // onKeyPress(e) {
    //     let _traffic = this;
    //     if (!(e.altKey)) return
    //     switch (e.keyCode) {
    //         case 90: //z
    //             break;
    //         case 88: //x
    //             break;
    //         case 67: //c
    //             // let { log = [] } = _traffic.state || {};
    //             // log = [];
    //             // localStorage.setItem("log", JSON.stringify(log.slice(0, 1000)))
    //             // this.setState({ log })
    //             this.props.clearLog();
    //             break;
    //         default:
    //             break;
    //     }
    // }

    onKeyDown(event) {
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
                this.props.clearLog();
                return;
            default:
                break;
        }
    
        switch (event.key) {
            // Moving up and down
            // Either arrow keys, tab/shift+tab, or ctrl+j/ctrl+k (what's used in vim sometimes)
            case "ArrowUp": {
                let { log =[] } = this.props;
                let { selectedIndex = 0 } = this.state || {};
                selectedIndex--;
                selectedIndex = (selectedIndex < 0) ? 0 : selectedIndex;
                this.selectItemByIndex(selectedIndex)
                event.preventDefault()
                break;
            }
            case "ArrowDown": {
                let { log =[] } = this.props;
                let { selectedIndex = 0 } = this.state || {};
                selectedIndex++;
                selectedIndex = log.length ? 
                    (selectedIndex > log.length) ?
                        log.length - 1:
                        selectedIndex :
                    0;
                this.selectItemByIndex(selectedIndex)
                event.preventDefault()
                break;
            }

            case "Delete": {
                let { selectedIndex = 0 } = this.state || {};
                this.props.clearLog(selectedIndex);
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

    selectItemByIndex(selectedIndex) {
        let { log } = this.props;
        this.props.loadItem(log[selectedIndex]);
        this.setState({selectedIndex})
    }

    render() {
        let { selectedIndex = 0 } = this.state || {};
        let { log } = this.props;
        return <div className="traffic" onKeyDown={(e) => { this.onKeyDown(e) }}>
            <div className="header row">
                <span>sender</span>
                <span>receiver</span>
                <span>data</span>
            </div>
            <div className="body">
                {log.map((item, index) => {
                    const { sendingWindow, receivingWindow, data, label } = item;
                    let _sendingWindow = new URL(sendingWindow)
                    let _receivingWindow = new URL(receivingWindow)
                    return (
                        <div className={classnames("row",
                            label,
                            _sendingWindow.host === "post.apocalypse" ? "sent-from-me" : "",
                            _receivingWindow.host === "post.apocalypse" ? "sent-to-me" : "",
                            selectedIndex === index ? "selected" : null)} key={index} onClick={() => this.selectItemByIndex(index)} tabIndex="0" onFocus={(e) => this.props.loadItem(item)}>
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
