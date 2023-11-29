import { Indicator, IIndicatorSettings, IIndicatorPrivate, IIndicatorEvents, IIndicatorEditableSetting } from "./Indicator";
import { LineSeries } from "../../xy/series/LineSeries";
export interface IVWAPSettings extends IIndicatorSettings {
}
export interface IVWAPPrivate extends IIndicatorPrivate {
}
export interface IVWAPEvents extends IIndicatorEvents {
}
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare class VWAP extends Indicator {
    static className: string;
    static classNames: Array<string>;
    _settings: IVWAPSettings;
    _privateSettings: IVWAPPrivate;
    _events: IVWAPEvents;
    /**
     * Indicator series.
     */
    series: LineSeries;
    _editableSettings: IIndicatorEditableSetting[];
    protected _afterNew(): void;
    _prepareChildren(): void;
    /**
     * @ignore
     */
    prepareData(): void;
}
//# sourceMappingURL=VWAP.d.ts.map