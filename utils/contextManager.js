// contextManager.js
class ContextManager {
    constructor() {
        this.context = {};
    }

    setData(key, value) {
        this.context[key] = value;
    }

    getData(key) {
        return this.context[key];
    }

    clearContext() {
        this.context = {};
    }
}

module.exports = new ContextManager();
