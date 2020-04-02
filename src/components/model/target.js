export default class TargetWindow {
    constructor(href, store) {
        Object.assign(this, {
            href,
            sent: [],
            received: [],
            sendingCount: 0,
            receivingCount: 0,
            messages: [],
            store
        })
    }

    addMessage(message) {
        const {
            sendingWindow,
            receivingWindow,
        } = message;
        const { href } = this;
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
    select() {
        this.store.selectedTarget = this;
        this.store.trigger("change")
        return this;
    }
    unSelect() {
        this.store.selectedTarget = undefined;
        this.store.trigger("change");
        return this;
    }

    get index() {
        return this.store.targets.indexOf(this);
    }

    get selected() {
        return this.store.selectedTarget === this;

    }

    get id() {
        return `target-${this.index}`;
    }

    delete() { }
    selectAll() { }

    next() {
        let _index = this.index;
        let target = (_index + 1 === this.store.targets.length) ? this.store.targets[_index] : this.store.targets[_index + 1]
        return target || this.store.targets[0]
    }
    previous() {
        let _index = this.index;
        let target = (_index === 0) ? this : this.store.targets[_index - 1]
        return target || this.store.targets[0]
    }

    handleKeyDownEvent(event) {
        // console.log(event)
    }
}