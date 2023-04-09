'use strict';

class AppClass {
    constructor() {
        for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            this[name] = this[name].bind(this);
        }
    }

    getErrors() {
        return this.errors || {};
    }
}

module.exports = exports = AppClass;
