import { Indicator, IIndicatorSettings, IIndicatorPrivate, IIndicatorEvents, IIndicatorEditableSetting } from "./Indicator";
import { LineSeries } from "../../xy/series/LineSeries";
export interface IZigZagSettings extends IIndicatorSettings {
    /**
     * Percentage of price movement you want to set as your threshold
     */
    deviation?: number;
    /**
     * The minimum number of price bars required where there is no secondary high or low.
     */
    depth?: number;
}
export interface IZigZagPrivate extends IIndicatorPrivate {
}
export interface IZigZagEvents extends IIndicatorEvents {
}
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare class ZigZag extends Indicator {
    static className: string;
    static classNames: Array<string>;
    _settings: IZigZagSettings;
    _privateSettings: IZigZagPrivate;
    _events: IZigZagEvents;
    /**
     * Indicator series.
     */
    series: LineSeries;
    _editableSettings: IIndicatorEditableSetting[];
    _prepareChildren(): void;
    protected _afterNew(): void;
    /**
     * @ignore
     */
    prepareData(): void;
}
//# sourceMappingURL=ZigZag.d.ts.map