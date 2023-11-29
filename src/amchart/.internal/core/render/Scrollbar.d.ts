import type { Animation } from "../util/Entity";
import type { Time } from "../util/Animation";
import { RoundedRectangle } from "../render/RoundedRectangle";
import { Container, IContainerPrivate, IContainerSettings, IContainerEvents } from "./Container";
import { Button } from "./Button";
export interface IScrollbarSettings extends IContainerSettings {
    /**
     * Orientation of the scrollbar.
     */
    orientation: "horizontal" | "vertical";
    /**
     * Relative start of the selected range, with 0 meaning beginning, and 1 the
     * end.
     */
    start?: number;
    /**
     * Relative end of the selected range, with 0 meaning beginning, and 1 the
     * end.
     */
    end?: number;
    /**
     * Number of milliseconds to play scroll animations for.
     */
    animationDuration?: number;
    /**
     * Easing function to use for animations.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/animations/#Easing_functions} for more info
     */
    animationEasing?: (t: Time) => Time;
}
export interface IScrollbarPrivate extends IContainerPrivate {
    /**
     * @ignore
     */
    isBusy?: boolean;
    /**
     * @ignore
     */
    positionTextFunction?: (position: number) => string;
}
export interface IScrollbarEvents extends IContainerEvents {
    /**
     * Invoked when range of the selection changes.
     */
    rangechanged: {
        start: number;
        end: number;
        grip?: "start" | "end";
    };
}
/**
 * A control that allows zooming chart's axes, or other uses requiring range
 * selection.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/} for more info
 */
export declare class Scrollbar extends Container {
    _addOrientationClass(): void;
    _settings: IScrollbarSettings;
    _privateSettings: IScrollbarPrivate;
    _events: IScrollbarEvents;
    static className: string;
    static classNames: Array<string>;
    /**
     * A thumb elment - a draggable square between the grips, used for panning
     * the selection.
     */
    thumb: RoundedRectangle;
    /**
     * Start grip button.
     */
    startGrip: Button;
    /**
     * End grip button.
     */
    endGrip: Button;
    protected _thumbBusy: boolean;
    protected _startDown: boolean;
    protected _endDown: boolean;
    protected _thumbDown: boolean;
    protected _gripDown?: "start" | "end";
    protected _makeButton(): Button;
    protected _makeThumb(): RoundedRectangle;
    protected _handleAnimation(animation: Animation<any>): void;
    protected _afterNew(): void;
    _updateChildren(): void;
    _changed(): void;
    /**
     * @ignore
     */
    updateGrips(): void;
    protected _updateThumb(): void;
    protected _updateGripsByThumb(): void;
}
//# sourceMappingURL=Scrollbar.d.ts.map