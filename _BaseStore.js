'use strict';

const Rx = require('rx');

/**
 *
 * @param o the object to deep freeze
 * @returns {*}
 */
function deepFreeze(o) {
    Object.freeze(o);

    Object.getOwnPropertyNames(o).forEach(function (prop) {
        if (o.hasOwnProperty(prop)
            && o[prop] !== null
            && (typeof o[prop] === "object" || typeof o[prop] === "function")
            && !Object.isFrozen(o[prop])) {
            deepFreeze(o[prop]);
        }
    });

    return o;
}

/**
 *
 * Base Store to extend
 *
 * data attribute contains the state of the store
 *
 * You can subscribe to data$ to be notified when data change
 * Example :
 * let subscription = store.data$.subscribe(success, error)
 * subscription.dispose() // when you're done with it
 *
 */
function BaseStore(initialData, options = {}) {
    let _observer = null;
    const data$ = Rx.Observable.create(observer => _observer = observer).share();

    return {
        get data() {
            return initialData;
        },
        set data(t) {
            initialData = options.disableDeepFreeze ? t : deepFreeze(t);
            _observer.next(initialData);
        },
        watch(cb) {
            return data$.subscribe(cb);
        },
        unwatch(handle) {
            handle.dispose();
        }
    };
}

module.exports = BaseStore;
