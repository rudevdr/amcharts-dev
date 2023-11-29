import { __awaiter } from "tslib";
import { Percent } from "./Percent";
import { Color } from "./Color";
import { EventDispatcher } from "./EventDispatcher";
import * as $object from "./Object";
/**
 * @ignore
 */
export function waitForAnimations(animations) {
    return __awaiter(this, void 0, void 0, function* () {
        if (animations !== undefined) {
            const promises = [];
            $object.each(animations, (_, animation) => {
                promises.push(animation.waitForStop());
            });
            yield Promise.all(promises);
        }
    });
}
/**
 * @ignore
 */
export function normalize(value, min, max) {
    if (min === max) {
        return 0;
    }
    else {
        return Math.min(Math.max((value - min) * (1 / (max - min)), 0), 1);
    }
}
/**
 * @ignore
 */
export function range(diff, from, to) {
    return from + (diff * (to - from));
}
/**
 * @ignore
 */
export function defaultInterpolate(diff, from, to) {
    if (diff >= 1) {
        return to;
    }
    else {
        return from;
    }
}
/**
 * @ignore
 */
export function percentInterpolate(diff, from, to) {
    return new Percent(range(diff, from.percent, to.percent));
}
/**
 * @ignore
 */
export function colorInterpolate(diff, from, to) {
    return Color.interpolate(diff, from, to);
}
/**
 * @ignore
 */
export function getInterpolate(from, to) {
    if (typeof from === "number" && typeof to === "number") {
        return range;
    }
    if (from instanceof Percent && to instanceof Percent) {
        return percentInterpolate;
    }
    if (from instanceof Color && to instanceof Color) {
        return colorInterpolate;
    }
    return defaultInterpolate;
}
/**
 * @ignore
 */
export class AnimationTime {
    constructor(entity, duration) {
        Object.defineProperty(this, "_entity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_duration", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_playingDuration", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "_startingTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "_current", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_from", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_to", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new EventDispatcher()
        });
        Object.defineProperty(this, "easing", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._entity = entity;
        this._duration = duration;
    }
    _stopEvent() {
        const type = "stopped";
        if (this.events.isEnabled(type)) {
            this.events.dispatch(type, { type: type, target: this });
        }
    }
    _runAnimation(currentTime) {
        if (this._playingDuration !== null) {
            if (this._startingTime === null) {
                this._startingTime = currentTime;
                return true;
            }
            else {
                const diff = (currentTime - this._startingTime) / this._playingDuration;
                if (diff >= 1) {
                    this._playingDuration = null;
                    this._startingTime = null;
                    this._from = this._to;
                    this._current = this._to;
                    this._entity.markDirty();
                    this._stopEvent();
                    const type = "ended";
                    if (this.events.isEnabled(type)) {
                        this.events.dispatch(type, { type: type, target: this });
                    }
                    return false;
                }
                else {
                    this._current = range(diff, this._from, this._to);
                    this._entity.markDirty();
                    const type = "progress";
                    if (this.events.isEnabled(type)) {
                        this.events.dispatch(type, { type: type, target: this, progress: diff });
                    }
                    return true;
                }
            }
        }
        else {
            return false;
        }
    }
    _play() {
        this._from = this._current;
        if (this._playingDuration === null) {
            this._entity._root._addAnimation(this);
            const type = "started";
            if (this.events.isEnabled(type)) {
                this.events.dispatch(type, { type: type, target: this });
            }
        }
        else {
            this._startingTime = null;
        }
        this._playingDuration = Math.abs(this._to - this._from) * this._duration;
    }
    get duration() {
        return this._duration;
    }
    set duration(value) {
        if (this._duration !== value) {
            this._duration = value;
            if (value === 0) {
                this.jumpTo(this._to);
            }
            else if (this._current !== this._to) {
                this._play();
            }
        }
    }
    get current() {
        if (this.easing) {
            return this.easing(this._current);
        }
        else {
            return this._current;
        }
    }
    stop() {
        this.jumpTo(this._current);
    }
    jumpTo(value) {
        if (this._current !== value) {
            this._entity.markDirty();
        }
        if (this._playingDuration !== null) {
            this._stopEvent();
        }
        this._playingDuration = null;
        this._startingTime = null;
        this._current = value;
        this._from = value;
        this._to = value;
    }
    tweenTo(value) {
        if (this._current === value || this._duration === 0) {
            this.jumpTo(value);
        }
        else {
            if (this._to !== value) {
                this._to = value;
                this._play();
            }
        }
    }
}
/*export class AnimationValue extends AnimationTime {
    public _min: number;
    public _max: number;

    constructor(entity: Entity, duration: number, min: number, max: number) {
        super(entity, duration);
        this._min = min;
        this._max = max;
    }

    public get min(): number {
        return this._min;
    }

    public set min(value: number) {
        if (this._min !== value) {
            this._min = value;
            this._entity.markDirty();
        }
    }

    public get max(): number {
        return this._max;
    }

    public set max(value: number) {
        if (this._max !== value) {
            this._max = value;
            this._entity.markDirty();
        }
    }

    public currentValue(): number {
        return range(super.currentTime(), this._min, this._max);
    }

    public jumpToValue(value: number) {
        super.jumpToTime(normalize(value, this._min, this._max));
    }

    public tweenToValue(value: number) {
        super.tweenToTime(normalize(value, this._min, this._max));
    }
}
*/
//# sourceMappingURL=Animation.js.map