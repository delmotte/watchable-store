'use strict';

const Rx = require('rx');

/**
 *
 * @param o the object to deep freeze
 * @returns {*}
 */
Object.prototype.deepFreeze = function(o) {
    Object.freeze(o);
    Object.getOwnPropertyNames(o).forEach(function (prop) {
        if (o.hasOwnProperty(prop)
            && o[prop] !== null
            && (typeof o[prop] === "object" || typeof o[prop] === "function")
            && !Object.isFrozen(o[prop])) {
            Object.deepFreeze(o[prop]);
        }
    });
    return o;
};

/**
 *
 * Base Store to extend
 * @param object
 * @returns {{data (Immutable), data$: Observable<T>}}
 * @constructor
 *
 * data attribute contains the state of the store
 *
 * You can subscribe to data$ to be notified when data change
 * Example :
 * let subscription = store.data$.subscribe(success, error)
 * subscription.dispose() // when you're done with it
 * 
 */
function BaseStore(initialData) {
    let _observer = null;
    return {
        get data() {
            return initialData;
        },
        set data(t) {
            initialData = Object.deepFreeze(t);
            _observer.next(initialData);
        },
        data$: Rx.Observable.create(observer => _observer = observer).share()
    }
}

module.exports = BaseStore;