export default class Message {
    constructor(message, store) {
        this.rawMessage = message;
        this.store = store;
        const { sendingWindow, receivingWindow } = message;
        this.sendingWindowUrl = new URL(sendingWindow)
        this.receivingWindowUrl = new URL(receivingWindow)
        Object.assign(this, message);
        store.on("selection", index => {
            if (index !== store._heap.indexOf(this)) {
                this.unSelect()
                store.trigger("change")
            }

        })
    }

    get senderDomain() {
        return this.sendingWindowUrl.hostname
    }

    get receiverDomain() {

        // console.log(this.receivingWindowUrl.hostname)
        return this.receivingWindowUrl.hostname
    }

    toString(minimize) {
        const { data } = this;
        return typeof (data) === "object" ? JSON.stringify(data, null, minimize ? "" : "\t") : data.toString()
    }

    select(event) {
        switch (true) {
            case event.ctrlKey ? true : false:
                break;
            case event.shiftKey ? true : false:
                this.store
                    .selectMessage(this)
                    .trigger("change")
                break;
            default:
                this.store
                    .unselectAll()
                    .selectMessage(this)
                    .trigger("change")
                break;
        }
        return this;
    }

    get selected() {
        return this.store.isMessageSelected(this)
    }

    delete() {
        this.store.deleteSelectedMessages()
            .trigger("change")
    }

    get index() {
        return this.store.messages.indexOf(this);
    }

    get id() {
        return `message-${this.index}`;
    }

    next() {
        let _index = this.index;
        const next = (_index + 1 === this.store.messages.length) ? this.store.messages[_index] : this.store.messages[_index + 1]
        return next
    }
    previous() {
        let _index = this.index;
        return (_index === 0) ? this : this.store.messages[_index - 1]
    }

    isVisible() {
        return this.store.isMessagevisible(this)
    }

    
    handleKeyDownEvent(event) {
        switch (event.key) {
            case "ArrowRight": {
                if (event.ctrlKey) {
                    // console.log(`open ${this.receivingWindow}`)
                    this.store.selectTargetByHref(this.receivingWindow)
                    .trigger("change")
                }
                // let previous = handle.previous().select(event);
                // document.querySelector("#" + previous.id).scrollIntoView(
                //     { block: "nearest", inline: "nearest" }
                // );
                // // element.scrollIntoView();
                event.preventDefault()
                break;
            }
            case "ArrowLeft": {
                if (event.ctrlKey) {
                    // console.log(`open ${this.sendingWindow}`)
                    this.store.selectTargetByHref(this.sendingWindow)
                    .trigger("change")
                }
                // let next = handle.next().select(event);
                // document.querySelector("#" + next.id).scrollIntoView(
                //     { block: "nearest", inline: "nearest" }
                //     // {block: "end", inline: "nearest"}
                // );
                event.preventDefault()
                break;
            }
        }
    }

}
