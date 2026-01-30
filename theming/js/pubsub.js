
// Simple pub/sub used across multiple theme scripts.
// Attach to window so it survives bundling/minification and is truly global.

let subscribers = {};

function subscribe(eventName, callback) {
    if (subscribers[eventName] === undefined) {
        subscribers[eventName] = [];
    }

    subscribers[eventName] = [...subscribers[eventName], callback];

    return function unsubscribe() {
        subscribers[eventName] = subscribers[eventName].filter((cb) => {
            return cb !== callback;
        });
    };
}

function publish(eventName, data) {
    if (subscribers[eventName]) {
        const promises = subscribers[eventName].map((callback) => callback(data));
        return Promise.all(promises);
    } else {
        return Promise.resolve();
    }
}

// Expose as globals for files like product-info.js, cart.js, etc.
if (typeof window !== 'undefined') {
    window.subscribe = subscribe;
    window.publish = publish;
}
