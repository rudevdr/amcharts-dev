import { Container, IContainerPrivate, IContainerSettings } from "../../core/render/Container";
import { Graphics } from "../../core/render/Graphics";
import { Percent } from "../../core/util/Percent";
export interface IClockHandSettings extends IContainerSettings {
    /**
     * A width of the tip of the clock hand, in pixels.
     *
     * @default 1
     */
    topWidth?: number;
    /**
     * A width of the base of the clock hand, in pixels.
     *
     * @default 10
     */
    bottomWidth?: number;
    /**
     * Radius of the hand, in pixels, or percent (relative to the axis radius).
     *
     * If set to negative number, will mean number of pixels inwards from the
     * axis.
     *
     * @default 90%
     */
    radius?: number | Percent;
    /**
     * Inner radius of the hand, in pixels, or percent (relative to the axis
     * radius).
     *
     * If set to negative number, will mean number of pixels inwards from the
     * axis.
     *
     * @default 0
     */
    innerRadius?: number | Percent;
    /**
     * Radius of the hand pin (circle at the base of the hand), in pixels, or in
     * percent (relative to the axis radius.)
     *
     * @default 10
     */
    pinRadius?: number | Percent;
}
export interface IClockHandPrivate extends IContainerPrivate {
}
/**
 * A clock hand for use with [[RadarChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands} for more info
 * @important
 */
export declare class ClockHand extends Container {
    _settings: IClockHandSettings;
    _privateSettings: IClockHandPrivate;
    static className: string;
    static classNames: Array<string>;
    /**
     * A "hand" element.
     *
     * @default Graphics.new()
     */
    readonly hand: Graphics;
    /**
     * A "pin" element (hand's base).
     *
     * @default Graphics.new()
     */
    readonly pin: Graphics;
    protected _afterNew(): void;
    _prepareChildren(): void;
}
//# sourceMappingURL=ClockHand.d.ts.map