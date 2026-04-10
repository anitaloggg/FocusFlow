/**
 * Timer Web Worker
 * Used to provide a stable 1-second tick even when the main tab is throttled.
 */

let timerId = null;

self.onmessage = function(e) {
    if (e.data === 'start') {
        if (!timerId) {
            timerId = setInterval(() => {
                self.postMessage('tick');
            }, 1000);
        }
    } else if (e.data === 'stop') {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    }
};
