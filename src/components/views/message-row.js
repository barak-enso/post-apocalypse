import React, { Component } from "react";
import classnames from "classnames";


export default class MessageRow extends Component {
    render() {
        const { store, message } = this.props || {};
        if (!message || !store) return null
        const {
            selected,
            sendingWindow,
            receivingWindow,
            receiverDomain,
            senderDomain,
            dataType,
            data,
            id
        } = message;
        return <div
            tabIndex="-1"
            className={classnames(
                "message", 
                receivingWindow === location.href ? "malwindow" : null,
                senderDomain === location.hostname ? "malwindow" : null,
                selected ? "selected" : "")}
            onClick={(event) => message.select(event)}
            id={id}>
            <div className="data ellipsis">
                <span className={classnames("type", dataType)}> {dataType}</span>
                <span>
                    {message.toString(true)}
                </span>

            </div>
            <div className="meta ellipsis">
                <span className="href"> {sendingWindow} </span>
                <span className="arrow">&rarr;</span>
                <span className="href from"> {receivingWindow} </span>
            </div>
        </div>
    }
}