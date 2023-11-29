import { RoundedRectangle, IRoundedRectangleSettings, IRoundedRectanglePrivate } from "../../../core/render/RoundedRectangle";
export interface ICandlestickSettings extends IRoundedRectangleSettings {
    /**
     * X0 position of the low value in pixels.
     */
    lowX0?: number;
    /**
     * Y0 position of the low value in pixels.
     */
    lowY0?: number;
    /**
     * X2 position of the low value in pixels.
     */
    lowX1?: number;
    /**
     * Y1 position of the low value in pixels.
     */
    lowY1?: number;
    /**
     * X0 position of the high value in pixels.
     */
    highX0?: number;
    /**
     * Y0 position of the high value in pixels.
     */
    highY0?: number;
    /**
     * Xz position of the high value in pixels.
     */
    highX1?: number;
    /**
     * Y1 position of the high value in pixels.
     */
    highY1?: number;
    /**
     * Orientation of the cnadlestick.
     */
    orientation?: "horizontal" | "vertical";
}
export interface ICandlestickPrivate extends IRoundedRectanglePrivate {
}
/**
 * A candle element used in a [[CandlestickSeries]].
 */
export declare class Candlestick extends RoundedRectangle {
    _settings: ICandlestickSettings;
    _privateSettings: ICandlestickPrivate;
    static className: string;
    static classNames: Array<string>;
    _beforeChanged(): void;
    _draw(): void;
}
//# sourceMappingURL=Candlestick.d.ts.map