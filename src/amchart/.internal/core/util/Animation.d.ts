import type { Entity, Animation } from "./Entity";
import { Percent } from "./Percent";
import { Color } from "./Color";
import type { Easing } from "./Ease";
import { EventDispatcher, Events } from "./EventDispatcher";
export declare type Animations<T> = {
    [K in keyof T]?: Animation<T[K]>;
};
/**
 * @ignore
 */
export declare function waitForAnimations<T>(animations: Animations<T> | undefined): Promise<void>;
interface ITime {
    readonly tag: unique symbol;
}
/**
 * New type which allows for conversion from a number into a Time, but not from a Time to a number
 */
export declare type Time = number | ITime;
/**
 * @ignore
 */
export declare function normalize(value: number, min: number, max: number): Time;
/**
 * @ignore
 */
export declare function range(diff: Time, from: number, to: number): number;
/**
 * @ignore
 */
export declare function defaultInterpolate<A, B>(diff: Time, from: A, to: B): A | B;
/**
 * @ignore
 */
export declare function percentInterpolate(diff: Time, from: Percent, to: Percent): Percent;
/**
 * @ignore
 */
export declare function colorInterpolate(diff: Time, from: Color, to: Color): Color;
/**
 * @ignore
 */
export declare function getInterpolate(from: number, to: number): typeof range;
/**
 * @ignore
 */
export declare function getInterpolate(from: Percent, to: Percent): typeof percentInterpolate;
/**
 * @ignore
 */
export declare function getInterpolate(from: any, to: any): typeof defaultInterpolate;
export interface IAnimation {
    _runAnimation(_currentTime: number): boolean;
}
/**
 * @ignore
 */
export interface IEntityEvents {
    started: {};
    stopped: {};
    ended: {};
    progress: {
        progress: number;
    };
}
/**
 * @ignore
 */
export declare class AnimationTime implements IAnimation {
    protected _entity: Entity;
    protected _duration: number;
    protected _playingDuration: number | null;
    protected _startingTime: number | null;
    protected _current: Time;
    protected _from: Time;
    protected _to: Time;
    _events: IEntityEvents;
    events: EventDispatcher<Events<this, this["_events"]>>;
    easing: Easing | undefined;
    constructor(entity: Entity, duration: number);
    private _stopEvent;
    _runAnimation(currentTime: number): boolean;
    private _play;
    get duration(): number;
    set duration(value: number);
    get current(): Time;
    stop(): void;
    jumpTo(value: Time): void;
    tweenTo(value: Time): void;
}
export {};
//# sourceMappingURL=Animation.d.ts.map