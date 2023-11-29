/** @ignore */ /** */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import * as $array from "./Array";
/**
 * @ignore
 */
let pendingFrame = false;
/**
 * @ignore
 */
const nextQueue = [];
/**
 * @ignore
 */
const readQueue = [];
/**
 * @ignore
 */
const writeQueue = [];
/**
 * @ignore
 */
const idleQueue = [];
/**
 * @ignore
 */
const fps = 1000 / 60;
/**
 * [raf description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
export const raf = (typeof requestAnimationFrame === "function"
    ? function (fn) {
        requestAnimationFrame(fn);
    }
    : function (fn) {
        setTimeout(fn, fps);
    });
/**
 * [frameLoop description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
function frameLoop() {
    const now = Date.now();
    const length = nextQueue.length;
    for (let i = 0; i < length; ++i) {
        nextQueue[i](now);
    }
    $array.shiftLeft(nextQueue, length);
    for (let i = 0; i < readQueue.length; ++i) {
        readQueue[i](now);
    }
    readQueue.length = 0;
    for (let i = 0; i < writeQueue.length; ++i) {
        writeQueue[i](now);
    }
    writeQueue.length = 0;
    if (nextQueue.length === 0 && readQueue.length === 0) {
        pendingFrame = false;
    }
    else {
        raf(frameLoop);
    }
}
/**
 * [pendFrame description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
function pendFrame() {
    if (!pendingFrame) {
        pendingFrame = true;
        raf(frameLoop);
    }
}
/**
 * [nextFrame description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param fn [description]
 */
export function nextFrame(fn) {
    nextQueue.push(fn);
    pendFrame();
}
/**
 * [readFrame description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param fn [description]
 */
export function readFrame(fn) {
    readQueue.push(fn);
    pendFrame();
}
/**
 * [writeFrame description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param fn [description]
 */
export function writeFrame(fn) {
    writeQueue.push(fn);
    pendFrame();
}
/**
 * [whenIdle description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param fn [description]
 */
export function whenIdle(fn) {
    idleQueue.push(fn);
}
/**
 * [triggerIdle description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @todo Maybe don't trigger a callback which was added while in the middle of triggering?
 */
export function triggerIdle() {
    const now = Date.now();
    const length = idleQueue.length;
    for (let i = 0; i < length; ++i) {
        idleQueue.shift()(now);
    }
}
//# sourceMappingURL=AsyncPending.js.map