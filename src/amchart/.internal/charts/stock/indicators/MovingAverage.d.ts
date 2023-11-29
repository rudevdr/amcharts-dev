import { Indicator, IIndicatorSettings, IIndicatorPrivate, IIndicatorEvents, IIndicatorEditableSetting } from "./Indicator";
import { LineSeries } from "../../xy/series/LineSeries";
export interface IMovingAverageSettings extends IIndicatorSettings {
    /**
     * Type of the moving average.
     *
     * @default "simple"
     */
    type?: "simple" | "weighted" | "exponential" | "dema" | "tema";
    /**
     * Offset.
     *
     * @default 0
     */
    offset?: number;
}
export interface IMovingAveragePrivate extends IIndicatorPrivate {
}
export interface IMovingAverageEvents extends IIndicatorEvents {
}
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare class MovingAverage extends Indicator {
    static className: string;
    static classNames: Array<string>;
    _settings: IMovingAverageSettings;
    _privateSettings: IMovingAveragePrivate;
    _events: IMovingAverageEvents;
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
//# sourceMappingURL=MovingAverage.d.ts.map