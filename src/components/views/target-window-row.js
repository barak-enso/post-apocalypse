import React, { Component } from "react";
import classnames from "classnames";

export default class TargetWindowRow extends Component {
    render() {
        const { target, store } = this.props;
        const { sendingCount, receivingCount, href, selected, order = 0, id } = target
        return <div
            id={id}
            tabIndex="-1"
            onClick={(e) => target.select()}
            className={classnames(
                "target-window",
                "ellipsis",
                selected ? "selected" : undefined
            )} order={order}>
            <span className="sent">&uarr;{sendingCount}</span>
            <span className="separator">/</span>
            <span className="received">&darr;{receivingCount}</span>
            <span className="href">{href}</span>

        </div>
    }
}