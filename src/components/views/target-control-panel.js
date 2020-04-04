import React, { Component } from "react";

export default class TargetControlPanel extends Component {
    loadFrame(href) {
        const { iframeContainerElement } = this;
        var iFrame = document.createElement("iframe");
        iFrame.setAttribute("src", href);
        iframeContainerElement.appendChild(iFrame);
        this.setState({})
    }

    closeFrame() {
        document.querySelector(`iframe[src="${this.href}"]`).outerHTML = ''
        this.setState({})
    }

    isFrameOpen() {
        return document.querySelector(`iframe[src="${this.href}"]`) ? true : false
    }


    get childWindow() {
        const dummyOrClosedWindow = {
            isWindowOpen: ()=>false,
            close: ()=>{},
            postMessage: ()=>console.log("no handle to window")

        }
        return this.childWindows ? 
            this.childWindows[this.href] ? {
                postMessage: (...args)=> {
                    try {
                        this.childWindows[this.href].postMessage(...args)
                    } catch (error) {
                        console.log(error)
                    }
                },
                isWindowOpen: () => !this.childWindows[this.href].closed,
                close: ()=> {
                    try {
                        this.childWindows[this.href].close();
                        this.setState({})
                    } catch (error) {
                    }
                }
             } : dummyOrClosedWindow : dummyOrClosedWindow
    }

    openWindow() {
        this.childWindows  =  this.childWindows || {};
        try {
            this.childWindows [this.href] = window.open(this.href, `posta-${this.href}`, "width=350,height=250");
            this.setState({})
        } catch (error) {
            console.log(error)
        }
    }

    

    get href() {
        const { store } = this.props;
        const { selectedTarget: { href } } = store;
        if (!href) return
        if (href !== this._lastLoadedHref) {
            (document.querySelector(`iframe[src="${href}"]`) || {}).hidden = false;
            Array.from(document.querySelectorAll(`iframe:not([src="${href}"])`)).forEach(iframe => iframe.hidden = true)
        }
        this._lastLoadedHref = href;
        return href;
    }

    formatMessage (message, format) {
        switch (format) {
            case "object":
                return typeof(message) === "string" ? JSON.parse(message) : message;
            default:
                return message
        }
    }

    sendToFrame(message, format) {
        message = this.formatMessage(message, format);
        try {
            document.querySelector(`iframe[src="${this.href}"]`).contentWindow.postMessage(message, "*");

        } catch (error) {
            console.log(error)
        }
    }

    sendToWindow(message, format) {
        message = this.formatMessage(message, format);
        try {
            this.childWindow.postMessage(message, "*");    
        } catch (error) {
            console.log(error)
        }
        
    }

    onChangeTaret(e) {
        const { store } = this.props;
        store.selectedTarget.userInputHerf = e.target.value;
        this.setState({})
    }

    changeTaretOnEnter(e) {
        const { store } = this.props;
        if (event.key === "Enter") {
            if (store.selectedTarget) store.selectedTarget.userInputHerf = store.selectedTarget.href;
            store.addTargetByHref(e.target.value).select();
            this.setState({})
        }
    }
    
    onlyInput () {
        return <div className="window-control-panel">
            <div className="href">
                <input className="real" onKeyPress={(e)=>this.changeTaretOnEnter(e)}></input>
            </div>
        </div>
    }

    

    render() {
        const { store } = this.props;
        if (!store.selectedTarget) return this.onlyInput();
        var { href, userInputHerf } = store.selectedTarget;
        // if (href !== userInputHerf) return this.onlyInput();
        userInputHerf = userInputHerf || href;
        return <div className="window-control-panel">
            <div className="href">
                <input className="mask" value={href}></input>
                <input className="real with-mask" value={userInputHerf} onChange={(e)=>this.onChangeTaret(e)} onKeyPress={(e)=>this.changeTaretOnEnter(e)}></input>
            </div>
            <span className="iframe">
                <div ref={ref => this.iframeContainerElement = ref}></div>
            </span>

            {([{
                type: "iframe",
                isOpened: this.isFrameOpen.bind(this),
                send: this.sendToFrame.bind(this),
                kill: this.closeFrame.bind(this),
                open: this.loadFrame.bind(this)
            }, {
                type: "window",
                kill: ()=>this.childWindow.close(),
                open: this.openWindow.bind(this),
                isOpened: ()=>this.childWindow.isWindowOpen(),
                send: this.sendToWindow.bind(this)
            }]).map(({
                type,
                isOpened,
                send,
                kill,
                open
            }, index) =>
                <span key={index} className="actions">
                    {type}
                    {!isOpened() ? <button onClick={() => open(href)}>open</button> : <>
                        <button onClick={() => kill()}>kill</button>
                        <div>send</div>
                        <button onClick={() => send(store.editorMessage, store.editorMessageTargetType)}>as is</button>
                        <button onClick={() => send(store.editorMessage, "object")}>as obj</button>
                        <button onClick={() => send(store.editorMessage, "string")}>as str</button>
                        <button onClick={() => send()}>undef</button>
                    </>}
                </span>)}
        </div>
    }
}