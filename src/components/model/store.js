import Message from "./message";
import TargetWindow from "./target";


export default class Store {
    constructor() {
        this.editorMessage = "";
        this.log = [];
        this._rawMessages = [];
        this.messages = [];
        this.targets = [];
        this.selectedTargets = new Set();
        this.selectedMessages = new Set();
        this.listners = {};


        const wsClient = new WebSocket(`ws${window.location.protocol === "https:" ? "s" : ""}://${window.location.host}/malwindow-api`);
        wsClient.addEventListener("message", ({ data }) => {
            const message = JSON.parse(data);
            message.ts = Date.now()
            this.add(message).trigger("change")
        })

        try {
            let _messages = JSON.parse(localStorage.getItem("store"))
            if (_messages && _messages.length) this.add(..._messages)
        } catch (error) {
            console.log(error)

        }

        window.addEventListener("message", (event) => {
            let { data, origin } = event;
            this.add({
                ts: Date.now(),
                sendingWindow: origin,
                receivingWindow: location.href,
                dataType: typeof (data),
                data
            }).trigger("change");
        })

    }

    input(event) {
        if (!event.target.value) {
            this.filterFunction = () => true;
        }
        const input = event.target.value;
        if (input.startsWith("open:")) {
            console.log("open")
            return
        }
        // this.serachTerm
        try {
            const serachExp = new RegExp(input,"i");
            this.filterFunction = (message = "") => serachExp.exec(JSON.stringify(message.rawMessage))
            this.trigger("change");
        } catch (error) {
            this.filterFunction = (message = "") => JSON.stringify(message.rawMessage).indexOf(input) >=0
            this.trigger("change");
        }

    }

    isMessagevisible(message) {
        return (this.filterFunction || (()=>true))(message)
    }


    add(...messages) {
        const store = this;
        messages.forEach(message => {
            try {
                const {
                    sendingWindow,
                    receivingWindow,
                    dataType,
                    data,
                    ts = Date.now()
                } = message;
                message.ts = message.ts;

                let _message = new Message(message, store);
                this._rawMessages.push(message);
                this.messages.unshift(_message);
                ([
                    sendingWindow,
                    receivingWindow
                ]).forEach(targetHref => {
                    let target = this.targets[targetHref];
                    if (!target) {
                        target = new TargetWindow(targetHref, store);
                        this.targets.push(target);
                        Object.defineProperty(this.targets, targetHref, {
                            value: target
                        })
                    }
                    target.addMessage(_message)
                })
            } catch (error) {
                console.log(error)
            }

        })
        return store
    }


    deleteSelectedMessages() {
        let messageToSelectAfterDeletion = this.messageAtCursor.next();
        let rawMessages = new Set(Array.from(this.selectedMessages).map(m => m.rawMessage));
        this._rawMessages = this._rawMessages.filter(message => !rawMessages.has(message))
        this.messages = this.messages.filter(message => !this.selectedMessages.has(message));
        this.unselectAll()
            .selectMessage(messageToSelectAfterDeletion);
        return this
    }

    clear() {
        return this
    }


    isMessageSelected(message) {
        return this.selectedMessages.has(message);
    }
    selectMessage(message) {
        this.messageCursorIndex = this.messages.indexOf(message);
        this.selectedMessages.add(message);
        this.editorMessage = message.toString();
        this.editorMessageTargetType = message.dataType;
        return this
    }
    unselectMessage(message) {
        this.selectedMessages.delete(message);
    }


    unselectAll() {
        this.selectedMessages = new Set();
        return this
    }

    selectTargetByHref(href){
        this.selectedTarget = this.targets[href];
        return this
        // const targets = this.targets.filter
    }

    get messageAtCursor() {
        this.messageCursorIndex = this.messageCursorIndex || 0;
        return this.messages[this.messageCursorIndex];
    }

    on(eventName, listner) {
        if (!listner) return;
        this.listners[eventName] = this.listners[eventName] || new Set();
        this.listners[eventName].add(listner);
        return this;
    }

    trigger(eventName, value) {
        this.listners[eventName] = this.listners[eventName] || new Set();
        this.listners[eventName].forEach(handler => handler.call(this, value));
        return this;
    }
}