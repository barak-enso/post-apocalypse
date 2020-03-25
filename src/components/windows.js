import React, { Component } from "react";
// import ReactDOM from "react-dom";

// // export default class Windows extends Component {

// // }
// class Iframe extends Component {
//     componentDidMount() {
//         const { dispatch,href } = this.props;
//         dispatch((message) => {
//             this.frame.contentWindow.postMessage(message, "*")
//         },href)
//     }

    

//     render() {
//         const { href, close } = this.props;
//         const { opened = true } = this.state || {};
//         return opened ? <div ref={frame => this.frame = frame} style={{display:"inline-block", marginRight: 4}}>
//             <iframe src={href}></iframe>
//             <button onClick={() => close()}>close</button>
//         </div> :
//             null
//     }
// }

export default class Windows extends Component {
    componentDidMount() {
        const { onMessage } = this.props;
        this.windowsHandles = {};
        // setInterval(() => {
        //     let dirty = false
        //     Object.keys(this.windowsHandles).forEach(href=>{
        //         if (!this.isWindowOpen(href)) {
        //             dirty = true;
        //             delete this.windowsHandles[href];
        //         }
        //     }) 
        //     if (dirty) this.setState({})
        // }, 2000);

        window.addEventListener("message", (event) => {
            let { data, origin } = event;
            onMessage({
                sendingWindow: origin,
                receivingWindow: "http://evil.window",
                dataType: typeof (data),
                data,
                label: "malwindow-in"
            })
        })
    }

    loadFrame(href) {
        const { windows } = this.props;
        let windowInfo = windows[href];
        const {iframeContainerElement} = windowInfo;
        var iFrame = document.createElement("iframe");
        iFrame.setAttribute("src", href);
        iframeContainerElement.appendChild(iFrame);
        this.setState({})
    }

    closeFrame(href) {
        const { windows } = this.props;
        let windowInfo = windows[href];
        const {iframeContainerElement} = windowInfo;
        iframeContainerElement.innerHTML = '';
        this.setState({})
    }

    isFrameOpen(href) {
        const { windows } = this.props;
        let windowInfo = windows[href] || {};
        const {iframeContainerElement = {children:[]}} = windowInfo;
        return iframeContainerElement.children.length ? true : false;
    }

    windowStatus(href) {
        return (this.windowsHandles[href] || {status:""}).status
    }

    openWindow(href) {
        try {
            const _w = window.open(href, `mywindow${Object.keys(this.windowsHandles).length+1}`, "width=350,height=250");
            this.windowsHandles[href] = {
                status: " opened-window",
                handle: _w
            };
            this.setState({})
        } catch (error) {
            this.windowsHandles[href] = {
                status: " open-window-error",
                handle: _w
            };
        }
    }

    closeWindow(href) {
        try {
            this.windowsHandles[href].handle.close();
            delete this.windowsHandles[href]
            this.setState({})
        } catch (error) {
        }
    }

    dispatch(message, href) {
        const { onMessage } = this.props;
        const { windows } = this.props;
        let windowInfo = windows[href] || {};
        const {iframeContainerElement = {children:[]}} = windowInfo;
        iframeContainerElement.children[0].contentWindow.postMessage(message, "*");
        // onMessage(
        //     {
        //         sendingWindow: "http://evil.window",
        //         receivingWindow: href,
        //         dataType: typeof (message),
        //         data: message,
        //         label: "malwindow-out"
        //     }
        // )
    }



    render() {
        const { windows, valueGetter } = this.props;
        return <div className="windows">
                {Object.keys(windows).map((href, index) =>
                    <div className={`window${
                        this.windowStatus(href)
                    }${
                        this.isFrameOpen(href) ? ' opened-frame': ''}`
                    } key={index}>
                        <div className="href">
                                {href}
                            </div>
                        <span className="sent-received">
                            <span className="sent">
                                &uarr;{windows[href].sent}
                            </span>
                            /
                            <span className="received">
                                &darr;{windows[href].received}
                            </span>
                        </span>
                        <span className="iframe-container" ref={ref => windows[href].iframeContainerElement = ref}></span>
                        <span className="actions">
                            
                            <button className="iframe-action send-to-frame" onClick={() => this.dispatch(valueGetter(),href)}>&#x27A4; frame</button>
                            <button className="iframe-action close" onClick={() => this.closeFrame(href)}>kill frame</button>
                            <button className="iframe-action load" onClick={() => this.loadFrame(href)}>+ frame</button>
                            
                            <button className="iframe-action send-to-window" onClick={() => this.sendToWindow(href, valueGetter())}>&#x27A4; window</button>
                            <button className="iframe-action close-window" onClick={() => this.closeWindow(href)}>kill window</button>
                            <button className="iframe-action open" onClick={() => this.openWindow(href)}>+ window</button>
                        </span>
                    </div>)}
        </div>
    }
}