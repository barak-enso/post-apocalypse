class TargetWindow {
    constructor (href, store) {
        Object.assign(this,{
            href,
            sent: [],
            received: [],
            sendingCount: 0,
            receivingCount: 0,
            messages: [],
            store
        })
    }
    
    addMessage (message) {
        const {
            sendingWindow,
            receivingWindow,
        } = message;
        const {href} = this;
        if (typeof (sendingWindow) === "undefined") return
        if (typeof (receivingWindow) === "undefined") return
        this.messages.unshift(message)
        if (sendingWindow === href) { //
            this.sendingCount++;
        }
        if (receivingWindow === href) {
            this.receivingCount++;
        }
    }
    select(){
        this.store.selectedTarget = this;
        this.store.trigger("change")
        return this;
    }
    unSelect() {
        this.store.selectedTarget = undefined;
        this.store.trigger("change");
        return this;
    }

    get index (){
        return this.store.targets.indexOf(this);
    }

    get selected (){
        return this.store.selectedTarget === this;
        
    }

    get id () {
        return `target-${this.index}`;
    }
    
    delete (){}
    selectAll (){}

    next (){
        let _index = this.index;
        let target = (_index + 1 === this.store.targets.length) ? this.store.targets[_index] : this.store.targets[_index+1]
        return target || this.store.targets[0]
    }
    previous (){
        let _index = this.index;
        let target = (_index === 0) ? this : this.store.targets[_index-1]
        return target || this.store.targets[0]
    }
}

class Message {
    constructor (message,store){
        this.store = store;
        const {sendingWindow, receivingWindow} = message;
        this.sendingWindowUrl = new URL(sendingWindow)
        this.receivingWindowUrl = new URL(receivingWindow)
        Object.assign(this,message);
        store.on("selection", index=>{
            if (index!==store._heap.indexOf(this)) {
                this.unSelect()
                store.trigger("change")
            }
            
        })
    }

    get senderDomain () {
        return this.sendingWindowUrl.hostname
    }

    get receiverDomain () {

        // console.log(this.receivingWindowUrl.hostname)
        return this.receivingWindowUrl.hostname
    }

    toString(minimize){
        const {data} = this;
        return typeof(data) === "object" ? JSON.stringify(data, null, minimize ? "": "\t") : data.toString()
    }

    select(){
        this.store.selectMessage(this)
        this.store.trigger("change")
        return this;
    }
    unSelect(inStore) {
        this.store.trigger("change");
    }

    get selected (){
        return this.store.selectedMessage === this;
    }
    delete (fromStore){
    
    }

    get index (){
        return this.store.messages.indexOf(this);
    }

    get id () {
        return `message-${this.index}`;
    }

    next (){
        let _index = this.index;
        return (_index + 1 === this.store.messages.length) ? this.store.messages[_index] : this.store.messages[_index+1]
    }
    previous (){
        let _index = this.index;
        return (_index === 0) ? this : this.store.messages[_index-1]
    }
    
}

export default class Store {
    constructor() {
        this.editorMessage="";
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

    input(e){
        this.serachTerm = event.target.value
    }

    add(...messages) {
        const store = this;
        messages.forEach(message=>{
            try {
                const {
                    sendingWindow,
                    receivingWindow,
                    dataType,
                    data,
                    ts=Date.now()
                } = message;
                message.ts=message.ts;
                
                let _message = new Message(message,store);
                this._rawMessages.push(message);
                this.messages.unshift(_message);
                    ([
                        sendingWindow,
                        receivingWindow
                    ]).forEach(targetHref=>{
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
    
    deleteMessages(message) {
        return this;
    }

    clear() {
        return this
    }

    selectMessage(message){
        this.selectedMessage = message;
        this.editorMessage = message.toString();
        this.editorMessageTargetType = message.dataType;
        this.trigger("change")
    }
    
    on(eventName, listner) {
        if (!listner) return;
        this.listners[eventName] = this.listners[eventName] || new Set();
        this.listners[eventName].add(listner);
        return this;
    }

    trigger(eventName, value) {
        this.listners[eventName] = this.listners[eventName] || new Set();
        this.listners[eventName].forEach(handler => handler.call(this,value));
        return this;
    }
}