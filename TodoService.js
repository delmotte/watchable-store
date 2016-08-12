'use strict';

const BaseStore = require('./_BaseStore');

function TodoService() {

    const service = BaseStore([{text: 'coucou'}]);
    service.reset = function () {
        this.data = [];
    };
    service.add = function (todo) {
        this.data = this.data.concat(todo);
        return Promise.resolve(todo);
    };
    return service;

}

module.exports = TodoService();